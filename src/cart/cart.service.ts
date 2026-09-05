import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  async getCart(userId: string) {
    let cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    });

    if (!cart) {
      cart = await this.prisma.cart.create({
        data: { userId },
        include: {
          items: {
            include: {
              product: true
            }
          }
        }
      });
    }

    return cart;
  }

  async syncCart(userId: string, items: { productId: string, variant: string | null, quantity: number }[]) {
    // Upsert the cart
    const cart = await this.prisma.cart.upsert({
      where: { userId },
      update: {},
      create: { userId },
    });

    // Delete existing items
    await this.prisma.cartItem.deleteMany({
      where: { cartId: cart.id }
    });

    // Combine quantities for duplicate items in the incoming array
    const combinedItems = new Map<string, any>();
    for (const item of items) {
      const variantStr = item.variant || '';
      const key = `${item.productId}_${variantStr}`;
      if (combinedItems.has(key)) {
        combinedItems.get(key).quantity += item.quantity;
      } else {
        combinedItems.set(key, { ...item, variantStr });
      }
    }

    // Insert new items safely
    for (const item of combinedItems.values()) {
      try {
        await this.prisma.cartItem.create({
          data: {
            cartId: cart.id,
            productId: item.productId,
            variant: item.variantStr,
            quantity: item.quantity,
          }
        });
      } catch (e) {
        // Ignore P2003 (product does not exist) or P2002 (shouldn't happen now)
        if ((e as any).code === 'P2003' || (e as any).code === 'P2002') {
          console.warn(`Skipping invalid cart item sync: ${item.productId}`);
          continue;
        }
        throw e;
      }
    }

    return this.getCart(userId);
  }

  async addItem(userId: string, productId: string, variant: string | null, quantity: number) {
    const cart = await this.prisma.cart.upsert({
      where: { userId },
      update: {},
      create: { userId },
    });

    const existingItem = await this.prisma.cartItem.findUnique({
      where: {
        cartId_productId_variant: {
          cartId: cart.id,
          productId,
          variant: variant || '',
        }
      }
    });

    try {
      if (existingItem) {
        await this.prisma.cartItem.update({
          where: { id: existingItem.id },
          data: { quantity: existingItem.quantity + quantity }
        });
      } else {
        await this.prisma.cartItem.create({
          data: {
            cartId: cart.id,
            productId,
            variant: variant || '',
            quantity,
          }
        });
      }
    } catch (e) {
      if ((e as any).code === 'P2003') return this.getCart(userId); // Product not found, ignore
      throw e;
    }

    return this.getCart(userId);
  }

  async removeItem(userId: string, productId: string, variant: string | null) {
    const cart = await this.prisma.cart.findUnique({ where: { userId } });
    if (!cart) throw new NotFoundException('Cart not found');

    const item = await this.prisma.cartItem.findUnique({
      where: {
        cartId_productId_variant: {
          cartId: cart.id,
          productId,
          variant: variant || '',
        }
      }
    });

    if (item) {
      await this.prisma.cartItem.delete({ where: { id: item.id } });
    }

    return this.getCart(userId);
  }

  async updateItemQuantity(userId: string, productId: string, variant: string | null, quantity: number) {
    const cart = await this.prisma.cart.findUnique({ where: { userId } });
    if (!cart) throw new NotFoundException('Cart not found');

    const item = await this.prisma.cartItem.findUnique({
      where: {
        cartId_productId_variant: {
          cartId: cart.id,
          productId,
          variant: variant || '',
        }
      }
    });

    if (item) {
      await this.prisma.cartItem.update({
        where: { id: item.id },
        data: { quantity }
      });
    }

    return this.getCart(userId);
  }
}
