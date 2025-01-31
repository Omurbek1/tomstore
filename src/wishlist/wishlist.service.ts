import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Wishlist } from './wishlist.entity';
import { Repository } from 'typeorm';
import { Product } from 'src/products/product.entity';

@Injectable()
export class WishlistService {
  constructor(
    @InjectRepository(Wishlist)
    private wishlistRepository: Repository<Wishlist>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async addToWishlist(userId: number, productId: number) {
    // 🔍 Проверяем, существует ли товар
    const product = await this.productRepository.findOne({
      where: { id: productId },
    });
    if (!product) {
      throw new NotFoundException(`Товар с ID ${productId} не найден`);
    }

    // 🔍 Проверяем, не добавлен ли уже товар в избранное
    const existingWishlist = await this.wishlistRepository.findOne({
      where: { user: { id: userId }, product: { id: productId } },
    });
    if (existingWishlist) {
      throw new NotFoundException(`Товар уже в избранном`);
    }

    // ✅ Добавляем товар в избранное
    const wishlistItem = this.wishlistRepository.create({
      user: { id: userId },
      product,
    });
    return this.wishlistRepository.save(wishlistItem);
  }

  async getWishlist(userId: number) {
    return this.wishlistRepository.find({
      where: { user: { id: userId } },
      relations: ['product'],
    });
  }

  async removeFromWishlist(wishlistItemId: number) {
    await this.wishlistRepository.delete(wishlistItemId);
    return { message: 'Товар удалён из избранного' };
  }
}
