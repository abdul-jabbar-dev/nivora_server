import {
  Controller,
  Get,
  Post,
  Req,
  Res,
  Query,
  Body,
  Headers,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { ENV } from '../env.js';
import { WhatsappWebhookService } from './whatsapp-webhook.service.js';

@Controller('webhooks/whatsapp')
export class WhatsappWebhookController {
  private readonly logger = new Logger(WhatsappWebhookController.name);

  constructor(private readonly webhookService: WhatsappWebhookService) {}

  /**
   * Meta Webhook Verification (GET /webhooks/whatsapp)
   * Handles hub.mode, hub.verify_token, and hub.challenge
   */
  @Get()
  verifyWebhook(
    @Query() query: Record<string, any>,
    @Res() res: Response,
  ) {
    const mode = query['hub.mode'] || (query.hub as any)?.mode;
    const token = query['hub.verify_token'] || (query.hub as any)?.verify_token;
    const challenge = query['hub.challenge'] || (query.hub as any)?.challenge;

    const expectedToken = ENV.WHATSAPP.VERIFY_TOKEN;

    if (!expectedToken) {
      this.logger.error('WHATSAPP_VERIFY_TOKEN is not configured on the server');
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send('Server verification token not configured');
    }

    if (mode === 'subscribe' && token === expectedToken) {
      this.logger.log('Meta WhatsApp webhook verified successfully');
      // Must return raw challenge string with 200 OK
      return res.status(HttpStatus.OK).send(challenge);
    }

    this.logger.warn(
      `Meta WhatsApp webhook verification failed: mode=${mode}, tokenMatch=${token === expectedToken}`,
    );
    return res.status(HttpStatus.FORBIDDEN).send('Forbidden: Verification token mismatch');
  }

  /**
   * Meta Webhook Event Receiver (POST /webhooks/whatsapp)
   * Receives incoming messages and status changes
   */
  @Post()
  handleWebhook(
    @Req() req: Request,
    @Res() res: Response,
    @Body() body: any,
    @Headers('x-hub-signature-256') signature?: string,
  ) {
    // 1. Signature Verification (if header provided and App Secret is configured)
    if (signature && ENV.WHATSAPP.APP_SECRET) {
      const rawBody = (req as any).rawBody;
      const isValid = this.webhookService.verifySignature(rawBody || body, signature);
      if (!isValid) {
        this.logger.warn('Incoming webhook rejected due to invalid X-Hub-Signature-256');
        return res.status(HttpStatus.UNAUTHORIZED).send('Invalid webhook signature');
      }
    }

    // 2. Validate standard WhatsApp payload structure
    if (body?.object === 'whatsapp_business_account') {
      // Return 200 OK immediately so Meta does not timeout or retry
      res.status(HttpStatus.OK).send('EVENT_RECEIVED');

      // Process event asynchronously without blocking response
      setImmediate(() => {
        try {
          this.webhookService.processWebhookEvent(body);
        } catch (err: any) {
          this.logger.error(`Error processing WhatsApp webhook event: ${err.message}`, err.stack);
        }
      });
      return;
    }

    // Not a valid WhatsApp Business Account event
    this.logger.warn(`Unexpected webhook object received: ${body?.object}`);
    return res.status(HttpStatus.NOT_FOUND).send('Not Found');
  }
}
