import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Wishlist } from './wishlist.entity';
import { Repository } from 'typeorm';

@Injectable()
export class WishlistService {
  constructor(
    @InjectRepository(Wishlist)
    private wishlistRepository: Repository<Wishlist>,
  ) {}

  async addToWishlist(userId: number, productId: number) {
    const wishlistItem = this.wishlistRepository.create({
      user: { id: userId },
      product: { id: productId },
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
