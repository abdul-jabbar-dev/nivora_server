"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_js_1 = require("../prisma/prisma.service.js");
const whatsapp_service_js_1 = require("../whatsapp/whatsapp.service.js");
let OrdersService = class OrdersService {
    prisma;
    whatsappService;
    constructor(prisma, whatsappService) {
        this.prisma = prisma;
        this.whatsappService = whatsappService;
    }
    async create(userId, createOrderDto) {
        const order = await this.prisma.$transaction(async (tx) => {
            const productIds = createOrderDto.items.map((item) => item.productId);
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
            const shipping = createOrderDto.shippingMethod === 'sameday' ? 70 : 130;
            const finalTotal = calculatedSubtotal + shipping;
            for (const item of createOrderDto.items) {
                await tx.product.update({
                    where: { id: item.productId },
                    data: { stock: { decrement: item.quantity } }
                });
            }
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
                        create: createOrderDto.items.map((item) => ({
                            productId: item.productId,
                            quantity: item.quantity,
                            price: productMap.get(item.productId).offerPrice ?? productMap.get(item.productId).price,
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
            const cart = await tx.cart.findUnique({ where: { userId } });
            if (cart) {
                await tx.cartItem.deleteMany({
                    where: { cartId: cart.id }
                });
            }
            return createdOrder;
        });
        this.whatsappService.sendOrderNotification(order).catch((err) => {
            console.error('WhatsApp notification error:', err);
        });
        return order;
    }
    async findAllForUser(userId, page = 1, limit = 10, status, search) {
        const skip = (page - 1) * limit;
        const whereClause = { userId };
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
    async findOne(id, userId) {
        const order = await this.prisma.order.findFirst({
            where: { id, userId },
            include: {
                items: { include: { product: true } },
                statusHistory: { orderBy: { createdAt: 'desc' } }
            },
        });
        if (!order)
            throw new common_1.NotFoundException('Order not found');
        return order;
    }
    async getAllAdminOrders(page = 1, limit = 20, status) {
        const skip = (page - 1) * limit;
        const whereClause = {};
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
    async getAdminOrderById(id) {
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
        if (!order)
            throw new common_1.NotFoundException('Order not found');
        return order;
    }
    async updateOrderStatus(id, status, note) {
        const order = await this.prisma.order.findUnique({ where: { id } });
        if (!order)
            throw new common_1.NotFoundException('Order not found');
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
    async cancelOrder(id, userId) {
        const order = await this.prisma.order.findFirst({
            where: { id, userId }
        });
        if (!order)
            throw new common_1.NotFoundException('Order not found');
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
    async deleteOrder(id) {
        const order = await this.prisma.order.findUnique({ where: { id } });
        if (!order)
            throw new common_1.NotFoundException('Order not found');
        return this.prisma.$transaction(async (tx) => {
            await tx.orderItem.deleteMany({ where: { orderId: id } });
            await tx.orderStatusHistory.deleteMany({ where: { orderId: id } });
            return tx.order.delete({ where: { id } });
        });
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_js_1.PrismaService,
        whatsapp_service_js_1.WhatsappService])
], OrdersService);
//# sourceMappingURL=orders.service.js.map