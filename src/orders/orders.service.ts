import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { WhatsappService } from '../whatsapp/whatsapp.service.js';

@Injectable()
export class OrdersService {
  constructor(
    private prisma: PrismaService,
    private whatsappService: WhatsappService,
  ) {}

  async create(userId: string, createOrderDto: any) {
    const order = await this.prisma.$transaction(async (tx) => {
      const productIds = createOrderDto.items.map((item: any) => item.productId);
      const products = await tx.product.findMany({
        where: { id: { in: productIds } }
      });

      const productMap = new Map(products.map(p => [p.id, p]));
      
      let calculatedSubtotal = 0;
      
      for (const item of createOrderDto.items) {
        const product = productMap.get(item.productId);
        if (!product) {
          throw new Error(`Product ${item.productId} not found`);
        }
        if (product.stock < item.quantity) {
          throw new Error(`Insufficient stock for product ${product.name}. Available: ${product.stock}`);
        }
        
        const itemPrice = product.offerPrice ?? product.price;
        calculatedSubtotal += itemPrice * item.quantity;
      }
      
      // Calculate shipping based on the method
      const shipping = createOrderDto.shippingMethod === 'sameday' ? 70 : 130;
      const finalTotal = calculatedSubtotal + shipping;

      // Deduct inventory
      for (const item of createOrderDto.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } }
        });
      }

      // Create the order
      const createdOrder = await tx.order.create({
        data: {
          userId,
          total: finalTotal,
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
              price: productMap.get(item.productId)!.offerPrice ?? productMap.get(item.productId)!.price,
            })),
          },
          statusHistory: {
            create: {
              status: 'PENDING',
              note: 'Order placed'
            }
          }
        },
        include: {
          items: {
            include: { product: true },
          },
          statusHistory: true,
          user: true,
        },
      });

      // Clear the user's cart
      const cart = await tx.cart.findUnique({ where: { userId } });
      if (cart) {
        await tx.cartItem.deleteMany({
          where: { cartId: cart.id }
        });
      }

      return createdOrder;
    });

    // Send WhatsApp notification to store owner in the background
    this.whatsappService.sendOrderNotification(order).catch((err) => {
      console.error('WhatsApp notification error:', err);
    });

    return order;
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

  async getAllAdminOrders(page = 1, limit = 20, status?: string) {
    const skip = (page - 1) * limit;
    
    const whereClause: any = {};
    if (status) {
      whereClause.status = status.toUpperCase();
    }
    
    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({
        where: whereClause,
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
      this.prisma.order.count({ where: whereClause })
    ]);

    return {
      orders,
      total,
      totalPages: Math.ceil(total / limit)
    };
  }

  async getDashboardStats() {
    const [totalOrders, pendingOrders, totalCustomers, recentOrders, revenueData] = await Promise.all([
      this.prisma.order.count(),
      this.prisma.order.count({ where: { status: 'PENDING' } }),
      this.prisma.user.count({ where: { role: 'CUSTOMER' } }),
      this.prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { firstName: true, lastName: true, email: true } },
          items: { include: { product: { select: { name: true, imageUrl: true } } } }
        }
      }),
      this.prisma.order.aggregate({
        _sum: { total: true },
        where: { status: { not: 'CANCELLED' } }
      })
    ]);

    return {
      totalRevenue: revenueData._sum.total || 0,
      totalOrders,
      pendingOrders,
      totalCustomers,
      recentOrders
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

  async deleteOrder(id: string) {
    const order = await this.prisma.order.findUnique({ where: { id } });
    if (!order) throw new NotFoundException('Order not found');

    return this.prisma.$transaction(async (tx) => {
      await tx.orderItem.deleteMany({ where: { orderId: id } });
      await tx.orderStatusHistory.deleteMany({ where: { orderId: id } });
      return tx.order.delete({ where: { id } });
    });
  }
}

