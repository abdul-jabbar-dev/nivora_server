import { Injectable, Logger } from '@nestjs/common';
import * as crypto from 'crypto';
import { ENV } from '../env.js';

@Injectable()
export class WhatsappWebhookService {
  private readonly logger = new Logger(WhatsappWebhookService.name);

  /**
   * Verify X-Hub-Signature-256 header using the Meta App Secret.
   */
  verifySignature(rawBody: Buffer | string | undefined, signatureHeader: string | undefined): boolean {
    const appSecret = ENV.WHATSAPP.APP_SECRET;
    if (!appSecret) {
      this.logger.warn('WhatsApp App Secret not configured; skipping signature verification.');
      return true;
    }

    if (!signatureHeader) {
      this.logger.warn('No X-Hub-Signature-256 header present on incoming webhook request.');
      return false;
    }

    const parts = signatureHeader.split('=');
    if (parts.length !== 2 || parts[0] !== 'sha256') {
      this.logger.warn(`Malformed signature header: ${signatureHeader}`);
      return false;
    }

    const expectedSignature = parts[1];
    const bodyBuffer = Buffer.isBuffer(rawBody)
      ? rawBody
      : Buffer.from(typeof rawBody === 'string' ? rawBody : JSON.stringify(rawBody || {}));

    const hmac = crypto.createHmac('sha256', appSecret);
    hmac.update(bodyBuffer);
    const digest = hmac.digest('hex');

    try {
      const isMatch = crypto.timingSafeEqual(
        Buffer.from(digest, 'hex'),
        Buffer.from(expectedSignature, 'hex'),
      );
      return isMatch;
    } catch {
      return false;
    }
  }

  /**
   * Process Meta WhatsApp Cloud API webhook event asynchronously.
   * Extracts messages and status updates safely without logging sensitive personal data.
   */
  processWebhookEvent(payload: any): void {
    if (!payload || payload.object !== 'whatsapp_business_account') {
      this.logger.debug('Ignoring non-WhatsApp business webhook payload');
      return;
    }

    const entries = Array.isArray(payload.entry) ? payload.entry : [];

    for (const entry of entries) {
      const changes = Array.isArray(entry.changes) ? entry.changes : [];

      for (const change of changes) {
        const value = change?.value;
        if (!value) continue;

        // 1. Process Message Status Updates
        if (Array.isArray(value.statuses)) {
          for (const status of value.statuses) {
            this.handleStatusUpdate(status);
          }
        }

        // 2. Process Incoming Customer Messages
        if (Array.isArray(value.messages)) {
          for (const message of value.messages) {
            this.handleIncomingMessage(message, value.metadata);
          }
        }
      }
    }
  }

  private handleStatusUpdate(status: any): void {
    const statusType = status.status;
    const messageId = status.id;
    const recipient = this.maskPhoneNumber(status.recipient_id);

    if (statusType === 'failed') {
      const errorDetails = status.errors?.map((e: any) => `${e.code}: ${e.title}`).join(', ') || 'Unknown error';
      this.logger.warn(
        `WhatsApp delivery failed for msgId=${messageId}, recipient=${recipient}. Details: ${errorDetails}`,
      );
    } else {
      this.logger.log(
        `WhatsApp status update: msgId=${messageId}, recipient=${recipient}, status=${statusType}`,
      );
    }
  }

  private handleIncomingMessage(message: any, metadata: any): void {
    const sender = this.maskPhoneNumber(message.from);
    const messageType = message.type || 'unknown';
    const messageId = message.id;

    this.logger.log(
      `Incoming WhatsApp message: id=${messageId}, from=${sender}, type=${messageType}, displayPhone=${metadata?.display_phone_number || 'N/A'}`,
    );

    // Placeholder for future message processing (auto-replies, customer support routing, bot queues)
  }

  private maskPhoneNumber(phone?: string): string {
    if (!phone) return 'unknown';
    if (phone.length <= 4) return '****';
    return `${phone.slice(0, 3)}****${phone.slice(-3)}`;
  }
}
