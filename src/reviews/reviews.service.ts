import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}

  async getProductReviews(productId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    
    const [reviews, total] = await Promise.all([
      this.prisma.review.findMany({
        where: { productId },
        skip,
        take: Number(limit),
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              firstName: true,
              lastName: true,
              id: true
            }
          }
        }
      }),
      this.prisma.review.count({ where: { productId } })
    ]);

    return {
      reviews,
      total,
      totalPages: Math.ceil(total / limit)
    };
  }

  async getAllReviews(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    
    const [reviews, total] = await Promise.all([
      this.prisma.review.findMany({
        skip,
        take: Number(limit),
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: { firstName: true, lastName: true, id: true }
          },
          product: {
            select: { name: true, imageUrl: true }
          }
        }
      }),
      this.prisma.review.count()
    ]);

    return {
      reviews,
      total,
      totalPages: Math.ceil(total / limit)
    };
  }

  async createReview(userId: string, data: { productId: string; rating: number; message?: string; media?: string[] }) {
    // 1. Verify user purchased the product and order is DELIVERED
    const hasPurchased = await this.prisma.orderItem.findFirst({
      where: {
        productId: data.productId,
        order: {
          userId,
          status: 'DELIVERED'
        }
      }
    });

    if (!hasPurchased) {
      throw new BadRequestException('You can only review products you have purchased and received.');
    }

    try {
      const review = await this.prisma.review.create({
        data: {
          userId,
          productId: data.productId,
          rating: data.rating,
          message: data.message,
          media: data.media || []
        }
      });

      // Update product rating and count
      await this.updateProductRating(data.productId);

      return review;
    } catch (error) {
      if ((error as any).code === 'P2002') {
        throw new ConflictException('You have already reviewed this product.');
      }
      throw error;
    }
  }

  async addAdminReply(reviewId: string, reply: string) {
    const review = await this.prisma.review.findUnique({ where: { id: reviewId } });
    if (!review) throw new NotFoundException('Review not found');

    return this.prisma.review.update({
      where: { id: reviewId },
      data: { adminReply: reply }
    });
  }

  private async updateProductRating(productId: string) {
    const aggregations = await this.prisma.review.aggregate({
      where: { productId },
      _avg: { rating: true },
      _count: { rating: true }
    });

    const averageRating = aggregations._avg.rating || 0;
    const reviewCount = aggregations._count.rating || 0;

    await this.prisma.product.update({
      where: { id: productId },
      data: {
        rating: Number(averageRating.toFixed(1)),
        reviewCount
      }
    });
  }
}
