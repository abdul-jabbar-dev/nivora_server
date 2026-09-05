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
    async getProductReviews(productId, page = 1, limit = 10) {
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
    async createReview(userId, data) {
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
            throw new common_1.BadRequestException('You can only review products you have purchased and received.');
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
            await this.updateProductRating(data.productId);
            return review;
        }
        catch (error) {
            if (error.code === 'P2002') {
                throw new common_1.ConflictException('You have already reviewed this product.');
            }
            throw error;
        }
    }
    async addAdminReply(reviewId, reply) {
        const review = await this.prisma.review.findUnique({ where: { id: reviewId } });
        if (!review)
            throw new common_1.NotFoundException('Review not found');
        return this.prisma.review.update({
            where: { id: reviewId },
            data: { adminReply: reply }
        });
    }
    async updateProductRating(productId) {
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
};
exports.ReviewsService = ReviewsService;
exports.ReviewsService = ReviewsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ReviewsService);
//# sourceMappingURL=reviews.service.js.map