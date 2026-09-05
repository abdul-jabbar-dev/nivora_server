export declare class UploadService {
    private readonly logger;
    private readonly s3Client;
    uploadFiles(files: any[], folder: string): Promise<string[]>;
    private uploadSingleFile;
}
