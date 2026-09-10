import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}

  async getProductReviews(productId: string, page = 1, limit = 10, ratingFilter?: number) {
    const skip = (page - 1) * limit;

    const baseWhere: any = { productId };
    const filteredWhere: any = { productId };
    if (ratingFilter && ratingFilter >= 1 && ratingFilter <= 5) {
      filteredWhere.rating = Number(ratingFilter);
    }

    const [reviews, totalMatching, aggregations, ratingGroups] = await Promise.all([
      this.prisma.review.findMany({
        where: filteredWhere,
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
      this.prisma.review.count({ where: filteredWhere }),
      this.prisma.review.aggregate({
        where: baseWhere,
        _avg: { rating: true },
        _count: { rating: true }
      }),
      this.prisma.review.groupBy({
        by: ['rating'],
        where: baseWhere,
        _count: { rating: true }
      })
    ]);

    const totalReviews = aggregations._count.rating || 0;
    const rawAvg = aggregations._avg.rating || 0;
    const averageRating = totalReviews > 0 ? Number(rawAvg.toFixed(1)) : 0;

    // Accurate distribution calculation (5 to 1 stars)
    const distribution = [5, 4, 3, 2, 1].map((stars) => {
      const match = ratingGroups.find((g) => g.rating === stars);
      const count = match ? match._count.rating : 0;
      const percentage = totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;
      return { stars, count, percentage };
    });

    return {
      reviews,
      total: totalMatching,
      totalPages: Math.ceil(totalMatching / limit),
      totalReviews,
      averageRating,
      distribution
    };
  }

  async getAllReviews(page = 1, limit = 20, ratingFilter?: number) {
    const skip = (page - 1) * limit;
    const where: any = {};
    if (ratingFilter && ratingFilter >= 1 && ratingFilter <= 5) {
      where.rating = Number(ratingFilter);
    }

    const [reviews, total, overallAggregations] = await Promise.all([
      this.prisma.review.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: { firstName: true, lastName: true, id: true, email: true }
          },
          product: {
            select: { id: true, name: true, imageUrl: true, slug: true }
          }
        }
      }),
      this.prisma.review.count({ where }),
      this.prisma.review.aggregate({
        _avg: { rating: true },
        _count: { rating: true }
      })
    ]);

    return {
      reviews,
      total,
      totalPages: Math.ceil(total / limit),
      totalOverall: overallAggregations._count.rating || 0,
      averageOverall: overallAggregations._avg.rating ? Number(overallAggregations._avg.rating.toFixed(1)) : 0
    };
  }

  async checkEligibility(userId: string, productId: string) {
    const existingReview = await this.prisma.review.findUnique({
      where: { userId_productId: { userId, productId } }
    });

    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    const isAdmin = user?.role === 'ADMIN';

    const purchasedOrder = await this.prisma.orderItem.findFirst({
      where: {
        productId,
        order: {
          userId,
          status: { not: 'CANCELLED' }
        }
      }
    });

    const hasPurchased = Boolean(purchasedOrder);
    const canReview = hasPurchased || isAdmin;

    return {
      canReview,
      hasPurchased,
      isAdmin,
      existingReview,
      message: canReview
        ? (existingReview ? 'You have already reviewed this product.' : 'You can review this product.')
        : 'Only customers who have purchased this product can leave a review.'
    };
  }

  async createReview(
    userId: string,
    data: { productId: string; rating: number; message?: string; media?: string[] }
  ) {
    return this.createOrUpdateReview(userId, data);
  }

  async createOrUpdateReview(
    userId: string,
    data: { productId: string; rating: number; message?: string; media?: string[] }
  ) {
    if (!data.rating || data.rating < 1 || data.rating > 5) {
      throw new BadRequestException('Rating must be between 1 and 5 stars.');
    }

    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    const isAdmin = user?.role === 'ADMIN';

    const hasPurchased = await this.prisma.orderItem.findFirst({
      where: {
        productId: data.productId,
        order: {
          userId,
          status: { not: 'CANCELLED' }
        }
      }
    });

    if (!hasPurchased && !isAdmin) {
      throw new BadRequestException('You can only review products you have purchased.');
    }

    const review = await this.prisma.review.upsert({
      where: {
        userId_productId: {
          userId,
          productId: data.productId
        }
      },
      create: {
        userId,
        productId: data.productId,
        rating: Math.round(data.rating),
        message: data.message?.trim() || null,
        media: data.media || []
      },
      update: {
        rating: Math.round(data.rating),
        message: data.message?.trim() || null,
        media: data.media || [],
        updatedAt: new Date()
      }
    });

    await this.updateProductRating(data.productId);

    return review;
  }

  async addAdminReply(reviewId: string, reply: string) {
    const review = await this.prisma.review.findUnique({ where: { id: reviewId } });
    if (!review) throw new NotFoundException('Review not found');

    return this.prisma.review.update({
      where: { id: reviewId },
      data: { adminReply: reply?.trim() || null }
    });
  }

  async deleteReview(reviewId: string, userId?: string, isAdmin = false) {
    const review = await this.prisma.review.findUnique({ where: { id: reviewId } });
    if (!review) throw new NotFoundException('Review not found');

    if (!isAdmin && review.userId !== userId) {
      throw new BadRequestException('You are not authorized to delete this review.');
    }

    await this.prisma.review.delete({ where: { id: reviewId } });
    await this.updateProductRating(review.productId);
    return { success: true, message: 'Review deleted successfully' };
  }

  public async updateProductRating(productId: string) {
    const aggregations = await this.prisma.review.aggregate({
      where: { productId },
      _avg: { rating: true },
      _count: { rating: true }
    });

    const averageRating = aggregations._avg.rating ? Number(aggregations._avg.rating.toFixed(1)) : 0;
    const reviewCount = aggregations._count.rating || 0;

    await this.prisma.product.update({
      where: { id: productId },
      data: {
        rating: averageRating,
        reviewCount
      }
    });

    return { rating: averageRating, reviewCount };
  }
}
