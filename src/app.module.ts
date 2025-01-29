import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'postgres',
        host: process.env.POSTGRESHOST,
        port: +process.env.POSTGRESPORT,
        username: process.env.POSTGRESUSER,
        password: process.env.POSTGRESPASSWORD,
        database: process.env.POSTGRESDB,
        synchronize: true,
        entities: [],
      }),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
