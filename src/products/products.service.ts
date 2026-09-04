import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async findAll(params: { category?: string; sort?: string; page?: number; limit?: number }) {
    const { category, sort, page = 1, limit = 8 } = params;
    
    let where: any = {};
    if (category && category !== 'all') {
      where.category = { slug: category };
    }

    let orderBy: any = {};
    if (sort === 'newest') {
      orderBy = { isNew: 'desc' };
    } else if (sort === 'price_asc') {
      orderBy = { price: 'asc' };
    } else if (sort === 'price_desc') {
      orderBy = { price: 'desc' };
    } else if (sort === 'featured') {
      orderBy = { isTrending: 'desc' };
    }

    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        orderBy: Object.keys(orderBy).length ? orderBy : undefined,
        skip,
        take: Number(limit),
        include: { category: true },
      }),
      this.prisma.product.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return { products, total, totalPages };
  }

  async getCategories() {
    return this.prisma.category.findMany({
      orderBy: { name: 'asc' },
    });
  }

  async getTrending() {
    return this.prisma.product.findMany({
      where: { isTrending: true },
      include: { category: true },
    });
  }

  async getRelated(categoryId: string, limit = 4) {
    return this.prisma.product.findMany({
      where: { categoryId },
      take: limit,
      include: { category: true },
    });
  }

  async findOne(slug: string) {
    const product = await this.prisma.product.findUnique({
      where: { slug },
      include: { category: true },
    });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async create(data: any) {
    return this.prisma.product.create({
      data,
    });
  }

  async createCategory(data: any) {
    return this.prisma.category.create({
      data,
    });
  }
}
