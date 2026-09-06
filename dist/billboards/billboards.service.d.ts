import { PrismaService } from '../prisma/prisma.service.js';
export declare class BillboardsService {
    private prisma;
    constructor(prisma: PrismaService);
    findAllActive(): Promise<{
        order: number;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        imageUrl: string;
        link: string;
        title: string;
        isActive: boolean;
    }[]>;
    findAll(): Promise<{
        order: number;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        imageUrl: string;
        link: string;
        title: string;
        isActive: boolean;
    }[]>;
    findOne(id: string): Promise<{
        order: number;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        imageUrl: string;
        link: string;
        title: string;
        isActive: boolean;
    }>;
    create(data: {
        title: string;
        imageUrl: string;
        link: string;
        isActive?: boolean;
        order?: number;
    }): Promise<{
        order: number;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        imageUrl: string;
        link: string;
        title: string;
        isActive: boolean;
    }>;
    update(id: string, data: {
        title?: string;
        imageUrl?: string;
        link?: string;
        isActive?: boolean;
        order?: number;
    }): Promise<{
        order: number;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        imageUrl: string;
        link: string;
        title: string;
        isActive: boolean;
    }>;
    remove(id: string): Promise<{
        order: number;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        imageUrl: string;
        link: string;
        title: string;
        isActive: boolean;
    }>;
}
