import { Body, Controller, Get, Param, Post, UseGuards,Req, Delete, NotFoundException } from '@nestjs/common';
import { CartService } from './cart.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Cart')
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ summary: 'Добавить товар в корзину' })
  @ApiResponse({ status: 201, description: 'Товар добавлен в корзину' })
  async addToCart(@Body() body) {
    return this.cartService.addToCart(
      body.userId,
      body.productId,
      body.quantity,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ summary: 'Получить все товары в корзине пользователя' })
  @ApiResponse({ status: 200, description: 'Список товаров в корзине' })
  async getUserCart(@Req() req) {
    return this.cartService.getCart(req.user.id);
  }
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Удалить товар из корзины' })
  @ApiResponse({ status: 200, description: 'Товар удалён из корзины' })
  async removeFromCart(@Param('id') id: number) {
    if(!id){
      throw new NotFoundException(`Товар с ID ${id} не найден в корзине`);
    }
    return this.cartService.removeFromCart(id);
  }
}
