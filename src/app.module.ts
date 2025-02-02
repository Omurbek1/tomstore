import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ProductsModule } from './products/products.module';

import { UsersModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { CartModule } from './cart/cart.module';
import { WishlistModule } from './wishlist/wishlist.module';

@Module({
  imports: [
    ConfigModule.forRoot(), // Загружаем переменные окружения из .env
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'postgres',
        host: process.env.POSTGRESHOST || 'localhost',
        port: Number(process.env.POSTGRESPORT) || 5432,
        username: process.env.POSTGRESUSER || 'postgres',
        password: process.env.POSTGRESPASSWORD || 'password',
        database: process.env.POSTGRESDB || 'railway',
        synchronize: true, // Включите только в DEV!
        entities: [__dirname + '/**/*.entity.{js,ts}'], // Исправленный путь
        autoLoadEntities: true,
        logging: true,
        extra:
          process.env.POSTGRES_SSL === 'true'
            ? { ssl: { rejectUnauthorized: false } }
            : {},
      }),
    }),
    ProductsModule,
    UsersModule,
    AuthModule,
    CartModule,
    WishlistModule,
  ],
 

})
export class AppModule {}
