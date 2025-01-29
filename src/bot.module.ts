import { Module } from '@nestjs/common';
import { TelegrafModule } from 'nestjs-telegraf';
import { BotUpdate } from './bot.update';

import { Config } from './config';
import { session, Telegraf } from 'telegraf';

@Module({
  imports: [
    TelegrafModule.forRoot({
      token: Config.TELEGRAM_TOKEN,
      middlewares: [session()],
    }),
  ],
  providers: [
    BotUpdate,
    {
      provide: 'TelegrafBot',
      useFactory: () => {
        return new Telegraf(Config.TELEGRAM_TOKEN);
      },
    },
  ],
})
export class BotModule {}
