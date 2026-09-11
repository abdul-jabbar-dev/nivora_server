import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

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

  @Get('admin/dashboard-stats')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  getDashboardStats() {
    return this.ordersService.getDashboardStats();
  }

  @Get('admin/all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  getAllAdminOrders(@Query('page') page?: string, @Query('limit') limit?: string, @Query('status') status?: string) {
    return this.ordersService.getAllAdminOrders(
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 20,
      status
    );
  }

  @Get('admin/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  getAdminOrderById(@Param('id') id: string) {
    return this.ordersService.getAdminOrderById(id);
  }

  @Patch('admin/:id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  updateOrderStatus(@Param('id') id: string, @Body() body: { status: string, note?: string }) {
    return this.ordersService.updateOrderStatus(id, body.status, body.note);
  }

  @Delete('admin/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  deleteAdminOrder(@Param('id') id: string) {
    return this.ordersService.deleteOrder(id);
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
