# =========================
# 1. Build Stage
# =========================
FROM node:22-bookworm-slim AS builder

WORKDIR /app
 
# Prisma needs OpenSSL to detect the correct engine
RUN apt-get update \
    && apt-get install -y openssl \
    && rm -rf /var/lib/apt/lists/*

COPY package*.json ./

RUN npm ci

COPY . .

# Generate Prisma Client for Debian OpenSSL 3
RUN npx prisma generate

RUN npm run build


# =========================
# 2. Production Stage
# =========================
FROM node:22-bookworm-slim AS runner

WORKDIR /app

ENV NODE_ENV=production

# Prisma runtime dependency
RUN apt-get update \
    && apt-get install -y openssl \
    && rm -rf /var/lib/apt/lists/*

COPY package*.json ./

RUN npm ci --omit=dev \
    && npm cache clean --force

# Copy Prisma generated client
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

# Copy Prisma schema
COPY --from=builder /app/prisma ./prisma

# Copy compiled NestJS application
COPY --from=builder /app/dist ./dist

EXPOSE 3005

CMD ["node", "dist/main.js"]