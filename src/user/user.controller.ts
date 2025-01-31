import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Delete,
  UseGuards,
  Req,
  Patch,
  BadRequestException,
} from '@nestjs/common';
import User, { UserRole } from './users.entity';
import { UsersService } from './user.service';
import { CreateUserDto } from './dto/user.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RoleGuard } from 'src/auth/role.guard';
import { Roles } from 'src/auth/roles.decorator';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles('admin')
  @Get()
  async getAllUsers(@Req() req): Promise<User[]> {
    if (!req.user) {
      throw new Error(
        '❌ Ошибка: req.user не найден! Возможно, не передан токен.',
      );
    }
    return  await this.usersService.getAllUsers(req.user);
  }

  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles('admin', 'manager', 'user')
  @Get(':id')
  async getUserById(@Param('id') id: string): Promise<User> {
    const user = await this.usersService.findOne(Number(id));
    return user;
  }

  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles('admin') // ✅ Только админ может создавать пользователей
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto); // ✅ Теперь usersService доступен
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

  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles('admin') // ✅ Только админ может изменять роли
  @Patch(':id/role')
  async updateUserRole(
    @Req() req,
    @Param('id') userId: string,
    @Body() updateUserRoleDto: UpdateUserRoleDto,
  ) {
    const newRole = updateUserRoleDto.role as UserRole;

    if (!Object.values(UserRole).includes(newRole)) {
      throw new BadRequestException(
        '❌ Роль должна быть одной из: admin, manager, user',
      );
    }

    return this.usersService.updateUserRole(
      req.user.id,
      Number(userId),
      newRole,
    );
  }
}
