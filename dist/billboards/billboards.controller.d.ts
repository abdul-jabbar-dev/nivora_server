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
        order: number;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        imageUrl: string;
        link: string;
        title: string;
        isActive: boolean;
    }>;
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
    update(id: string, updateBillboardDto: {
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
