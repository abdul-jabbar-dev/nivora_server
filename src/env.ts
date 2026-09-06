import * as dotenv from 'dotenv';
dotenv.config();

export const ENV = {
  PORT: process.env.PORT || 3005,
  SUPABASE_JWKS_URL: process.env.SUPABASE_JWKS_URL as string,
  SUPABASE_JWT_ISSUER: process.env.SUPABASE_JWT_ISSUER,
  SUPABASE_URL: process.env.SUPABASE_URL as string,
  S3_REGION: process.env.S3_REGION || 'ap-northeast-2',
  S3_ENDPOINT: process.env.S3_ENDPOINT,
  S3_ACCESS_KEY_ID: process.env.S3_ACCESS_KEY_ID as string,
  S3_SECRET_ACCESS_KEY: process.env.S3_SECRET_ACCESS_KEY as string,
  STORAGE_PROVIDER: process.env.STORAGE_PROVIDER || 's3',
  BACKEND_URL: process.env.BACKEND_URL || 'http://localhost:3005',
  SUPABASE_BUCKET: process.env.SUPABASE_BUCKET || 'products',
};
