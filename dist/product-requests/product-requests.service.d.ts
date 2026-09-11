import { PrismaService } from '../prisma/prisma.service';
export declare class ProductRequestsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string | null;
        status: string;
        quantity: number | null;
        images: import("@prisma/client/runtime/library").JsonValue | null;
        title: string;
        model: string | null;
        customerName: string;
        customerPhone: string;
        color: string | null;
        size: string | null;
    }>;
    findAll(): Promise<({
        user: {
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
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string | null;
        status: string;
        quantity: number | null;
        images: import("@prisma/client/runtime/library").JsonValue | null;
        title: string;
        model: string | null;
        customerName: string;
        customerPhone: string;
        color: string | null;
        size: string | null;
    })[]>;
    findByUserId(userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string | null;
        status: string;
        quantity: number | null;
        images: import("@prisma/client/runtime/library").JsonValue | null;
        title: string;
        model: string | null;
        customerName: string;
        customerPhone: string;
        color: string | null;
        size: string | null;
    }[]>;
    findOne(id: string): Promise<{
        user: {
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
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string | null;
        status: string;
        quantity: number | null;
        images: import("@prisma/client/runtime/library").JsonValue | null;
        title: string;
        model: string | null;
        customerName: string;
        customerPhone: string;
        color: string | null;
        size: string | null;
    }>;
    updateStatus(id: string, status: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string | null;
        status: string;
        quantity: number | null;
        images: import("@prisma/client/runtime/library").JsonValue | null;
        title: string;
        model: string | null;
        customerName: string;
        customerPhone: string;
        color: string | null;
        size: string | null;
    }>;
    remove(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string | null;
        status: string;
        quantity: number | null;
        images: import("@prisma/client/runtime/library").JsonValue | null;
        title: string;
        model: string | null;
        customerName: string;
        customerPhone: string;
        color: string | null;
        size: string | null;
    }>;
}
