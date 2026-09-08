import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { AuthModule } from './auth/auth.module.js';
import { UsersModule } from './users/users.module.js';
import { ProductsModule } from './products/products.module.js';
import { OrdersModule } from './orders/orders.module.js';
import { WatchlistModule } from './watchlist/watchlist.module.js';
import { UploadModule } from './upload/upload.module.js';
import { CartModule } from './cart/cart.module';
import { ReviewsModule } from './reviews/reviews.module';
import { ProductRequestsModule } from './product-requests/product-requests.module';
import { BillboardsModule } from './billboards/billboards.module.js';
import { SiteSettingsModule } from './site-settings/site-settings.module.js';

@Module({
  imports: [PrismaModule, AuthModule, UsersModule, ProductsModule, OrdersModule, WatchlistModule, UploadModule, CartModule, ReviewsModule, ProductRequestsModule, BillboardsModule, SiteSettingsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
