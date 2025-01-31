import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  IsIn,
} from 'class-validator';
import { UserRole } from 'src/user/users.entity';

export class SignUpDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'John Doe', description: 'Имя пользователя' })
  name: string;

  @IsNotEmpty()
  @ApiProperty({
    example: 'john@example.com',
    description: 'Email пользователя',
  })
  @IsEmail({}, { message: 'Введите корректный email' })
  email: string;

  @IsNotEmpty()
  @ApiProperty({ example: 'password123', description: 'Пароль' })
  @IsString()
  @MinLength(6, { message: 'Пароль должен быть минимум 6 символов' })
  password: string;

  @IsNotEmpty()
  @IsIn([UserRole], {
    message: 'Роль должна быть admin, manager или user',
  })
  @ApiProperty({
    example: 'user',
    description: 'Роль пользователя',
    enum: [UserRole],
  })
  role: UserRole;
}
