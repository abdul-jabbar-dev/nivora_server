import { OnModuleInit, OnModuleDestroy } from '@nestjs/common';
export declare class UploadService implements OnModuleInit, OnModuleDestroy {
    private readonly logger;
    private readonly tempDir;
    private cleanupInterval;
    private readonly s3Client;
    onModuleInit(): void;
    onModuleDestroy(): void;
    private ensureDir;
    clearTempFiles(maxAgeMs?: number): {
        deletedCount: number;
        errors: string[];
    };
    uploadFiles(files: any[], folder: string): Promise<string[]>;
    private uploadSingleFile;
}
