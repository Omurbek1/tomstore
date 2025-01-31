import { forwardRef, Module } from '@nestjs/common';
import { WishlistController } from './wishlist.controller';
import { WishlistService } from './wishlist.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wishlist } from './wishlist.entity';
import User from 'src/user/users.entity';
import { Product } from 'src/products/product.entity';
import { AuthModule } from '../auth/auth.module';
@Module({
  imports: [
    TypeOrmModule.forFeature([Wishlist, User, Product]),
    forwardRef(() => AuthModule),
  ],
  providers: [WishlistService],
  controllers: [WishlistController],
  exports: [WishlistService, TypeOrmModule],
})
export class WishlistModule {}
