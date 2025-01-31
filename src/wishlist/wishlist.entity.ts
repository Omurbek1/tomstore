import { Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import  User  from '../user/users.entity';
import { Product } from '../products/product.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Wishlist {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: 'ID записи в избранном', example: 1 })
  id: number;

  @ManyToOne(() => User, (user) => user.wishlist)
  @ApiProperty({ description: 'Пользователь, добавивший товар в избранное' })
  user: User;

  @ManyToOne(() => Product)
  @ApiProperty({ description: 'Товар, добавленный в избранное' })
  product: Product;
}
