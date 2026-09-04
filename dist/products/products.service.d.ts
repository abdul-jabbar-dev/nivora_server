import { PrismaService } from '../prisma/prisma.service';
export declare class ProductsService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(params: {
        category?: string;
        sort?: string;
        page?: number;
        limit?: number;
    }): Promise<{
        products: ({
            category: {
                id: string;
                name: string;
                slug: string;
                imageUrl: string | null;
                parentId: string | null;
            };
        } & {
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
        })[];
        total: number;
        totalPages: number;
    }>;
    getCategories(): Promise<{
        id: string;
        name: string;
        slug: string;
        imageUrl: string | null;
        parentId: string | null;
    }[]>;
    getTrending(): Promise<({
        category: {
            id: string;
            name: string;
            slug: string;
            imageUrl: string | null;
            parentId: string | null;
        };
    } & {
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
    })[]>;
    getRelated(categoryId: string, limit?: number): Promise<({
        category: {
            id: string;
            name: string;
            slug: string;
            imageUrl: string | null;
            parentId: string | null;
        };
    } & {
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
    })[]>;
    findOne(slug: string): Promise<{
        category: {
            id: string;
            name: string;
            slug: string;
            imageUrl: string | null;
            parentId: string | null;
        };
    } & {
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
    }>;
    create(data: any): Promise<{
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
    }>;
    createCategory(data: any): Promise<{
        id: string;
        name: string;
        slug: string;
        imageUrl: string | null;
        parentId: string | null;
    }>;
}
