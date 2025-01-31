import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Delete,
  UseGuards,
} from '@nestjs/common';
import User from './users.entity';
import { UsersService } from './user.service';
import { CreateUserDto } from './dto/user.dto';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RoleGuard } from 'src/auth/role.guard';
import { Roles } from 'src/auth/roles.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles('admin')
  @Get()
  async getAllUsers(): Promise<User[]> {
    const users = await this.usersService.getAllUsers();
    return users;
  }

  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles('admin', 'manager', 'user')
  @Get(':id')
  async getUserById(@Param('id') id: string): Promise<User> {
    const user = await this.usersService.findOne(Number(id));
    return user;
  }

  // @UseGuards(JwtAuthGuard, RoleGuard)
  // @Roles('admin')
  @Post()
  // @UseGuards(AuthGuard('jwt'))
  async create(@Body() createUserDto: CreateUserDto) {
    const newUser = await this.usersService.create(createUserDto);
    return newUser;
  }

  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles('admin')
  @Delete(':id')
  async deleteById(@Param('id') id: string): Promise<User> {
    const user = this.usersService.deleteById(Number(id));
    return user;
  }

  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles('admin', 'manager')
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.usersService.findOne(Number(id)); // ✅ Преобразуем ID в число перед вызовом сервиса
  }
}
