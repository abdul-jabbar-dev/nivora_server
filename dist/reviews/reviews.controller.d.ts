import { ReviewsService } from './reviews.service';
export declare class ReviewsController {
    private readonly reviewsService;
    constructor(reviewsService: ReviewsService);
    getAllReviews(page?: string, limit?: string, rating?: string): Promise<{
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
    checkEligibility(req: any, productId: string): Promise<{
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
    getProductReviews(productId: string, page?: string, limit?: string, rating?: string): Promise<{
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
    deleteReview(req: any, id: string): Promise<{
        success: boolean;
        message: string;
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
