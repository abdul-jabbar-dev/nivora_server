import { OrdersService } from './orders.service';
export declare class OrdersController {
    private readonly ordersService;
    constructor(ordersService: OrdersService);
    create(req: any, createOrderDto: any): Promise<{
        items: {
            id: string;
            quantity: number;
            price: number;
            productId: string;
            orderId: string;
        }[];
        statusHistory: {
            id: string;
            status: import(".prisma/client").$Enums.OrderStatus;
            createdAt: Date;
            orderId: string;
            note: string | null;
        }[];
    } & {
        id: string;
        status: import(".prisma/client").$Enums.OrderStatus;
        total: number;
        createdAt: Date;
        updatedAt: Date;
        address: string | null;
        city: string | null;
        zip: string | null;
        landmark: string | null;
        phoneNumber: string | null;
        paymentMethod: string | null;
        shippingMethod: string | null;
        bkashNumber: string | null;
        trxId: string | null;
        userId: string;
    }>;
    findAll(req: any, page?: string, limit?: string, status?: string, search?: string): Promise<{
        orders: ({
            items: ({
                product: {
                    id: string;
                    status: string;
                    createdAt: Date;
                    updatedAt: Date;
                    price: number;
                    name: string;
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
                    categoryId: string | null;
                    visibleStatus: string;
                    offerPrice: number | null;
                    sourceInfo: import("@prisma/client/runtime/library").JsonValue | null;
                };
            } & {
                id: string;
                quantity: number;
                price: number;
                productId: string;
                orderId: string;
            })[];
            statusHistory: {
                id: string;
                status: import(".prisma/client").$Enums.OrderStatus;
                createdAt: Date;
                orderId: string;
                note: string | null;
            }[];
        } & {
            id: string;
            status: import(".prisma/client").$Enums.OrderStatus;
            total: number;
            createdAt: Date;
            updatedAt: Date;
            address: string | null;
            city: string | null;
            zip: string | null;
            landmark: string | null;
            phoneNumber: string | null;
            paymentMethod: string | null;
            shippingMethod: string | null;
            bkashNumber: string | null;
            trxId: string | null;
            userId: string;
        })[];
        total: number;
        totalPages: number;
    }>;
    getAllAdminOrders(page?: string, limit?: string): Promise<{
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
                quantity: number;
                price: number;
                productId: string;
                orderId: string;
            })[];
            statusHistory: {
                id: string;
                status: import(".prisma/client").$Enums.OrderStatus;
                createdAt: Date;
                orderId: string;
                note: string | null;
            }[];
        } & {
            id: string;
            status: import(".prisma/client").$Enums.OrderStatus;
            total: number;
            createdAt: Date;
            updatedAt: Date;
            address: string | null;
            city: string | null;
            zip: string | null;
            landmark: string | null;
            phoneNumber: string | null;
            paymentMethod: string | null;
            shippingMethod: string | null;
            bkashNumber: string | null;
            trxId: string | null;
            userId: string;
        })[];
        total: number;
        totalPages: number;
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
                status: string;
                createdAt: Date;
                updatedAt: Date;
                price: number;
                name: string;
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
                categoryId: string | null;
                visibleStatus: string;
                offerPrice: number | null;
                sourceInfo: import("@prisma/client/runtime/library").JsonValue | null;
            };
        } & {
            id: string;
            quantity: number;
            price: number;
            productId: string;
            orderId: string;
        })[];
        statusHistory: {
            id: string;
            status: import(".prisma/client").$Enums.OrderStatus;
            createdAt: Date;
            orderId: string;
            note: string | null;
        }[];
    } & {
        id: string;
        status: import(".prisma/client").$Enums.OrderStatus;
        total: number;
        createdAt: Date;
        updatedAt: Date;
        address: string | null;
        city: string | null;
        zip: string | null;
        landmark: string | null;
        phoneNumber: string | null;
        paymentMethod: string | null;
        shippingMethod: string | null;
        bkashNumber: string | null;
        trxId: string | null;
        userId: string;
    }>;
    updateOrderStatus(id: string, body: {
        status: string;
        note?: string;
    }): Promise<{
        statusHistory: {
            id: string;
            status: import(".prisma/client").$Enums.OrderStatus;
            createdAt: Date;
            orderId: string;
            note: string | null;
        }[];
    } & {
        id: string;
        status: import(".prisma/client").$Enums.OrderStatus;
        total: number;
        createdAt: Date;
        updatedAt: Date;
        address: string | null;
        city: string | null;
        zip: string | null;
        landmark: string | null;
        phoneNumber: string | null;
        paymentMethod: string | null;
        shippingMethod: string | null;
        bkashNumber: string | null;
        trxId: string | null;
        userId: string;
    }>;
    findOne(req: any, id: string): Promise<{
        items: ({
            product: {
                id: string;
                status: string;
                createdAt: Date;
                updatedAt: Date;
                price: number;
                name: string;
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
                categoryId: string | null;
                visibleStatus: string;
                offerPrice: number | null;
                sourceInfo: import("@prisma/client/runtime/library").JsonValue | null;
            };
        } & {
            id: string;
            quantity: number;
            price: number;
            productId: string;
            orderId: string;
        })[];
        statusHistory: {
            id: string;
            status: import(".prisma/client").$Enums.OrderStatus;
            createdAt: Date;
            orderId: string;
            note: string | null;
        }[];
    } & {
        id: string;
        status: import(".prisma/client").$Enums.OrderStatus;
        total: number;
        createdAt: Date;
        updatedAt: Date;
        address: string | null;
        city: string | null;
        zip: string | null;
        landmark: string | null;
        phoneNumber: string | null;
        paymentMethod: string | null;
        shippingMethod: string | null;
        bkashNumber: string | null;
        trxId: string | null;
        userId: string;
    }>;
    cancelOrder(req: any, id: string): Promise<{
        id: string;
        status: import(".prisma/client").$Enums.OrderStatus;
        total: number;
        createdAt: Date;
        updatedAt: Date;
        address: string | null;
        city: string | null;
        zip: string | null;
        landmark: string | null;
        phoneNumber: string | null;
        paymentMethod: string | null;
        shippingMethod: string | null;
        bkashNumber: string | null;
        trxId: string | null;
        userId: string;
    }>;
}
