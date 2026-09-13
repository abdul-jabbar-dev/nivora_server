import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller.js';
import { OrdersService } from './orders.service.js';
import { WhatsappModule } from '../whatsapp/whatsapp.module.js';

@Module({
  imports: [WhatsappModule],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
