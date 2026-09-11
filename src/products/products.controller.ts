import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ProductsService } from './products.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  findAll(
    @Query('category') category?: string,
    @Query('sort') sort?: string,
    @Query('filter') filter?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('q') q?: string,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
    @Query('minRating') minRating?: string,
  ) {
    return this.productsService.findAll({ 
      category, 
      sort, 
      filter, 
      page: page ? Number(page) : undefined, 
      limit: limit ? Number(limit) : undefined,
      q,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      minRating: minRating ? Number(minRating) : undefined,
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

  @UseGuards(JwtAuthGuard)
  @Get(':id/interaction-status')
  getInteractionStatus(@Request() req, @Param('id') id: string) {
    return this.productsService.getInteractionStatus(req.user.id, id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/interaction')
  setInteraction(@Request() req, @Param('id') id: string, @Body() body: { isLike: boolean }) {
    return this.productsService.setInteraction(req.user.id, id, body.isLike);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Get(':id/analytics')
  getAnalytics(@Param('id') id: string) {
    return this.productsService.getAnalytics(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Post('categories')
  createCategory(@Body() data: any) {
    return this.productsService.createCategory(data);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Patch('categories/:id')
  updateCategory(@Param('id') id: string, @Body() data: any) {
    return this.productsService.updateCategory(id, data);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Delete('categories/:id')
  removeCategory(@Param('id') id: string) {
    return this.productsService.deleteCategory(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Post()
  create(@Body() createProductDto: any) {
    return this.productsService.create(createProductDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: any) {
    return this.productsService.update(id, updateProductDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }
}
