import { Controller, Post, Body, Get, UseGuards, Param, Patch, Delete, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ProductRequestsService } from './product-requests.service';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('product-requests')
export class ProductRequestsController {
  constructor(private readonly productRequestsService: ProductRequestsService) {}

  @Post()
  create(@Body() createRequestDto: any) {
    return this.productRequestsService.create(createRequestDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('my-requests')
  findMyRequests(@Req() req: any) {
    const userId = req.user.id || req.user.sub;
    return this.productRequestsService.findByUserId(userId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Get()
  findAll() {
    return this.productRequestsService.findAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productRequestsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.productRequestsService.updateStatus(id, status);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productRequestsService.remove(id);
  }
}
