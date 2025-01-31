import { BeforeInsert, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { Cart } from 'src/cart/cart.entity';

// ✅ Официальный enum для ролей
export enum UserRole {
  ADMIN = 'admin',
  MANAGER = 'manager',
  USER = 'user',
}

@Entity()
class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: 'Unknown' })
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER }) // ✅ Enum корректно используется
  role: UserRole;

  @OneToMany(() => Cart, (cart) => cart.user) // ✅ Связь с корзиной
  cart: Cart[];

  @BeforeInsert()
  async hashPassword() {
    if (this.password) {
      this.password = await bcrypt.hash(this.password, 10); // ✅ Пароль хешируется при сохранении
    }
  }
}

export default User;
