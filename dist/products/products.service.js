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
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ProductsService = class ProductsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(params) {
        const { category, sort, filter, page = 1, limit = 8, q, minPrice, maxPrice, minRating } = params;
        let where = {};
        if (category && category !== 'all') {
            where.category = { slug: category };
        }
        if (q) {
            where.OR = [
                { name: { contains: q, mode: 'insensitive' } },
                { description: { contains: q, mode: 'insensitive' } },
                { slug: { contains: q, mode: 'insensitive' } },
            ];
        }
        if (minPrice !== undefined || maxPrice !== undefined) {
            where.price = {};
            if (minPrice !== undefined)
                where.price.gte = minPrice;
            if (maxPrice !== undefined)
                where.price.lte = maxPrice;
        }
        if (minRating !== undefined) {
            where.rating = { gte: minRating };
        }
        if (filter === 'new') {
            where.isNew = true;
        }
        else if (filter === 'discount') {
            where.offerPrice = { not: null, gt: 0 };
        }
        else if (filter === 'upcoming') {
            where.status = 'upcoming';
        }
        let orderBy = {};
        if (filter === 'new') {
            orderBy = [{ newArrivalOrder: 'asc' }, { createdAt: 'desc' }];
        }
        else if (filter === 'discount') {
            orderBy = [{ discountOrder: 'asc' }, { createdAt: 'desc' }];
        }
        else if (sort === 'newest') {
            orderBy = { isNew: 'desc' };
        }
        else if (sort === 'price-low') {
            orderBy = { price: 'asc' };
        }
        else if (sort === 'price-high') {
            orderBy = { price: 'desc' };
        }
        else if (sort === 'featured') {
            orderBy = { isTrending: 'desc' };
        }
        else {
            orderBy = { createdAt: 'desc' };
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
    async getRelated(categoryId, limit = 4) {
        return this.prisma.product.findMany({
            where: { categoryId },
            take: limit,
            include: { category: true },
        });
    }
    async findOne(identifier) {
        const product = await this.prisma.product.findFirst({
            where: {
                OR: [
                    { slug: identifier },
                    { id: identifier }
                ]
            },
            include: { category: true },
        });
        if (!product)
            throw new common_1.NotFoundException('Product not found');
        return product;
    }
    async getAnalytics(id) {
        const product = await this.prisma.product.findUnique({
            where: { id },
            include: { category: true }
        });
        if (!product)
            throw new common_1.NotFoundException('Product not found');
        const orderItems = await this.prisma.orderItem.findMany({
            where: {
                productId: id,
                order: {
                    status: {
                        not: 'CANCELLED'
                    }
                }
            },
            include: {
                order: {
                    include: {
                        user: true
                    }
                }
            },
            orderBy: {
                order: {
                    createdAt: 'desc'
                }
            }
        });
        const totalSold = orderItems.reduce((acc, item) => acc + item.quantity, 0);
        const totalRevenue = orderItems.reduce((acc, item) => acc + (item.quantity * item.price), 0);
        const recentPurchases = orderItems.map(item => ({
            id: item.id,
            buyerName: item.order.user.firstName ? `${item.order.user.firstName} ${item.order.user.lastName || ''}`.trim() : item.order.user.email,
            buyerEmail: item.order.user.email,
            quantity: item.quantity,
            amount: item.quantity * item.price,
            date: item.order.createdAt,
            status: item.order.status
        }));
        return {
            product,
            analytics: {
                totalSold,
                totalRevenue,
            },
            recentPurchases
        };
    }
    async create(data) {
        return this.prisma.product.create({
            data,
        });
    }
    async createCategory(data) {
        return this.prisma.category.create({
            data,
        });
    }
    async updateCategory(id, data) {
        return this.prisma.category.update({
            where: { id },
            data,
        });
    }
    async update(id, data) {
        return this.prisma.product.update({
            where: { id },
            data,
        });
    }
    async remove(id) {
        return this.prisma.product.delete({
            where: { id },
        });
    }
    async getInteractionStatus(userId, productId) {
        const orderItem = await this.prisma.orderItem.findFirst({
            where: {
                productId,
                order: {
                    userId,
                    status: { not: 'CANCELLED' }
                }
            }
        });
        const canInteract = !!orderItem;
        const interaction = await this.prisma.productInteraction.findUnique({
            where: { userId_productId: { userId, productId } }
        });
        return {
            canInteract,
            interaction: interaction ? (interaction.isLike ? 'like' : 'dislike') : null
        };
    }
    async setInteraction(userId, productId, isLike) {
        const orderItem = await this.prisma.orderItem.findFirst({
            where: {
                productId,
                order: {
                    userId,
                    status: { not: 'CANCELLED' }
                }
            }
        });
        if (!orderItem) {
            throw new common_1.ForbiddenException('You can only interact with products you have purchased.');
        }
        const existing = await this.prisma.productInteraction.findUnique({
            where: { userId_productId: { userId, productId } }
        });
        await this.prisma.$transaction(async (prisma) => {
            if (existing) {
                if (existing.isLike === isLike) {
                    await prisma.productInteraction.delete({
                        where: { id: existing.id }
                    });
                    await prisma.product.update({
                        where: { id: productId },
                        data: {
                            likesCount: isLike ? { decrement: 1 } : undefined,
                            dislikesCount: !isLike ? { decrement: 1 } : undefined
                        }
                    });
                    return;
                }
                await prisma.productInteraction.update({
                    where: { id: existing.id },
                    data: { isLike }
                });
                await prisma.product.update({
                    where: { id: productId },
                    data: {
                        likesCount: isLike ? { increment: 1 } : { decrement: 1 },
                        dislikesCount: !isLike ? { increment: 1 } : { decrement: 1 }
                    }
                });
            }
            else {
                await prisma.productInteraction.create({
                    data: {
                        userId,
                        productId,
                        isLike
                    }
                });
                await prisma.product.update({
                    where: { id: productId },
                    data: {
                        likesCount: isLike ? { increment: 1 } : undefined,
                        dislikesCount: !isLike ? { increment: 1 } : undefined
                    }
                });
            }
        });
        return { success: true };
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProductsService);
//# sourceMappingURL=products.service.js.map