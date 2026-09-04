import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getProfile(req: any): Promise<{
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
