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
exports.JwtStrategy = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const passport_jwt_1 = require("passport-jwt");
const jwks_rsa_1 = require("jwks-rsa");
const prisma_service_1 = require("../prisma/prisma.service");
let JwtStrategy = class JwtStrategy extends (0, passport_1.PassportStrategy)(passport_jwt_1.Strategy) {
    prisma;
    constructor(prisma) {
        super({
            secretOrKeyProvider: (0, jwks_rsa_1.passportJwtSecret)({
                cache: true,
                rateLimit: true,
                jwksRequestsPerMinute: 5,
                jwksUri: process.env.SUPABASE_JWKS_URL,
            }),
            jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
            audience: 'authenticated',
            issuer: process.env.SUPABASE_URL,
            algorithms: ['RS256'],
        });
        this.prisma = prisma;
    }
    async validate(payload) {
        if (!payload.sub) {
            throw new common_1.UnauthorizedException();
        }
        let user = await this.prisma.user.findUnique({
            where: { id: payload.sub },
        });
        if (!user) {
            const email = payload.email || `${payload.sub}@no-email.com`;
            let firstName = null;
            let lastName = null;
            const fullName = payload.user_metadata?.full_name || payload.user_metadata?.name;
            if (fullName) {
                const parts = fullName.split(' ');
                firstName = parts[0];
                lastName = parts.slice(1).join(' ') || null;
            }
            user = await this.prisma.user.create({
                data: {
                    id: payload.sub,
                    email: email,
                    firstName,
                    lastName,
                },
            });
        }
        return user;
    }
};
exports.JwtStrategy = JwtStrategy;
exports.JwtStrategy = JwtStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], JwtStrategy);
//# sourceMappingURL=jwt.strategy.js.map