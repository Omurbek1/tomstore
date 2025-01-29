import { Context as TelegrafContext } from 'telegraf';

export interface SessionData {
  language?: 'ru' | 'kg';
}

export interface BotContext extends TelegrafContext {
  session: SessionData;
}
