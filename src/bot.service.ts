import { Injectable } from '@nestjs/common';
import { Config } from './config';

@Injectable()
export class BotService {
  // Проверка подписки пользователя на канал
  async isSubscribedToTelegram(userId: number): Promise<boolean> {
    try {
      const url = `https://api.telegram.org/bot${Config.TELEGRAM_TOKEN}/getChatMember`;
      const response = await fetch(
        `${url}?chat_id=${Config.TELEGRAM_CHANNEL_ID}&user_id=${userId}`,
      );
      const data = await response.json();

      if (!data.ok) {
        console.error('Ошибка Telegram API:', data.description);
        return false;
      }

      const status = data.result.status;
      return ['member', 'administrator', 'creator'].includes(status);
    } catch (error) {
      console.error('Ошибка проверки подписки:', error.message);
      return false;
    }
  }
}
