import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, SiteSetting } from '@prisma/client';

@Injectable()
export class SiteSettingsService {
  constructor(private prisma: PrismaService) {}

  async getSettings() {
    const settings = await this.prisma.siteSetting.findFirst();
    if (!settings) {
      return this.prisma.siteSetting.create({
        data: {}
      });
    }
    return settings;
  }

  async updateSettings(data: Partial<SiteSetting>) {
    const settings = await this.getSettings();
    
    // Convert freeShippingThreshold to number if it's passed as a string
    if (data.freeShippingThreshold !== undefined && data.freeShippingThreshold !== null) {
      data.freeShippingThreshold = Number(data.freeShippingThreshold);
    }

    return this.prisma.siteSetting.update({
      where: { id: settings.id },
      data,
    });
  }
}
