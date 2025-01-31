import { Body, Controller, Delete, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';


@ApiTags('Wishlist') // ✅ Теперь Swagger видит этот контроллер
@ApiBearerAuth() // ✅ Добавляем JWT авторизацию
@Controller('wishlist')
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ summary: 'Добавить товар в избранное' })
  @ApiResponse({ status: 201, description: 'Товар добавлен в избранное' })
  async addToWishlist(@Req() req, @Body() body) {
    return this.wishlistService.addToWishlist(req.user.id, body.productId);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ summary: 'Получить список избранного' })
  @ApiResponse({ status: 200, description: 'Список товаров в избранном' })
  async getWishlist(@Req() req) {
    return this.wishlistService.getWishlist(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Удалить товар из избранного' })
  @ApiResponse({ status: 200, description: 'Товар удалён из избранного' })
  async removeFromWishlist(@Param('id') id: number) {
    return this.wishlistService.removeFromWishlist(id);
  }
}
