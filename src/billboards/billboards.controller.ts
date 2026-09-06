import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BillboardsService } from './billboards.service.js';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('billboards')
export class BillboardsController {
  constructor(private readonly billboardsService: BillboardsService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Post()
  create(@Body() createBillboardDto: { title: string; imageUrl: string; link: string; isActive?: boolean; order?: number }) {
    return this.billboardsService.create(createBillboardDto);
  }

  @Get()
  findAllActive() {
    return this.billboardsService.findAllActive();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Get('admin')
  findAll() {
    return this.billboardsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.billboardsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBillboardDto: { title?: string; imageUrl?: string; link?: string; isActive?: boolean; order?: number }) {
    return this.billboardsService.update(id, updateBillboardDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.billboardsService.remove(id);
  }
}
