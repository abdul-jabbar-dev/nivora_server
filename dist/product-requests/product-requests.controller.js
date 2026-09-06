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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductRequestsController = void 0;
const common_1 = require("@nestjs/common");
const product_requests_service_1 = require("./product-requests.service");
const admin_key_guard_1 = require("../auth/admin-key.guard");
let ProductRequestsController = class ProductRequestsController {
    productRequestsService;
    constructor(productRequestsService) {
        this.productRequestsService = productRequestsService;
    }
    create(createRequestDto) {
        return this.productRequestsService.create(createRequestDto);
    }
    findAll() {
        return this.productRequestsService.findAll();
    }
};
exports.ProductRequestsController = ProductRequestsController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ProductRequestsController.prototype, "create", null);
__decorate([
    (0, common_1.UseGuards)(admin_key_guard_1.AdminKeyGuard),
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProductRequestsController.prototype, "findAll", null);
exports.ProductRequestsController = ProductRequestsController = __decorate([
    (0, common_1.Controller)('product-requests'),
    __metadata("design:paramtypes", [product_requests_service_1.ProductRequestsService])
], ProductRequestsController);
//# sourceMappingURL=product-requests.controller.js.map