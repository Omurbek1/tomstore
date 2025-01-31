import {
  BadRequestException,
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import User, { UserRole } from '../user/users.entity';
import * as bcrypt from 'bcryptjs';

import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { UsersService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UsersService)) // ✅ Используем forwardRef()
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(signUpDto: SignUpDto) {
    const { name, email, password } = signUpDto;

    const existingUser = await this.usersService.findOneByEmail(email);
    if (existingUser) {
      throw new ConflictException(`❌ Email "${email}" уже используется`);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
const role: UserRole = UserRole.USER;
    const newUser = await this.usersService.create({
      name,
      email,
      password: hashedPassword,
      role, // ✅ Все новые пользователи автоматически получают роль "user"
    });

    const token = this.jwtService.sign({ id: newUser.id, role: newUser.role });

    return { token };
  }

  async login(loginDto: LoginDto): Promise<{ token: string }> {
    const { email, password } = loginDto;

    const user = await this.usersService.findOneByEmail(email); // ✅ Исправлено (передаём email)
    if (!user) {
      throw new UnauthorizedException('❌ Неверный email или пароль');
    }

    const isPasswordMatched = await bcrypt.compare(password, user.password);
    if (!isPasswordMatched) {
      throw new UnauthorizedException('❌ Неверный email или пароль');
    }

    const token = this.jwtService.sign({ id: user.id, role: user.role });

    return { token };
  }

  async getUserById(id: string | number): Promise<User> {
    const numericId = Number(id);

    if (isNaN(numericId)) {
      throw new NotFoundException(`❌ ID должен быть числом, получено: ${id}`);
    }

    const user = await this.usersService.findOne(numericId);

    if (!user) {
      throw new NotFoundException(
        `❌ Пользователь с ID ${numericId} не найден`,
      );
    }

    return user;
  }
}
