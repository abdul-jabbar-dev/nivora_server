import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminKeyGuard } from '../auth/admin-key.guard';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  findAll(
    @Query('category') category?: string,
    @Query('sort') sort?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.productsService.findAll({
      category,
      sort,
      page: page ? parseInt(page, 10) : 1,
      limit: limit ? parseInt(limit, 10) : 8,
    });
  }

  @Get('categories')
  getCategories() {
    return this.productsService.getCategories();
  }

  @Get('trending')
  getTrending() {
    return this.productsService.getTrending();
  }

  @Get('related/:categoryId')
  getRelated(@Param('categoryId') categoryId: string, @Query('limit') limit?: string) {
    return this.productsService.getRelated(categoryId, limit ? parseInt(limit, 10) : 4);
  }

  @Get(':slug')
  findOne(@Param('slug') slug: string) {
    return this.productsService.findOne(slug);
  }

  @UseGuards(AdminKeyGuard)
  @Post('categories')
  createCategory(@Body() data: any) {
    return this.productsService.createCategory(data);
  }

  @UseGuards(AdminKeyGuard)
  @Post()
  create(@Body() createProductDto: any) {
    return this.productsService.create(createProductDto);
  }

  @UseGuards(AdminKeyGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: any) {
    return this.productsService.update(id, updateProductDto);
  }

  @UseGuards(AdminKeyGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }
}
