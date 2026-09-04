"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminKeyGuard = void 0;
const common_1 = require("@nestjs/common");
let AdminKeyGuard = class AdminKeyGuard {
    canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const adminKey = request.headers['x-admin-secret'];
        if (adminKey === 'admin_secret_12345') {
            return true;
        }
        throw new common_1.UnauthorizedException('Invalid Admin Key');
    }
};
exports.AdminKeyGuard = AdminKeyGuard;
exports.AdminKeyGuard = AdminKeyGuard = __decorate([
    (0, common_1.Injectable)()
], AdminKeyGuard);
//# sourceMappingURL=admin-key.guard.js.map