import { Controller, Get, Patch, Body, UseGuards, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Req() req: any) {
    const userId = req.user.id || req.user.sub;
    return this.usersService.findOne(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('profile')
  updateProfile(@Req() req: any, @Body() body: any) {
    const userId = req.user.id || req.user.sub;
    return this.usersService.updateProfile(userId, body);
  }
}
