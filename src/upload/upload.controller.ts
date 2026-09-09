import { Controller, Post, UseInterceptors, UploadedFiles, BadRequestException, Body } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post()
  @UseInterceptors(FilesInterceptor('files'))
  async uploadFiles(@UploadedFiles() files: any[], @Body('folder') folder?: string) {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files uploaded');
    }
    const targetFolder = folder || 'misc';
    const urls = await this.uploadService.uploadFiles(files, targetFolder);
    return { urls };
  }

  @Post('cleanup-temp')
  async cleanupTemp(@Body('maxAgeMinutes') maxAgeMinutes?: number) {
    const ageMs = maxAgeMinutes !== undefined ? maxAgeMinutes * 60 * 1000 : 0;
    const result = this.uploadService.clearTempFiles(ageMs);
    return {
      success: true,
      message: `Cleared ${result.deletedCount} temporary file(s)`,
      errors: result.errors,
    };
  }
}
