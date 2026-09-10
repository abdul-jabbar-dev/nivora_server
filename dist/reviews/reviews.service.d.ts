import { PrismaService } from '../prisma/prisma.service';
export declare class ReviewsService {
    private prisma;
    constructor(prisma: PrismaService);
    getProductReviews(productId: string, page?: number, limit?: number, ratingFilter?: number): Promise<{
        reviews: ({
            user: {
                id: string;
                firstName: string;
                lastName: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            productId: string;
            rating: number;
            message: string | null;
            media: string[];
            adminReply: string | null;
        })[];
        total: number;
        totalPages: number;
        totalReviews: number;
        averageRating: number;
        distribution: {
            stars: number;
            count: number;
            percentage: number;
        }[];
    }>;
    getAllReviews(page?: number, limit?: number, ratingFilter?: number): Promise<{
        reviews: ({
            user: {
                id: string;
                email: string;
                firstName: string;
                lastName: string;
            };
            product: {
                id: string;
                name: string;
                slug: string;
                imageUrl: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            productId: string;
            rating: number;
            message: string | null;
            media: string[];
            adminReply: string | null;
        })[];
        total: number;
        totalPages: number;
        totalOverall: number;
        averageOverall: number;
    }>;
    checkEligibility(userId: string, productId: string): Promise<{
        canReview: boolean;
        hasPurchased: boolean;
        isAdmin: boolean;
        existingReview: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            productId: string;
            rating: number;
            message: string | null;
            media: string[];
            adminReply: string | null;
        };
        message: string;
    }>;
    createReview(userId: string, data: {
        productId: string;
        rating: number;
        message?: string;
        media?: string[];
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        productId: string;
        rating: number;
        message: string | null;
        media: string[];
        adminReply: string | null;
    }>;
    createOrUpdateReview(userId: string, data: {
        productId: string;
        rating: number;
        message?: string;
        media?: string[];
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        productId: string;
        rating: number;
        message: string | null;
        media: string[];
        adminReply: string | null;
    }>;
    addAdminReply(reviewId: string, reply: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        productId: string;
        rating: number;
        message: string | null;
        media: string[];
        adminReply: string | null;
    }>;
    deleteReview(reviewId: string, userId?: string, isAdmin?: boolean): Promise<{
        success: boolean;
        message: string;
    }>;
    updateProductRating(productId: string): Promise<{
        rating: number;
        reviewCount: number;
    }>;
}
