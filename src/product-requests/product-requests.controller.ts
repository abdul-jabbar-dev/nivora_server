import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { ProductRequestsService } from './product-requests.service';
import { AdminKeyGuard } from '../auth/admin-key.guard';

@Controller('product-requests')
export class ProductRequestsController {
  constructor(private readonly productRequestsService: ProductRequestsService) {}

  @Post()
  create(@Body() createRequestDto: any) {
    return this.productRequestsService.create(createRequestDto);
  }

  @UseGuards(AdminKeyGuard)
  @Get()
  findAll() {
    return this.productRequestsService.findAll();
  }
}
