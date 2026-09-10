"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ReviewsService = class ReviewsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getProductReviews(productId, page = 1, limit = 10, ratingFilter) {
        const skip = (page - 1) * limit;
        const baseWhere = { productId };
        const filteredWhere = { productId };
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
    async getAllReviews(page = 1, limit = 20, ratingFilter) {
        const skip = (page - 1) * limit;
        const where = {};
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
    async checkEligibility(userId, productId) {
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
    async createReview(userId, data) {
        return this.createOrUpdateReview(userId, data);
    }
    async createOrUpdateReview(userId, data) {
        if (!data.rating || data.rating < 1 || data.rating > 5) {
            throw new common_1.BadRequestException('Rating must be between 1 and 5 stars.');
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
            throw new common_1.BadRequestException('You can only review products you have purchased.');
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
    async addAdminReply(reviewId, reply) {
        const review = await this.prisma.review.findUnique({ where: { id: reviewId } });
        if (!review)
            throw new common_1.NotFoundException('Review not found');
        return this.prisma.review.update({
            where: { id: reviewId },
            data: { adminReply: reply?.trim() || null }
        });
    }
    async deleteReview(reviewId, userId, isAdmin = false) {
        const review = await this.prisma.review.findUnique({ where: { id: reviewId } });
        if (!review)
            throw new common_1.NotFoundException('Review not found');
        if (!isAdmin && review.userId !== userId) {
            throw new common_1.BadRequestException('You are not authorized to delete this review.');
        }
        await this.prisma.review.delete({ where: { id: reviewId } });
        await this.updateProductRating(review.productId);
        return { success: true, message: 'Review deleted successfully' };
    }
    async updateProductRating(productId) {
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
};
exports.ReviewsService = ReviewsService;
exports.ReviewsService = ReviewsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ReviewsService);
//# sourceMappingURL=reviews.service.js.map