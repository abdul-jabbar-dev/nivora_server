import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { orders: true, watchlist: true },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async updateProfile(id: string, data: any) {
    return this.prisma.user.update({
      where: { id },
      data: {
        firstName: data.firstName !== undefined ? data.firstName : undefined,
        lastName: data.lastName !== undefined ? data.lastName : undefined,
        address: data.address,
        city: data.city,
        zip: data.zip,
        landmark: data.landmark,
        phoneNumber: data.phoneNumber,
      },
    });
  }
}
