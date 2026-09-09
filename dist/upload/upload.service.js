"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var UploadService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadService = void 0;
const common_1 = require("@nestjs/common");
const client_s3_1 = require("@aws-sdk/client-s3");
const uuid_1 = require("uuid");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const env_1 = require("../env");
let UploadService = UploadService_1 = class UploadService {
    logger = new common_1.Logger(UploadService_1.name);
    tempDir = path.join(process.cwd(), 'uploads', 'temp');
    cleanupInterval = null;
    s3Client = new client_s3_1.S3Client({
        region: env_1.ENV.S3_REGION,
        endpoint: env_1.ENV.S3_ENDPOINT,
        credentials: {
            accessKeyId: env_1.ENV.S3_ACCESS_KEY_ID,
            secretAccessKey: env_1.ENV.S3_SECRET_ACCESS_KEY,
        },
        forcePathStyle: true,
    });
    onModuleInit() {
        this.ensureDir(this.tempDir);
        this.clearTempFiles(15 * 60 * 1000);
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
    ensureDir(dirPath) {
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
        }
    }
    clearTempFiles(maxAgeMs = 15 * 60 * 1000) {
        let deletedCount = 0;
        const errors = [];
        try {
            if (!fs.existsSync(this.tempDir))
                return { deletedCount: 0, errors: [] };
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
                }
                catch (err) {
                    errors.push(`Failed to delete ${file}: ${err.message}`);
                }
            }
        }
        catch (err) {
            this.logger.error(`Error reading temp directory: ${err.message}`);
        }
        return { deletedCount, errors };
    }
    async uploadFiles(files, folder) {
        return Promise.all(files.map(file => this.uploadSingleFile(file, folder)));
    }
    async uploadSingleFile(file, folder) {
        const sanitizedName = (file.originalname || 'image')
            .trim()
            .replace(/[^a-zA-Z0-9.-]/g, '-');
        const filename = `${folder}/${(0, uuid_1.v4)()}-${sanitizedName}`;
        const provider = env_1.ENV.STORAGE_PROVIDER;
        let tempFilePath = null;
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
                tempFilePath = null;
                const baseUrl = env_1.ENV.BACKEND_URL;
                return `${baseUrl}/uploads/${filename}`;
            }
            else {
                const tempName = `temp-${(0, uuid_1.v4)()}-${sanitizedName}`;
                tempFilePath = path.join(this.tempDir, tempName);
                await fs.promises.writeFile(tempFilePath, file.buffer);
                const bucket = env_1.ENV.SUPABASE_BUCKET;
                await this.s3Client.send(new client_s3_1.PutObjectCommand({
                    Bucket: bucket,
                    Key: filename,
                    Body: file.buffer,
                    ContentType: file.mimetype,
                    ACL: 'public-read',
                }), { abortSignal: abortController.signal });
                if (tempFilePath && fs.existsSync(tempFilePath)) {
                    await fs.promises.unlink(tempFilePath).catch(() => { });
                    tempFilePath = null;
                }
                const baseUrl = env_1.ENV.SUPABASE_URL;
                return `${baseUrl}/storage/v1/object/public/${bucket}/${filename}`;
            }
        }
        catch (error) {
            this.logger.error(`Upload failed or timed out for file ${filename}: ${error.message}`);
            if (tempFilePath && fs.existsSync(tempFilePath)) {
                try {
                    await fs.promises.unlink(tempFilePath);
                    this.logger.log(`Cleaned up temp file after error: ${tempFilePath}`);
                }
                catch (cleanupErr) {
                    this.logger.warn(`Failed to cleanup temp file: ${cleanupErr.message}`);
                }
            }
            if (abortController.signal.aborted) {
                throw new Error(`Upload timed out after 25 seconds for ${file.originalname}`);
            }
            throw error;
        }
        finally {
            clearTimeout(timeout);
        }
    }
};
exports.UploadService = UploadService;
exports.UploadService = UploadService = UploadService_1 = __decorate([
    (0, common_1.Injectable)()
], UploadService);
//# sourceMappingURL=upload.service.js.map