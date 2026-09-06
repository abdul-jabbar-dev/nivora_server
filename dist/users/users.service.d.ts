import { PrismaService } from '../prisma/prisma.service';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    findOne(id: string): Promise<{
        watchlist: {
            id: string;
            createdAt: Date;
            userId: string;
            productId: string;
        }[];
        orders: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            address: string | null;
            city: string | null;
            zip: string | null;
            landmark: string | null;
            phoneNumber: string | null;
            userId: string;
            status: import(".prisma/client").$Enums.OrderStatus;
            total: number;
            paymentMethod: string | null;
            shippingMethod: string | null;
            bkashNumber: string | null;
            trxId: string | null;
        }[];
    } & {
        id: string;
        email: string;
        role: import(".prisma/client").$Enums.Role;
        firstName: string | null;
        lastName: string | null;
        createdAt: Date;
        updatedAt: Date;
        address: string | null;
        city: string | null;
        zip: string | null;
        landmark: string | null;
        phoneNumber: string | null;
    }>;
    updateProfile(id: string, data: any): Promise<{
        id: string;
        email: string;
        role: import(".prisma/client").$Enums.Role;
        firstName: string | null;
        lastName: string | null;
        createdAt: Date;
        updatedAt: Date;
        address: string | null;
        city: string | null;
        zip: string | null;
        landmark: string | null;
        phoneNumber: string | null;
    }>;
    findAll(page?: number, limit?: number): Promise<{
        users: {
            orderCount: number;
            totalSpent: number;
            orders: {
                status: import(".prisma/client").$Enums.OrderStatus;
                total: number;
            }[];
            id: string;
            email: string;
            role: import(".prisma/client").$Enums.Role;
            firstName: string | null;
            lastName: string | null;
            createdAt: Date;
            updatedAt: Date;
            address: string | null;
            city: string | null;
            zip: string | null;
            landmark: string | null;
            phoneNumber: string | null;
        }[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    findOneAdmin(id: string): Promise<{
        totalSpent: number;
        watchlist: ({
            product: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                status: string;
                price: number;
                slug: string;
                description: string | null;
                newArrivalOrder: number;
                discountOrder: number;
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
                sourceInfo: import("@prisma/client/runtime/library").JsonValue | null;
                expectedArrivalDate: Date | null;
            };
        } & {
            id: string;
            createdAt: Date;
            userId: string;
            productId: string;
        })[];
        orders: ({
            items: ({
                product: {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    name: string;
                    status: string;
                    price: number;
                    slug: string;
                    description: string | null;
                    newArrivalOrder: number;
                    discountOrder: number;
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
                    sourceInfo: import("@prisma/client/runtime/library").JsonValue | null;
                    expectedArrivalDate: Date | null;
                };
            } & {
                id: string;
                orderId: string;
                productId: string;
                quantity: number;
                price: number;
            })[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            address: string | null;
            city: string | null;
            zip: string | null;
            landmark: string | null;
            phoneNumber: string | null;
            userId: string;
            status: import(".prisma/client").$Enums.OrderStatus;
            total: number;
            paymentMethod: string | null;
            shippingMethod: string | null;
            bkashNumber: string | null;
            trxId: string | null;
        })[];
        id: string;
        email: string;
        role: import(".prisma/client").$Enums.Role;
        firstName: string | null;
        lastName: string | null;
        createdAt: Date;
        updatedAt: Date;
        address: string | null;
        city: string | null;
        zip: string | null;
        landmark: string | null;
        phoneNumber: string | null;
    }>;
}
