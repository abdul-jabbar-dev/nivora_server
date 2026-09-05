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
            sourceInfo: import("@prisma/client/runtime/library").JsonValue | null;
        };
    } & {
        id: string;
        createdAt: Date;
        userId: string;
        productId: string;
    })[]>;
}
