import { Controller, Get, Post, Patch, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminKeyGuard } from '../auth/admin-key.guard';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Req() req: any, @Body() createOrderDto: any) {
    const userId = req.user.id || req.user.sub;
    return this.ordersService.create(userId, createOrderDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(
    @Req() req: any,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('status') status?: string,
    @Query('search') search?: string,
  ) {
    const userId = req.user.id || req.user.sub;
    return this.ordersService.findAllForUser(
      userId,
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 10,
      status,
      search
    );
  }

  @Get('admin/all')
  @UseGuards(AdminKeyGuard)
  getAllAdminOrders(@Query('page') page?: string, @Query('limit') limit?: string) {
    return this.ordersService.getAllAdminOrders(
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 20
    );
  }

  @Get('admin/:id')
  @UseGuards(AdminKeyGuard)
  getAdminOrderById(@Param('id') id: string) {
    return this.ordersService.getAdminOrderById(id);
  }

  @Patch('admin/:id/status')
  @UseGuards(AdminKeyGuard)
  updateOrderStatus(@Param('id') id: string, @Body() body: { status: string, note?: string }) {
    return this.ordersService.updateOrderStatus(id, body.status, body.note);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Req() req: any, @Param('id') id: string) {
    const userId = req.user.id || req.user.sub;
    return this.ordersService.findOne(id, userId);
  }

  @Post(':id/cancel')
  @UseGuards(JwtAuthGuard)
  cancelOrder(@Req() req: any, @Param('id') id: string) {
    const userId = req.user.id || req.user.sub;
    return this.ordersService.cancelOrder(id, userId);
  }
}
