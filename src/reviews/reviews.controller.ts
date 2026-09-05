import { Controller, Get, Post, Patch, Param, Body, Query, UseGuards, Req } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminKeyGuard } from '../auth/admin-key.guard';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @UseGuards(AdminKeyGuard)
  @Get('admin/all')
  getAllReviews(
    @Query('page') page?: string,
    @Query('limit') limit?: string
  ) {
    return this.reviewsService.getAllReviews(
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 20
    );
  }

  @Get('product/:productId')
  getProductReviews(
    @Param('productId') productId: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string
  ) {
    return this.reviewsService.getProductReviews(
      productId,
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 10
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  createReview(
    @Req() req: any,
    @Body() body: { productId: string; rating: number; message?: string; media?: string[] }
  ) {
    const userId = req.user.id || req.user.sub;
    return this.reviewsService.createReview(userId, body);
  }

  @UseGuards(AdminKeyGuard)
  @Patch(':id/reply')
  addAdminReply(
    @Param('id') id: string,
    @Body() body: { reply: string }
  ) {
    return this.reviewsService.addAdminReply(id, body.reply);
  }
}
