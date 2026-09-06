import { PrismaService } from '../prisma/prisma.service';
export declare class ReviewsService {
    private prisma;
    constructor(prisma: PrismaService);
    getProductReviews(productId: string, page?: number, limit?: number): Promise<{
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
            rating: number;
            productId: string;
            userId: string;
            message: string | null;
            media: string[];
            adminReply: string | null;
        })[];
        total: number;
        totalPages: number;
    }>;
    getAllReviews(page?: number, limit?: number): Promise<{
        reviews: ({
            user: {
                id: string;
                firstName: string;
                lastName: string;
            };
            product: {
                name: string;
                imageUrl: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            rating: number;
            productId: string;
            userId: string;
            message: string | null;
            media: string[];
            adminReply: string | null;
        })[];
        total: number;
        totalPages: number;
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
        rating: number;
        productId: string;
        userId: string;
        message: string | null;
        media: string[];
        adminReply: string | null;
    }>;
    addAdminReply(reviewId: string, reply: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        rating: number;
        productId: string;
        userId: string;
        message: string | null;
        media: string[];
        adminReply: string | null;
    }>;
    private updateProductRating;
}
