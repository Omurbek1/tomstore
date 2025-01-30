import { ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import User from './users.entity';
import { CreateUserDto } from './dto/user.dto';
import * as bcrypt from 'bcryptjs';
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async getAllUsers() {
    const users = this.usersRepository.find();
    return users;
  }

  async getUserById(id: number) {
    const user = await this.usersRepository.findOne({
      where: {
        id: id,
      },
    });
    if (user) {
      return user;
    }
    throw new NotFoundException('Could not find the user');
  }

  async createUser(createUserDto: CreateUserDto) {
    // ✅ Проверяем, существует ли уже пользователь с таким email
    const existingUser = await this.usersRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new ConflictException(
        `❌ Пользователь с email "${createUserDto.email}" уже существует`,
      );
    }

    // ✅ Хешируем пароль перед сохранением
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    // ✅ Создаём нового пользователя с хешированным паролем
    const newUser = this.usersRepository.create({
      name: createUserDto.name,
      email: createUserDto.email,
      password: hashedPassword, // Сохранение хешированного пароля
    });

    return this.usersRepository.save(newUser);
  }

  async deleteById(id: number) {
    const user = await this.usersRepository.findOne({
      where: {
        id: id,
      },
    });
    if (!user) {
      return null;
    }

    await this.usersRepository.remove(user);
    return user;
  }
}
