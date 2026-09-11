import { PrismaService } from '../prisma/prisma.service';
export declare class OrdersService {
    private prisma;
    constructor(prisma: PrismaService);
    create(userId: string, createOrderDto: any): Promise<{
        items: {
            id: string;
            orderId: string;
            productId: string;
            quantity: number;
            price: number;
        }[];
        statusHistory: {
            id: string;
            createdAt: Date;
            status: import(".prisma/client").$Enums.OrderStatus;
            orderId: string;
            note: string | null;
        }[];
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
    }>;
    findAllForUser(userId: string, page?: number, limit?: number, status?: string, search?: string): Promise<{
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
                orderId: string;
                productId: string;
                quantity: number;
                price: number;
            })[];
            statusHistory: {
                id: string;
                createdAt: Date;
                status: import(".prisma/client").$Enums.OrderStatus;
                orderId: string;
                note: string | null;
            }[];
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
        total: number;
        totalPages: number;
    }>;
    findOne(id: string, userId: string): Promise<{
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
            orderId: string;
            productId: string;
            quantity: number;
            price: number;
        })[];
        statusHistory: {
            id: string;
            createdAt: Date;
            status: import(".prisma/client").$Enums.OrderStatus;
            orderId: string;
            note: string | null;
        }[];
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
    }>;
    getAllAdminOrders(page?: number, limit?: number, status?: string): Promise<{
        orders: ({
            user: {
                id: string;
                email: string;
                firstName: string;
                lastName: string;
            };
            items: ({
                product: {
                    name: string;
                    imageUrl: string;
                };
            } & {
                id: string;
                orderId: string;
                productId: string;
                quantity: number;
                price: number;
            })[];
            statusHistory: {
                id: string;
                createdAt: Date;
                status: import(".prisma/client").$Enums.OrderStatus;
                orderId: string;
                note: string | null;
            }[];
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
        total: number;
        totalPages: number;
    }>;
    getDashboardStats(): Promise<{
        totalRevenue: number;
        totalOrders: number;
        pendingOrders: number;
        totalCustomers: number;
        recentOrders: ({
            user: {
                email: string;
                firstName: string;
                lastName: string;
            };
            items: ({
                product: {
                    name: string;
                    imageUrl: string;
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
    }>;
    getAdminOrderById(id: string): Promise<{
        user: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
        };
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
            orderId: string;
            productId: string;
            quantity: number;
            price: number;
        })[];
        statusHistory: {
            id: string;
            createdAt: Date;
            status: import(".prisma/client").$Enums.OrderStatus;
            orderId: string;
            note: string | null;
        }[];
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
    }>;
    updateOrderStatus(id: string, status: any, note?: string): Promise<{
        statusHistory: {
            id: string;
            createdAt: Date;
            status: import(".prisma/client").$Enums.OrderStatus;
            orderId: string;
            note: string | null;
        }[];
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
    }>;
    cancelOrder(id: string, userId: string): Promise<{
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
    }>;
    deleteOrder(id: string): Promise<{
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
    }>;
}
