import { Controller, Get, Patch, Body, UseGuards } from '@nestjs/common';
import { SiteSettingsService } from './site-settings.service';
import { Prisma, SiteSetting } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';

@Controller('site-settings')
export class SiteSettingsController {
  constructor(private readonly siteSettingsService: SiteSettingsService) {}

  @Get()
  async getSettings() {
    return this.siteSettingsService.getSettings();
  }

  @Patch()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async updateSettings(@Body() data: Partial<SiteSetting>) {
    return this.siteSettingsService.updateSettings(data);
  }
}
