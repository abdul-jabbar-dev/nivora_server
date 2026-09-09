import { UploadService } from './upload.service';
export declare class UploadController {
    private readonly uploadService;
    constructor(uploadService: UploadService);
    uploadFiles(files: any[], folder?: string): Promise<{
        urls: string[];
    }>;
    cleanupTemp(maxAgeMinutes?: number): Promise<{
        success: boolean;
        message: string;
        errors: string[];
    }>;
}
