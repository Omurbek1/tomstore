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

  async create(createUserDto: Partial<User>): Promise<User> {
    const existingUser = await this.usersRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new ConflictException(
        `❌ Email "${createUserDto.email}" is already taken`,
      );
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const newUser = this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword, // ✅ Store the hashed password
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

 

  async findOne(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException(`❌ Пользователь с ID ${id} не найден`);
    }

    return user;
  }
  async findOneByEmail (email: string): Promise<User> {
    
  }
}
