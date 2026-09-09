import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';
import * as path from 'path';
import { ENV } from '../env';

@Injectable()
export class UploadService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(UploadService.name);
  private readonly tempDir = path.join(process.cwd(), 'uploads', 'temp');
  private cleanupInterval: NodeJS.Timeout | null = null;

  private readonly s3Client = new S3Client({
    region: ENV.S3_REGION,
    endpoint: ENV.S3_ENDPOINT,
    credentials: {
      accessKeyId: ENV.S3_ACCESS_KEY_ID,
      secretAccessKey: ENV.S3_SECRET_ACCESS_KEY,
    },
    forcePathStyle: true,
  });

  onModuleInit() {
    this.ensureDir(this.tempDir);
    // Auto clear orphaned temp files from any previous crash on startup
    this.clearTempFiles(15 * 60 * 1000);

    // Run auto cleaner every 30 minutes
    this.cleanupInterval = setInterval(() => {
      this.clearTempFiles(15 * 60 * 1000);
    }, 30 * 60 * 1000);
  }

  onModuleDestroy() {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
  }

  private ensureDir(dirPath: string) {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  }

  /**
   * Cleans up temporary files older than maxAgeMs (default: 15 minutes).
   * Pass 0 to clear all temporary files immediately.
   */
  clearTempFiles(maxAgeMs = 15 * 60 * 1000): { deletedCount: number; errors: string[] } {
    let deletedCount = 0;
    const errors: string[] = [];

    try {
      if (!fs.existsSync(this.tempDir)) return { deletedCount: 0, errors: [] };

      const files = fs.readdirSync(this.tempDir);
      const now = Date.now();

      for (const file of files) {
        const filePath = path.join(this.tempDir, file);
        try {
          const stats = fs.statSync(filePath);
          if (stats.isFile() && (now - stats.mtimeMs > maxAgeMs)) {
            fs.unlinkSync(filePath);
            deletedCount++;
            this.logger.log(`Auto-cleared temp file: ${file}`);
          }
        } catch (err: any) {
          errors.push(`Failed to delete ${file}: ${err.message}`);
        }
      }
    } catch (err: any) {
      this.logger.error(`Error reading temp directory: ${err.message}`);
    }

    return { deletedCount, errors };
  }

  async uploadFiles(files: any[], folder: string): Promise<string[]> {
    return Promise.all(files.map(file => this.uploadSingleFile(file, folder)));
  }

  private async uploadSingleFile(file: any, folder: string): Promise<string> {
    // Sanitize filename to avoid invalid characters/spaces in URLs
    const sanitizedName = (file.originalname || 'image')
      .trim()
      .replace(/[^a-zA-Z0-9.-]/g, '-');
    const filename = `${folder}/${uuidv4()}-${sanitizedName}`;
    const provider = ENV.STORAGE_PROVIDER;

    // Temporary file tracker for auto-cleanup on hang or failure
    let tempFilePath: string | null = null;

    // 25-second timeout controller to prevent upload hanging indefinitely
    const abortController = new AbortController();
    const timeout = setTimeout(() => {
      abortController.abort();
    }, 25000);

    try {
      if (provider === 'local') {
        const uploadDir = path.join(process.cwd(), 'uploads', folder);
        this.ensureDir(uploadDir);

        const filePath = path.join(process.cwd(), 'uploads', filename);
        tempFilePath = filePath;

        await fs.promises.writeFile(filePath, file.buffer);
        tempFilePath = null; // Successfully written to destination

        const baseUrl = ENV.BACKEND_URL;
        return `${baseUrl}/uploads/${filename}`;
      } else {
        // In case local temp file is used during staging
        const tempName = `temp-${uuidv4()}-${sanitizedName}`;
        tempFilePath = path.join(this.tempDir, tempName);
        await fs.promises.writeFile(tempFilePath, file.buffer);

        const bucket = ENV.SUPABASE_BUCKET;
        await this.s3Client.send(
          new PutObjectCommand({
            Bucket: bucket,
            Key: filename,
            Body: file.buffer,
            ContentType: file.mimetype,
            ACL: 'public-read',
          }),
          { abortSignal: abortController.signal },
        );

        // Upload to S3 succeeded: clean up local temp file
        if (tempFilePath && fs.existsSync(tempFilePath)) {
          await fs.promises.unlink(tempFilePath).catch(() => {});
          tempFilePath = null;
        }

        const baseUrl = ENV.SUPABASE_URL;
        return `${baseUrl}/storage/v1/object/public/${bucket}/${filename}`;
      }
    } catch (error: any) {
      this.logger.error(`Upload failed or timed out for file ${filename}: ${error.message}`);

      // Auto clear temporary image on hang / error
      if (tempFilePath && fs.existsSync(tempFilePath)) {
        try {
          await fs.promises.unlink(tempFilePath);
          this.logger.log(`Cleaned up temp file after error: ${tempFilePath}`);
        } catch (cleanupErr: any) {
          this.logger.warn(`Failed to cleanup temp file: ${cleanupErr.message}`);
        }
      }

      if (abortController.signal.aborted) {
        throw new Error(`Upload timed out after 25 seconds for ${file.originalname}`);
      }
      throw error;
    } finally {
      clearTimeout(timeout);
    }
  }
}

