import { SiteSettingsService } from './site-settings.service';
import { SiteSetting } from '@prisma/client';
export declare class SiteSettingsController {
    private readonly siteSettingsService;
    constructor(siteSettingsService: SiteSettingsService);
    getSettings(): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        address: string | null;
        bkashNumber: string | null;
        facebookUrl: string | null;
        instagramUrl: string | null;
        freeShippingThreshold: number;
        contactEmail: string | null;
        contactPhone: string | null;
        whatsapp: string | null;
    }>;
    updateSettings(data: Partial<SiteSetting>): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        address: string | null;
        bkashNumber: string | null;
        facebookUrl: string | null;
        instagramUrl: string | null;
        freeShippingThreshold: number;
        contactEmail: string | null;
        contactPhone: string | null;
        whatsapp: string | null;
    }>;
}
