export declare class UploadService {
    private readonly logger;
    private readonly s3Client;
    uploadFiles(files: any[]): Promise<string[]>;
    private uploadSingleFile;
}
