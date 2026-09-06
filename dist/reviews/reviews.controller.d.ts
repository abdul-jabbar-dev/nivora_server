import { ReviewsService } from './reviews.service';
export declare class ReviewsController {
    private readonly reviewsService;
    constructor(reviewsService: ReviewsService);
    getAllReviews(page?: string, limit?: string): Promise<{
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
            userId: string;
            productId: string;
            rating: number;
            message: string | null;
            media: string[];
            adminReply: string | null;
        })[];
        total: number;
        totalPages: number;
    }>;
    getProductReviews(productId: string, page?: string, limit?: string): Promise<{
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
    }>;
    createReview(req: any, body: {
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
    addAdminReply(id: string, body: {
        reply: string;
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
}
