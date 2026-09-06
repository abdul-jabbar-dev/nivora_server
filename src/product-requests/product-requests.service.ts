import { Injectable } from '@nestjs/common';
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
}
