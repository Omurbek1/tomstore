import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { SignUpDto } from './dto/signup.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from './jwt-auth.guard';
import { UsersService } from 'src/user/user.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @ApiOperation({ summary: 'Регистрация нового пользователя' }) // ✅ Описание метода в Swagger
  @ApiResponse({
    status: 201,
    description: 'Пользователь успешно зарегистрирован',
  })
  @Post('/signup')
  signUp(@Body() signUpDto: SignUpDto): Promise<{ token: string }> {
    return this.authService.signUp(signUpDto);
  }

  @ApiOperation({ summary: 'Авторизация пользователя' })
  @ApiResponse({
    status: 200,
    description: 'Успешный вход, возвращает JWT токен',
  })
  @Post('/login')
  login(@Body() loginDto: LoginDto): Promise<{ token: string }> {
    return this.authService.login(loginDto);
  }

  @ApiBearerAuth() // ✅ Swagger: указываем, что метод требует авторизацию
  @ApiOperation({ summary: 'Получение информации о текущем пользователе' })
  @ApiResponse({
    status: 200,
    description: 'Успешный запрос. Возвращает информацию о пользователе',
  })
  @UseGuards(JwtAuthGuard) // ✅ Защищаем JWT
  @Get('me') // Новый маршрут `/api/auth/me`
  async getMe(@Request() req) {
    const user = await this.usersService.findOne(req.user.id); // ✅ Получаем пользователя из БД
    return user;
  }
}
