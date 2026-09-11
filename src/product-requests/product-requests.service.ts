import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProductRequestsService {
  constructor(private prisma: PrismaService) {}

  async create(data: any) {
    return this.prisma.productRequest.create({
      data,
    });
  }

  async findAll() {
    return this.prisma.productRequest.findMany({
      orderBy: { createdAt: 'desc' },
      include: { user: true },
    });
  }

  async findByUserId(userId: string) {
    return this.prisma.productRequest.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const req = await this.prisma.productRequest.findUnique({
      where: { id },
      include: { user: true },
    });
    if (!req) {
      throw new NotFoundException('Product request not found');
    }
    return req;
  }

  async updateStatus(id: string, status: string) {
    return this.prisma.productRequest.update({
      where: { id },
      data: { status },
    });
  }

  async remove(id: string) {
    const req = await this.prisma.productRequest.findUnique({ where: { id } });
    if (!req) {
      throw new NotFoundException('Product request not found');
    }
    return this.prisma.productRequest.delete({
      where: { id },
    });
  }
}
