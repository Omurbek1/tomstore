import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsIn } from 'class-validator';
import { UserRole } from '../users.entity';


export class UpdateUserRoleDto {
  @IsNotEmpty()
  @IsIn(Object.values(UserRole), {
    message: 'Роль должна быть admin, manager или user',
  })
  @ApiProperty({
    example: 'manager',
    description: 'Новая роль',
    enum: UserRole,
  })
  role: UserRole;
}
