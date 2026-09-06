import { Module } from '@nestjs/common';
import { BillboardsService } from './billboards.service.js';
import { BillboardsController } from './billboards.controller.js';
import { PrismaModule } from '../prisma/prisma.module.js';

@Module({
  imports: [PrismaModule],
  controllers: [BillboardsController],
  providers: [BillboardsService],
})
export class BillboardsModule {}
