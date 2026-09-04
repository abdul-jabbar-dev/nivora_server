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
            total: number;
            status: import(".prisma/client").$Enums.OrderStatus;
            userId: string;
        }[];
    } & {
        id: string;
        email: string;
        role: import(".prisma/client").$Enums.Role;
        firstName: string | null;
        lastName: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
