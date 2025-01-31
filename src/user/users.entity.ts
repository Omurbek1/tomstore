import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import * as bcrypt from 'bcryptjs';
export type UserRole = 'admin' | 'manager' | 'user';
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

  @Column({ type: 'enum', enum: ['admin', 'manager', 'user'], default: 'user' })
  role: UserRole;

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }
}

export default User;
