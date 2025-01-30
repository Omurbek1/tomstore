import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: Request | any, res: Response, next: NextFunction) {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(403).json({ message: 'Нет токена' });
    }

    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'your_secret_key',
      );
      req.user = decoded;
      next();
    } catch (e) {
      console.error(e);
      return res.status(403).json({ message: 'Неверный токен' });
    }
  }
}
