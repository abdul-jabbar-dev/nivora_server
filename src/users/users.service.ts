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
  async findAll(page: number = 1, limit: number = 20, role?: string) {
    const skip = (page - 1) * limit;
    let targetRole: any = undefined;
    if (role && role !== 'ALL') {
      targetRole = role.toUpperCase() === 'USER' || role.toUpperCase() === 'CUSTOMER' ? 'CUSTOMER' : 'ADMIN';
    }
    const where = targetRole ? { role: targetRole } : undefined;
    
    const [users, total, totalUsersCount, totalAdminsCount] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          orders: {
            select: { total: true, status: true }
          }
        }
      }),
      this.prisma.user.count({ where }),
      this.prisma.user.count({ where: { role: 'CUSTOMER' } }),
      this.prisma.user.count({ where: { role: 'ADMIN' } })
    ]);
    
    const usersWithStats = users.map(user => {
      const successfulOrders = user.orders.filter(o => o.status !== 'CANCELLED');
      const totalSpent = successfulOrders.reduce((sum, order) => sum + order.total, 0);
      return {
        ...user,
        orderCount: user.orders.length,
        totalSpent
      };
    });
    
    return {
      users: usersWithStats,
      total,
      totalUsersCount,
      totalAdminsCount,
      page,
      totalPages: Math.ceil(total / limit)
    };
  }

  async findOneAdmin(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { 
        orders: {
          orderBy: { createdAt: 'desc' },
          include: { items: { include: { product: true } } }
        },
        watchlist: {
          include: { product: true }
        }
      },
    });
    if (!user) {
      const common = require('@nestjs/common');
      throw new common.NotFoundException('User not found');
    }
    
    const successfulOrders = user.orders.filter(o => o.status !== 'CANCELLED');
    const totalSpent = successfulOrders.reduce((sum, order) => sum + order.total, 0);
    
    return {
      ...user,
      totalSpent
    };
  }
}
