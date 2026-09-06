import { PrismaService } from '../prisma/prisma.service';
export declare class ProductRequestsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        images: import("@prisma/client/runtime/library").JsonValue | null;
        status: string;
        quantity: number | null;
        userId: string | null;
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
        images: import("@prisma/client/runtime/library").JsonValue | null;
        status: string;
        quantity: number | null;
        userId: string | null;
        title: string;
        model: string | null;
        customerName: string;
        customerPhone: string;
        color: string | null;
        size: string | null;
    })[]>;
}
