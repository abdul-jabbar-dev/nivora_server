import { CartService } from './cart.service';
export declare class CartController {
    private readonly cartService;
    constructor(cartService: CartService);
    getCart(req: any): Promise<{
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
    syncCart(req: any, body: {
        items: any[];
    }): Promise<{
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
    addItem(req: any, body: {
        productId: string;
        variant?: string;
        quantity: number;
    }): Promise<{
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
    updateItemQuantity(req: any, body: {
        productId: string;
        variant?: string;
        quantity: number;
    }): Promise<{
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
    removeItem(req: any, productId: string): Promise<{
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
    removeItemWithVariant(req: any, productId: string, variant: string): Promise<{
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
