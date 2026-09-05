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
exports.WatchlistService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let WatchlistService = class WatchlistService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async add(userId, productId) {
        try {
            return await this.prisma.watchlist.create({
                data: { userId, productId },
            });
        }
        catch (e) {
            if (e.code === 'P2002') {
                throw new common_1.ConflictException('Product is already in watchlist');
            }
            if (e.code === 'P2003') {
                return null;
            }
            throw e;
        }
    }
    async remove(userId, productId) {
        const item = await this.prisma.watchlist.findUnique({
            where: { userId_productId: { userId, productId } },
        });
        if (!item)
            throw new common_1.NotFoundException('Item not found in watchlist');
        return this.prisma.watchlist.delete({
            where: { id: item.id },
        });
    }
    async findAllForUser(userId) {
        return this.prisma.watchlist.findMany({
            where: { userId },
            include: { product: true },
        });
    }
};
exports.WatchlistService = WatchlistService;
exports.WatchlistService = WatchlistService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], WatchlistService);
//# sourceMappingURL=watchlist.service.js.map