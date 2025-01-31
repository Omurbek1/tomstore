import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from './cart.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>,
  ) {}

  async addToCart(userId: number, productId: number, quantity: number) {
    const cartItem = this.cartRepository.create({
      user: { id: userId },
      product: { id: productId },
      quantity: quantity || 1,
    });
    return this.cartRepository.save(cartItem);
  }
  async getCart(userId: number) {
    return this.cartRepository.find({
      where: { user: { id: userId } },
      relations: ['product'],
    });
  }

  async removeFromCart(cartItemId: number) {
    const cartItem = await this.cartRepository.findOne({
      where: { id: cartItemId },
    });
    if (!cartItem) {
      throw new NotFoundException(
        `Товар с ID ${cartItemId} не найден в корзине`,
      );
    }
    await this.cartRepository.delete(cartItemId);
    return { message: 'Товар удалён из корзины' };
  }
}
