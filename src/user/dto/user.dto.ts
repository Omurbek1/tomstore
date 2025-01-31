import { IsNotEmpty, IsEmail, MinLength, IsIn } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsNotEmpty()
  @IsIn(['admin', 'manager', 'user']) // ✅ Разрешаем только указанные роли
  role: 'admin' | 'manager' | 'user';
}
