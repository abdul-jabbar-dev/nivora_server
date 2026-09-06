import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class BillboardsService {
  constructor(private prisma: PrismaService) {}

  async findAllActive() {
    return this.prisma.billboard.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
    });
  }

  async findAll() {
    return this.prisma.billboard.findMany({
      orderBy: { order: 'asc' },
    });
  }

  async findOne(id: string) {
    const billboard = await this.prisma.billboard.findUnique({
      where: { id },
    });
    if (!billboard) {
      throw new NotFoundException(`Billboard with ID ${id} not found`);
    }
    return billboard;
  }

  async create(data: { title: string; imageUrl: string; link: string; isActive?: boolean; order?: number }) {
    return this.prisma.billboard.create({
      data,
    });
  }

  async update(id: string, data: { title?: string; imageUrl?: string; link?: string; isActive?: boolean; order?: number }) {
    return this.prisma.billboard.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    return this.prisma.billboard.delete({
      where: { id },
    });
  }
}
