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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let UsersService = class UsersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findOne(id) {
        const user = await this.prisma.user.findUnique({
            where: { id },
            include: { orders: true, watchlist: true },
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        return user;
    }
    async updateProfile(id, data) {
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
    async findAll(page = 1, limit = 20) {
        const skip = (page - 1) * limit;
        const [users, total] = await Promise.all([
            this.prisma.user.findMany({
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: {
                    orders: {
                        select: { total: true, status: true }
                    }
                }
            }),
            this.prisma.user.count()
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
            page,
            totalPages: Math.ceil(total / limit)
        };
    }
    async findOneAdmin(id) {
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
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UsersService);
//# sourceMappingURL=users.service.js.map