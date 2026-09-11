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
            updatedAt: Date;
            productId: string;
            quantity: number;
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
            updatedAt: Date;
            productId: string;
            quantity: number;
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
            updatedAt: Date;
            productId: string;
            quantity: number;
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
            updatedAt: Date;
            productId: string;
            quantity: number;
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
            updatedAt: Date;
            productId: string;
            quantity: number;
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
