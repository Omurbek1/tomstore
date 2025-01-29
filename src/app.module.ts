import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BotModule } from './bot.module';

@Module({
  imports: [
    BotModule,
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'postgres',
        host: process.env.POSTGRESHOST || 'localhost',
        port: Number(process.env.POSTGRESPORT) || 5432,
        username: process.env.POSTGRESUSER || 'postgres',
        password: process.env.POSTGRESPASSWORD || 'password',
        database: process.env.POSTGRESDB || 'mydatabase',
        synchronize: true,
        entities: [__dirname + '/../**/*.entity.{ts,js}'], // Add this to load entities
        autoLoadEntities: true, // Optional: Auto-load entities
        logging: true, // Optional: Logs queries for debugging
        extra: {
          ssl:
            process.env.POSTGRESSSL === 'true'
              ? { rejectUnauthorized: false }
              : false,
        },
      }),
    }),
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
