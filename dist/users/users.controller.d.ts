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
            address: string | null;
            city: string | null;
            zip: string | null;
            landmark: string | null;
            phoneNumber: string | null;
            status: import(".prisma/client").$Enums.OrderStatus;
            total: number;
            paymentMethod: string | null;
            shippingMethod: string | null;
            bkashNumber: string | null;
            trxId: string | null;
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
        address: string | null;
        city: string | null;
        zip: string | null;
        landmark: string | null;
        phoneNumber: string | null;
    }>;
    updateProfile(req: any, body: any): Promise<{
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
