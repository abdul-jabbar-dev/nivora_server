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
        const { category, sort, page = 1, limit = 8 } = params;
        let where = {};
        if (category && category !== 'all') {
            where.category = { slug: category };
        }
        let orderBy = {};
        if (sort === 'newest') {
            orderBy = { isNew: 'desc' };
        }
        else if (sort === 'price_asc') {
            orderBy = { price: 'asc' };
        }
        else if (sort === 'price_desc') {
            orderBy = { price: 'desc' };
        }
        else if (sort === 'featured') {
            orderBy = { isTrending: 'desc' };
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
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProductsService);
//# sourceMappingURL=products.service.js.map