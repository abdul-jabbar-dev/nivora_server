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
exports.CartService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let CartService = class CartService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getCart(userId) {
        let cart = await this.prisma.cart.findUnique({
            where: { userId },
            include: {
                items: {
                    include: {
                        product: true
                    }
                }
            }
        });
        if (!cart) {
            cart = await this.prisma.cart.create({
                data: { userId },
                include: {
                    items: {
                        include: {
                            product: true
                        }
                    }
                }
            });
        }
        return cart;
    }
    async syncCart(userId, items) {
        const cart = await this.prisma.cart.upsert({
            where: { userId },
            update: {},
            create: { userId },
        });
        await this.prisma.cartItem.deleteMany({
            where: { cartId: cart.id }
        });
        const combinedItems = new Map();
        for (const item of items) {
            const variantStr = item.variant || '';
            const key = `${item.productId}_${variantStr}`;
            if (combinedItems.has(key)) {
                combinedItems.get(key).quantity += item.quantity;
            }
            else {
                combinedItems.set(key, { ...item, variantStr });
            }
        }
        for (const item of combinedItems.values()) {
            try {
                await this.prisma.cartItem.create({
                    data: {
                        cartId: cart.id,
                        productId: item.productId,
                        variant: item.variantStr,
                        quantity: item.quantity,
                    }
                });
            }
            catch (e) {
                if (e.code === 'P2003' || e.code === 'P2002') {
                    console.warn(`Skipping invalid cart item sync: ${item.productId}`);
                    continue;
                }
                throw e;
            }
        }
        return this.getCart(userId);
    }
    async addItem(userId, productId, variant, quantity) {
        const cart = await this.prisma.cart.upsert({
            where: { userId },
            update: {},
            create: { userId },
        });
        const existingItem = await this.prisma.cartItem.findUnique({
            where: {
                cartId_productId_variant: {
                    cartId: cart.id,
                    productId,
                    variant: variant || '',
                }
            }
        });
        try {
            if (existingItem) {
                await this.prisma.cartItem.update({
                    where: { id: existingItem.id },
                    data: { quantity: existingItem.quantity + quantity }
                });
            }
            else {
                await this.prisma.cartItem.create({
                    data: {
                        cartId: cart.id,
                        productId,
                        variant: variant || '',
                        quantity,
                    }
                });
            }
        }
        catch (e) {
            if (e.code === 'P2003')
                return this.getCart(userId);
            throw e;
        }
        return this.getCart(userId);
    }
    async removeItem(userId, productId, variant) {
        const cart = await this.prisma.cart.findUnique({ where: { userId } });
        if (!cart)
            throw new common_1.NotFoundException('Cart not found');
        const item = await this.prisma.cartItem.findUnique({
            where: {
                cartId_productId_variant: {
                    cartId: cart.id,
                    productId,
                    variant: variant || '',
                }
            }
        });
        if (item) {
            await this.prisma.cartItem.delete({ where: { id: item.id } });
        }
        return this.getCart(userId);
    }
    async updateItemQuantity(userId, productId, variant, quantity) {
        const cart = await this.prisma.cart.findUnique({ where: { userId } });
        if (!cart)
            throw new common_1.NotFoundException('Cart not found');
        const item = await this.prisma.cartItem.findUnique({
            where: {
                cartId_productId_variant: {
                    cartId: cart.id,
                    productId,
                    variant: variant || '',
                }
            }
        });
        if (item) {
            await this.prisma.cartItem.update({
                where: { id: item.id },
                data: { quantity }
            });
        }
        return this.getCart(userId);
    }
};
exports.CartService = CartService;
exports.CartService = CartService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CartService);
//# sourceMappingURL=cart.service.js.map