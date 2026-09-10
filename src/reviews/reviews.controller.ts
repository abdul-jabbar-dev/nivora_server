import { Controller, Get, Post, Patch, Delete, Param, Body, Query, UseGuards, Req } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Get('admin/all')
  getAllReviews(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('rating') rating?: string
  ) {
    return this.reviewsService.getAllReviews(
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 20,
      rating ? parseInt(rating) : undefined
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('product/:productId/eligibility')
  checkEligibility(
    @Req() req: any,
    @Param('productId') productId: string
  ) {
    const userId = req.user.id || req.user.sub;
    return this.reviewsService.checkEligibility(userId, productId);
  }

  @Get('product/:productId')
  getProductReviews(
    @Param('productId') productId: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('rating') rating?: string
  ) {
    return this.reviewsService.getProductReviews(
      productId,
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 10,
      rating ? parseInt(rating) : undefined
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  createReview(
    @Req() req: any,
    @Body() body: { productId: string; rating: number; message?: string; media?: string[] }
  ) {
    const userId = req.user.id || req.user.sub;
    return this.reviewsService.createOrUpdateReview(userId, body);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  deleteReview(
    @Req() req: any,
    @Param('id') id: string
  ) {
    const userId = req.user.id || req.user.sub;
    const isAdmin = req.user.role === 'ADMIN';
    return this.reviewsService.deleteReview(id, userId, isAdmin);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Patch(':id/reply')
  addAdminReply(
    @Param('id') id: string,
    @Body() body: { reply: string }
  ) {
    return this.reviewsService.addAdminReply(id, body.reply);
  }
}

