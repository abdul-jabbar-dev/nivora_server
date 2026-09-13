import { BillboardsService } from './billboards.service.js';
export declare class BillboardsController {
    private readonly billboardsService;
    constructor(billboardsService: BillboardsService);
    create(createBillboardDto: {
        title: string;
        imageUrl: string;
        link: string;
        isActive?: boolean;
        order?: number;
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        order: number;
        imageUrl: string;
        link: string;
        title: string;
        isActive: boolean;
    }>;
    findAllActive(): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        order: number;
        imageUrl: string;
        link: string;
        title: string;
        isActive: boolean;
    }[]>;
    findAll(): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        order: number;
        imageUrl: string;
        link: string;
        title: string;
        isActive: boolean;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        order: number;
        imageUrl: string;
        link: string;
        title: string;
        isActive: boolean;
    }>;
    update(id: string, updateBillboardDto: {
        title?: string;
        imageUrl?: string;
        link?: string;
        isActive?: boolean;
        order?: number;
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        order: number;
        imageUrl: string;
        link: string;
        title: string;
        isActive: boolean;
    }>;
    remove(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        order: number;
        imageUrl: string;
        link: string;
        title: string;
        isActive: boolean;
    }>;
}
