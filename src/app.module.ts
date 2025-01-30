import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from './products/products.module';
import { AuthMiddleware } from './auth/auth.middleware';
import { UsersModule } from './user/user.module';

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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('*');
  }
}
