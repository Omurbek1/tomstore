import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/users.entity';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async validateUser(email: string, password: string): Promise<string | null> {
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) return null;

    const passwordValid = await bcrypt.compare(password, user.password);
    if (!passwordValid) return null;

    // Создаем JWT
    const payload = { id: user.id, email: user.email, role: user.role };
    return jwt.sign(payload, process.env.JWT_SECRET || 'your_secret_key', {
      expiresIn: '7d',
    });
  }
}
