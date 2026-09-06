import { Injectable, Logger } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';
import * as path from 'path';
import { ENV } from '../env';

@Injectable()
export class UploadService {
  private readonly logger = new Logger(UploadService.name);
  private readonly s3Client = new S3Client({
    region: ENV.S3_REGION,
    endpoint: ENV.S3_ENDPOINT,
    credentials: {
      accessKeyId: ENV.S3_ACCESS_KEY_ID,
      secretAccessKey: ENV.S3_SECRET_ACCESS_KEY,
    },
    forcePathStyle: true,
  });

  async uploadFiles(files: any[], folder: string): Promise<string[]> {
    return Promise.all(files.map(file => this.uploadSingleFile(file, folder)));
  }

  private async uploadSingleFile(file: any, folder: string): Promise<string> {
    const filename = `${folder}/${uuidv4()}-${file.originalname.replace(/\\s+/g, '-')}`;
    const provider = ENV.STORAGE_PROVIDER;

    if (provider === 'local') {
      const uploadDir = path.join(process.cwd(), 'public', 'uploads');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      const filePath = path.join(uploadDir, filename);
      fs.writeFileSync(filePath, file.buffer);
      
      const baseUrl = ENV.BACKEND_URL;
      return `${baseUrl}/uploads/${filename}`;
    } else {
      const bucket = ENV.SUPABASE_BUCKET;
      await this.s3Client.send(
        new PutObjectCommand({
          Bucket: bucket,
          Key: filename,
          Body: file.buffer,
          ContentType: file.mimetype,
          ACL: 'public-read',
        }),
      );

      const baseUrl = ENV.SUPABASE_URL;
      return `${baseUrl}/storage/v1/object/public/${bucket}/${filename}`;
    }
  }
}
