import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger(PrismaService.name);

  async onModuleInit() {
    await this.$connect();
    // Ensure system admin user exists in DB so foreign keys for Cart/Watchlist/Orders don't fail
    try {
      await this.user.upsert({
        where: { id: 'admin' },
        update: {},
        create: {
          id: 'admin',
          email: 'admin@system.local',
          role: 'ADMIN',
          firstName: 'System',
          lastName: 'Admin',
        },
      });
    } catch (e: any) {
      this.logger.warn(`Could not upsert default admin user: ${e.message}`);
    }
  }
}
