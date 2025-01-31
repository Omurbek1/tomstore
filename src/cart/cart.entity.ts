import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import  User  from '../user/users.entity'
import { Product } from '../products/product.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Cart {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: 'ID корзины', example: 1 })
  id: number;

  @ManyToOne(() => User, (user) => user.cart)
  @ApiProperty({ description: 'Пользователь корзины' })
  user: User;

  @ManyToOne(() => Product)
  @ApiProperty({ description: 'Товар в корзине' })
  product: Product;

  @Column({ nullable: false, default: 1 })
  @ApiProperty({ description: 'Количество товара', example: 2 })
  quantity: number;
}
