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
            imageUrl: string;
            brand: string | null;
            description: string | null;
            newArrivalOrder: number;
            discountOrder: number;
            originalPrice: number | null;
            images: string[];
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
