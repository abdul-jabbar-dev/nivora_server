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
    syncCart(req: any, body: {
        items: any[];
    }): Promise<{
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
    removeItem(req: any, productId: string): Promise<{
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
    removeItemWithVariant(req: any, productId: string, variant: string): Promise<{
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
