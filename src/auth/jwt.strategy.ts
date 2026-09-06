import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { passportJwtSecret } from 'jwks-rsa';
import { PrismaService } from '../prisma/prisma.service';
import { ENV } from '../env';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: ENV.SUPABASE_JWKS_URL,
      }),
      // audience: 'authenticated',
      // issuer: ENV.SUPABASE_JWT_ISSUER || `https://${ENV.SUPABASE_URL?.replace('https://', '')}/auth/v1`,
      algorithms: ['RS256', 'ES256'],
    });
  }

  async validate(payload: any) {
    if (!payload.sub) {
      throw new UnauthorizedException();
    }
    let user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
    });
    
    // If not found in our DB, create the user
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
}
