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
let UploadService = UploadService_1 = class UploadService {
    logger = new common_1.Logger(UploadService_1.name);
    s3Client = new client_s3_1.S3Client({
        region: process.env.S3_REGION || 'ap-northeast-2',
        endpoint: process.env.S3_ENDPOINT,
        credentials: {
            accessKeyId: process.env.S3_ACCESS_KEY_ID,
            secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
        },
        forcePathStyle: true,
    });
    async uploadFiles(files, folder) {
        return Promise.all(files.map(file => this.uploadSingleFile(file, folder)));
    }
    async uploadSingleFile(file, folder) {
        const filename = `${folder}/${(0, uuid_1.v4)()}-${file.originalname.replace(/\\s+/g, '-')}`;
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
        }
        else {
            const bucket = process.env.SUPABASE_BUCKET || 'products';
            await this.s3Client.send(new client_s3_1.PutObjectCommand({
                Bucket: bucket,
                Key: filename,
                Body: file.buffer,
                ContentType: file.mimetype,
                ACL: 'public-read',
            }));
            const baseUrl = process.env.SUPABASE_URL;
            return `${baseUrl}/storage/v1/object/public/${bucket}/${filename}`;
        }
    }
};
exports.UploadService = UploadService;
exports.UploadService = UploadService = UploadService_1 = __decorate([
    (0, common_1.Injectable)()
], UploadService);
//# sourceMappingURL=upload.service.js.map