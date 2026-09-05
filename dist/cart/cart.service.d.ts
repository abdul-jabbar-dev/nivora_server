import { PrismaService } from '../prisma/prisma.service';
export declare class CartService {
    private prisma;
    constructor(prisma: PrismaService);
    getCart(userId: string): Promise<{
        items: ({
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
            updatedAt: Date;
            quantity: number;
            productId: string;
            cartId: string;
            variant: string | null;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
    }>;
    syncCart(userId: string, items: {
        productId: string;
        variant: string | null;
        quantity: number;
    }[]): Promise<{
        items: ({
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
            updatedAt: Date;
            quantity: number;
            productId: string;
            cartId: string;
            variant: string | null;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
    }>;
    addItem(userId: string, productId: string, variant: string | null, quantity: number): Promise<{
        items: ({
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
            updatedAt: Date;
            quantity: number;
            productId: string;
            cartId: string;
            variant: string | null;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
    }>;
    removeItem(userId: string, productId: string, variant: string | null): Promise<{
        items: ({
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
            updatedAt: Date;
            quantity: number;
            productId: string;
            cartId: string;
            variant: string | null;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
    }>;
    updateItemQuantity(userId: string, productId: string, variant: string | null, quantity: number): Promise<{
        items: ({
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
            updatedAt: Date;
            quantity: number;
            productId: string;
            cartId: string;
            variant: string | null;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
    }>;
}
