import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Req } from '@nestjs/common';
import { CartService } from './cart.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('cart')
@UseGuards(JwtAuthGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  getCart(@Req() req: any) {
    const userId = req.user.id || req.user.sub;
    return this.cartService.getCart(userId);
  }

  @Post('sync')
  syncCart(@Req() req: any, @Body() body: { items: any[] }) {
    const userId = req.user.id || req.user.sub;
    return this.cartService.syncCart(userId, body.items || []);
  }

  @Post('items')
  addItem(@Req() req: any, @Body() body: { productId: string, variant?: string, quantity: number }) {
    const userId = req.user.id || req.user.sub;
    return this.cartService.addItem(userId, body.productId, body.variant || null, body.quantity || 1);
  }

  @Put('items')
  updateItemQuantity(@Req() req: any, @Body() body: { productId: string, variant?: string, quantity: number }) {
    const userId = req.user.id || req.user.sub;
    return this.cartService.updateItemQuantity(userId, body.productId, body.variant || null, body.quantity);
  }

  @Delete('items/:productId')
  removeItem(@Req() req: any, @Param('productId') productId: string) {
    const userId = req.user.id || req.user.sub;
    return this.cartService.removeItem(userId, productId, null);
  }

  @Delete('items/:productId/:variant')
  removeItemWithVariant(@Req() req: any, @Param('productId') productId: string, @Param('variant') variant: string) {
    const userId = req.user.id || req.user.sub;
    return this.cartService.removeItem(userId, productId, variant);
  }
}
