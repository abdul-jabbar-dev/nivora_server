import { WatchlistService } from './watchlist.service';
export declare class WatchlistController {
    private readonly watchlistService;
    constructor(watchlistService: WatchlistService);
    add(req: any, productId: string): Promise<{
        id: string;
        createdAt: Date;
        productId: string;
        userId: string;
    }>;
    remove(req: any, productId: string): Promise<{
        id: string;
        createdAt: Date;
        productId: string;
        userId: string;
    }>;
    findAll(req: any): Promise<({
        product: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            newArrivalOrder: number;
            discountOrder: number;
            slug: string;
            description: string | null;
            price: number;
            originalPrice: number | null;
            imageUrl: string;
            images: string[];
            brand: string | null;
            rating: number;
            reviewCount: number;
            isNew: boolean;
            isTrending: boolean;
            features: string[];
            specifications: import("@prisma/client/runtime/library").JsonValue | null;
            shipping: import("@prisma/client/runtime/library").JsonValue | null;
            variants: import("@prisma/client/runtime/library").JsonValue | null;
            stock: number;
            categoryId: string | null;
            visibleStatus: string;
            status: string;
            offerPrice: number | null;
            discountExpiryDate: Date | null;
            sourceInfo: import("@prisma/client/runtime/library").JsonValue | null;
            expectedArrivalDate: Date | null;
        };
    } & {
        id: string;
        createdAt: Date;
        productId: string;
        userId: string;
    })[]>;
}
