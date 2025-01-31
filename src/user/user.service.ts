import { BadRequestException, ConflictException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import User, { UserRole } from './users.entity';
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

  async create(userData: Partial<User>): Promise<User> {
    const existingUser = await this.findOneByEmail(userData.email);
    if (existingUser) {
      throw new ConflictException(
        `❌ Email "${userData.email}" уже используется`,
      );
    }

    const user = this.usersRepository.create({
      ...userData,
      role: userData.role || UserRole.USER, // ✅ Если роль не передана, устанавливаем "user"
    });

    return this.usersRepository.save(user);
  }

  async updateUserRole(
    adminId: number,
    userId: number,
    newRole: UserRole, // ✅ Используем `UserRole`, а не `string`
  ): Promise<User> {
    const adminUser = await this.findOne(adminId);

    if (adminUser.role !== UserRole.ADMIN) {
      throw new UnauthorizedException(
        '❌ Только администратор может изменять роли',
      );
    }

    const user = await this.findOne(userId);
    if (!user) {
      throw new NotFoundException(`❌ Пользователь с ID ${userId} не найден`);
    }

    if (!Object.values(UserRole).includes(newRole)) {
      throw new BadRequestException(
        '❌ Роль должна быть одной из: admin, manager, user',
      );
    }

    user.role = newRole;
    return this.usersRepository.save(user);
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

  async findOne(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException(`❌ Пользователь с ID ${id} не найден`);
    }

    return user;
  }
  async findOneByEmail(email: string): Promise<User | null> {
    // ✅ Добавили `| null`
    const user = await this.usersRepository.findOne({ where: { email } });
    return user || null; // ✅ Если пользователь не найден, возвращаем null
  }
}
