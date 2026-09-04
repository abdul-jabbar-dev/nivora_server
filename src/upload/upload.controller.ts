import { Controller, Post, UseInterceptors, UploadedFiles, BadRequestException } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post()
  @UseInterceptors(FilesInterceptor('files'))
  async uploadFiles(@UploadedFiles() files: any[]) {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files uploaded');
    }
    const urls = await this.uploadService.uploadFiles(files);
    return { urls };
  }
}
