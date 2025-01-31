import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../user/user.service';
import User from '../user/users.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET || 'default_secret',
    });
  }

  async validate(payload: { id: number }): Promise<User> {
    const user = await this.usersService.findOne(payload.id);
    if (!user) {
      throw new UnauthorizedException('❌ Пользователь не найден');
    }

    return user; // ✅ Возвращаем `user` с `role`
  }
}
