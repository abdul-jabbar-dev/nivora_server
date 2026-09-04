import { Injectable, Logger } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class UploadService {
  private readonly logger = new Logger(UploadService.name);
  private readonly s3Client = new S3Client({
    region: process.env.S3_REGION || 'ap-northeast-2',
    endpoint: process.env.S3_ENDPOINT,
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY_ID as string,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY as string,
    },
    forcePathStyle: true,
  });

  async uploadFiles(files: any[]): Promise<string[]> {
    return Promise.all(files.map(file => this.uploadSingleFile(file)));
  }

  private async uploadSingleFile(file: any): Promise<string> {
    const filename = `${uuidv4()}-${file.originalname.replace(/\\s+/g, '-')}`;
    const provider = process.env.STORAGE_PROVIDER || 's3';

    if (provider === 'local') {
      const uploadDir = path.join(process.cwd(), 'public', 'uploads');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      const filePath = path.join(uploadDir, filename);
      fs.writeFileSync(filePath, file.buffer);
      
      const baseUrl = process.env.BACKEND_URL || 'http://localhost:3005';
      return `${baseUrl}/uploads/${filename}`;
    } else {
      const bucket = 'products'; 
      await this.s3Client.send(
        new PutObjectCommand({
          Bucket: bucket,
          Key: filename,
          Body: file.buffer,
          ContentType: file.mimetype,
          ACL: 'public-read',
        }),
      );

      const baseUrl = process.env.SUPABASE_URL;
      return `${baseUrl}/storage/v1/object/public/${bucket}/${filename}`;
    }
  }
}
