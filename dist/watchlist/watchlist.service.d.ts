import { PrismaService } from '../prisma/prisma.service';
export declare class WatchlistService {
    private prisma;
    constructor(prisma: PrismaService);
    add(userId: string, productId: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        productId: string;
    }>;
    remove(userId: string, productId: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        productId: string;
    }>;
    findAllForUser(userId: string): Promise<({
        product: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            status: string;
            price: number;
            slug: string;
            description: string | null;
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
            likesCount: number;
            dislikesCount: number;
            categoryId: string | null;
            visibleStatus: string;
            offerPrice: number | null;
            discountExpiryDate: Date | null;
            newArrivalOrder: number;
            discountOrder: number;
            sourceInfo: import("@prisma/client/runtime/library").JsonValue | null;
            expectedArrivalDate: Date | null;
        };
    } & {
        id: string;
        createdAt: Date;
        userId: string;
        productId: string;
    })[]>;
}
