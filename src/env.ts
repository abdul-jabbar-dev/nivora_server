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
  ADMIN_EMAIL: process.env.ADMIN_EMAIL || 'admin@gmail.com',
  ADMIN_SECRET: process.env.ADMIN_SECRET || 'admin_secret_12345',
  WHATSAPP: {
    API_URL: process.env.WHATSAPP_API_URL || 'https://graph.facebook.com/v25.0',
    PHONE_NUMBER_ID: process.env.WHATSAPP_PHONE_NUMBER_ID || '1326593580541232',
    BUSINESS_ACCOUNT_ID: process.env.WHATSAPP_BUSINESS_ACCOUNT_ID || '2828940924150871',
    APP_ID: process.env.WHATSAPP_APP_ID || '1047423104770509',
    APP_SECRET: process.env.WHATSAPP_APP_SECRET || '456434220d4e01e6812b77688368c782',
    ACCESS_TOKEN: process.env.WHATSAPP_ACCESS_TOKEN || '',
    ADMIN_NUMBER: process.env.WHATSAPP_ADMIN_NUMBER || '8801345861869',
    TEMPLATE_NAME: process.env.WHATSAPP_TEMPLATE_NAME || 'jaspers_market_order_confirmation_v1',
    VERIFY_TOKEN: process.env.WHATSAPP_VERIFY_TOKEN || '',
  },
};
