import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as dotenv from 'dotenv';
dotenv.config();
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
   app.enableCors({
     origin: '*', // Разрешить всем фронтендам (можно указать конкретный домен)
     methods: ['GET', 'POST', 'PUT', 'DELETE'],
     allowedHeaders: ['Content-Type', 'Authorization'],
   });
  const config = new DocumentBuilder()
    .setTitle('TomStore API') // Заголовок документации
    .setDescription('Документация API для TomStore') // Описание API
    .setVersion('1.0') // Версия API
    .addBearerAuth() // Добавляем JWT авторизацию
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);
   const port = process.env.PORT || 8080;
   await app.listen(port); // ❌ Удаляем `0.0.0.0`

   console.log(
     `🚀 API запущено на https://tomstore-production.up.railway.app/api`,
   );
   console.log(
     `📜 Swagger доступен на https://tomstore-production.up.railway.app/api/docs`,
   );
}
bootstrap();
