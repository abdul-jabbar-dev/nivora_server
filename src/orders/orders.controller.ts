import { Controller, Get, Post, Body, Param, UseGuards, Req } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  create(@Req() req: any, @Body() createOrderDto: any) {
    const userId = req.user.id || req.user.sub;
    return this.ordersService.create(userId, createOrderDto);
  }

  @Get()
  findAll(@Req() req: any) {
    const userId = req.user.id || req.user.sub;
    return this.ordersService.findAllForUser(userId);
  }

  @Get(':id')
  findOne(@Req() req: any, @Param('id') id: string) {
    const userId = req.user.id || req.user.sub;
    return this.ordersService.findOne(id, userId);
  }
}
