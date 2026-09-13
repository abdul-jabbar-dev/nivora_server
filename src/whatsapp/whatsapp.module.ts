import { Module } from '@nestjs/common';
import { WhatsappService } from './whatsapp.service.js';
import { WhatsappWebhookController } from './whatsapp-webhook.controller.js';
import { WhatsappWebhookService } from './whatsapp-webhook.service.js';

@Module({
  controllers: [WhatsappWebhookController],
  providers: [WhatsappService, WhatsappWebhookService],
  exports: [WhatsappService, WhatsappWebhookService],
})
export class WhatsappModule {}
