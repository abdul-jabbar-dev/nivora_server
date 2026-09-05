import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createOrderDto: any) {
    return this.prisma.order.create({
      data: {
        userId,
        total: createOrderDto.total,
        address: createOrderDto.address,
        city: createOrderDto.city,
        zip: createOrderDto.zip,
        landmark: createOrderDto.landmark,
        phoneNumber: createOrderDto.phoneNumber,
        paymentMethod: createOrderDto.paymentMethod,
        shippingMethod: createOrderDto.shippingMethod,
        bkashNumber: createOrderDto.bkashNumber,
        trxId: createOrderDto.trxId,
        items: {
          create: createOrderDto.items.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
        statusHistory: {
          create: {
            status: 'PENDING',
            note: 'Order placed'
          }
        }
      },
      include: { items: true, statusHistory: true },
    });
  }

  async findAllForUser(userId: string, page = 1, limit = 10, status?: string, search?: string) {
    const skip = (page - 1) * limit;
    
    const whereClause: any = { userId };
    
    if (status) {
      whereClause.status = status.toUpperCase();
    }
    
    if (search) {
      whereClause.id = { contains: search, mode: 'insensitive' };
    }

    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({
        where: whereClause,
        skip,
        take: Number(limit),
        include: { 
          items: { include: { product: true } },
          statusHistory: { orderBy: { createdAt: 'desc' } }
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.order.count({ where: whereClause })
    ]);

    return {
      orders,
      total,
      totalPages: Math.ceil(total / limit)
    };
  }

  async findOne(id: string, userId: string) {
    const order = await this.prisma.order.findFirst({
      where: { id, userId },
      include: { 
        items: { include: { product: true } },
        statusHistory: { orderBy: { createdAt: 'desc' } }
      },
    });
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  async getAllAdminOrders(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    
    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({
        skip,
        take: Number(limit),
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: { firstName: true, lastName: true, email: true, id: true }
          },
          items: {
            include: { product: { select: { name: true, imageUrl: true } } }
          },
          statusHistory: { orderBy: { createdAt: 'desc' } }
        }
      }),
      this.prisma.order.count()
    ]);

    return {
      orders,
      total,
      totalPages: Math.ceil(total / limit)
    };
  }

  async getAdminOrderById(id: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: { product: true }
        },
        user: {
          select: { id: true, email: true, firstName: true, lastName: true }
        },
        statusHistory: { orderBy: { createdAt: 'desc' } }
      }
    });
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  async updateOrderStatus(id: string, status: any, note?: string) {
    const order = await this.prisma.order.findUnique({ where: { id } });
    if (!order) throw new NotFoundException('Order not found');

    return this.prisma.order.update({
      where: { id },
      data: { 
        status,
        statusHistory: {
          create: {
            status,
            note
          }
        }
      },
      include: { statusHistory: true }
    });
  }

  async cancelOrder(id: string, userId: string) {
    const order = await this.prisma.order.findFirst({
      where: { id, userId }
    });
    
    if (!order) throw new NotFoundException('Order not found');
    
    if (order.status !== 'PENDING') {
      throw new Error('Only pending orders can be cancelled');
    }
    
    return this.prisma.order.update({
      where: { id },
      data: { 
        status: 'CANCELLED',
        statusHistory: {
          create: {
            status: 'CANCELLED',
            note: 'Cancelled by customer'
          }
        }
      }
    });
  }
}

