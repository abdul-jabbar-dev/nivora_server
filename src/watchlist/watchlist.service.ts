import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class WatchlistService {
  constructor(private prisma: PrismaService) {}

  async add(userId: string, productId: string) {
    try {
      return await this.prisma.watchlist.create({
        data: { userId, productId },
      });
    } catch (e) {
      if ((e as any).code === 'P2002') {
        throw new ConflictException('Product is already in watchlist');
      }
      throw e;
    }
  }

  async remove(userId: string, productId: string) {
    const item = await this.prisma.watchlist.findUnique({
      where: { userId_productId: { userId, productId } },
    });
    if (!item) throw new NotFoundException('Item not found in watchlist');

    return this.prisma.watchlist.delete({
      where: { id: item.id },
    });
  }

  async findAllForUser(userId: string) {
    return this.prisma.watchlist.findMany({
      where: { userId },
      include: { product: true },
    });
  }
}

