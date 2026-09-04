import { Controller, Get, Post, Delete, Body, Param, UseGuards, Req } from '@nestjs/common';
import { WatchlistService } from './watchlist.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('watchlist')
@UseGuards(JwtAuthGuard)
export class WatchlistController {
  constructor(private readonly watchlistService: WatchlistService) {}

  @Post()
  add(@Req() req: any, @Body('productId') productId: string) {
    const userId = req.user.id || req.user.sub;
    return this.watchlistService.add(userId, productId);
  }

  @Delete(':productId')
  remove(@Req() req: any, @Param('productId') productId: string) {
    const userId = req.user.id || req.user.sub;
    return this.watchlistService.remove(userId, productId);
  }

  @Get()
  findAll(@Req() req: any) {
    const userId = req.user.id || req.user.sub;
    return this.watchlistService.findAllForUser(userId);
  }
}
