import { Ctx, Update, Start, Command, Action } from 'nestjs-telegraf';
import { BotContext } from './bot.context';
import { Config } from './config';
import axios from 'axios';

@Update()
export class BotUpdate {
  @Start()
  async startCommand(@Ctx() ctx: BotContext) {
    await ctx.reply('Выберите язык / Тилди тандаңыз:', {
      reply_markup: {
        inline_keyboard: [
          [
            { text: 'Русский', callback_data: 'set_lang_ru' },
            { text: 'Кыргызча', callback_data: 'set_lang_kg' },
          ],
        ],
      },
    });
  }

  @Action('set_lang_ru')
  async setLanguageRu(@Ctx() ctx: BotContext) {
    ctx.session.language = 'ru';
    await ctx.reply(
      'Язык установлен на Русский. Используйте /questions для получения списка вопросов.',
    );
    await ctx.answerCbQuery();
  }

  @Action('set_lang_kg')
  async setLanguageKg(@Ctx() ctx: BotContext) {
    ctx.session.language = 'kg';
    await ctx.reply(
      'Тил Кыргызча болуп орнотулду. Суроолор тизмеси үчүн /questions дегенди колдонуңуз.',
    );
    await ctx.answerCbQuery();
  }

  @Command('questions')
  async sendQuestions(@Ctx() ctx: BotContext) {
    const language = ctx.session.language || 'ru';

    const isTelegramSubscribed = await this.checkTelegramSubscription(
      ctx.from.id,
    );
    // const isInstagramSubscribed = await this.checkInstagramSubscription();

    if (!isTelegramSubscribed) {
      const message =
        language === 'ru'
          ? '❌ Вы не подписаны на все каналы. Подпишитесь на наши каналы для получения вопросов.'
          : '❌ Сиз бардык каналдарга катталган эмессиз. Суроолорду алуу үчүн катталыңыз.';
      const buttons = [];
      if (!isTelegramSubscribed) {
        buttons.push([
          {
            text:
              language === 'ru'
                ? '🔗 Подписаться на Telegram'
                : '🔗 Телеграмга катталуу',
            url: `https://t.me/${Config.TELEGRAM_CHANNEL_ID.replace('@', '')}`,
          },
        ]);
      }
      //   if (!isInstagramSubscribed) {
      //     buttons.push([
      //       {
      //         text:
      //           language === 'ru'
      //             ? '🔗 Подписаться на Instagram'
      //             : '🔗 Инстаграмга катталуу',
      //         url: 'https://www.instagram.com/mamytbekov_o/',
      //       },
      //     ]);
      //   }
      await ctx.reply(message, {
        reply_markup: { inline_keyboard: buttons },
      });
      return;
    }

    const questions = {
      ru: [
        [
          {
            text: '🖨️ Принтер не печатает',
            callback_data: 'question_printer_not_working',
          },
        ],
        [{ text: '📄 Пустые страницы', callback_data: 'question_blank_pages' }],
        [{ text: '📄 Бумага застряла', callback_data: 'question_paper_jam' }],
      ],
      kg: [
        [
          {
            text: '🖨️ Принтер иштебей жатат',
            callback_data: 'question_printer_not_working',
          },
        ],
        [
          {
            text: '📄 Таза барактар чыгат',
            callback_data: 'question_blank_pages',
          },
        ],
        [
          {
            text: '📄 Кагаз тыгылып калды',
            callback_data: 'question_paper_jam',
          },
        ],
      ],
    };

    const message =
      language === 'ru'
        ? '✅ Выберите интересующий вас вопрос:'
        : '✅ Сизди кызыктырган суроону тандаңыз:';

    await ctx.reply(message, {
      reply_markup: {
        inline_keyboard: questions[language],
      },
    });
  }

  @Action('question_printer_not_working')
  async questionPrinterNotWorking(@Ctx() ctx: BotContext) {
    const language = ctx.session.language || 'ru';
    const answer =
      language === 'ru'
        ? '🖨️ Если принтер не печатает, проверьте соединение, драйвера и наличие бумаги. Подробнее: [HP Support](https://support.hp.com)'
        : '🖨️ Эгерде принтер иштебей жатса, туташууну, драйверлерди жана кагазды текшериңиз. Толугураак: [HP Support](https://support.hp.com)';

    await ctx.replyWithMarkdown(answer);
    await ctx.answerCbQuery();
  }

  @Action('question_blank_pages')
  async questionBlankPages(@Ctx() ctx: BotContext) {
    const language = ctx.session.language || 'ru';
    const answer =
      language === 'ru'
        ? '📄 Если принтер печатает пустые страницы, проверьте уровень чернил или тонера. Подробнее: [Epson Support](https://www.epson.com/support)'
        : '📄 Эгерде принтер таза барактарды чыгарып жатса, сыяны же тонердин деңгээлин текшериңиз. Толугураак: [Epson Support](https://www.epson.com/support)';

    await ctx.replyWithMarkdown(answer);
    await ctx.answerCbQuery();
  }

  @Action('question_paper_jam')
  async questionPaperJam(@Ctx() ctx: BotContext) {
    const language = ctx.session.language || 'ru';
    const answer =
      language === 'ru'
        ? '📄 Если бумага застряла, выключите принтер и удалите бумагу вручную. Подробнее: [Canon Support](https://www.canon.com/support)'
        : '📄 Эгерде кагаз тыгылып калса, принтерди өчүрүп, кагазды кол менен алыңыз. Толугураак: [Canon Support](https://www.canon.com/support)';

    await ctx.replyWithMarkdown(answer);
    await ctx.answerCbQuery();
  }

  private async checkTelegramSubscription(userId: number): Promise<boolean> {
    try {
      const url = `https://api.telegram.org/bot${Config.TELEGRAM_TOKEN}/getChatMember`;
      const response = await axios.get(url, {
        params: {
          chat_id: Config.TELEGRAM_CHANNEL_ID,
          user_id: userId,
        },
      });

      const status = response.data.result.status;
      return ['member', 'administrator', 'creator'].includes(status);
    } catch (error) {
      console.error('Ошибка проверки Telegram подписки:', error.message);
      return false;
    }
  }

  private async checkInstagramSubscription(): Promise<boolean> {
    try {
      const url = `https://graph.facebook.com/v12.0/${Config.INSTAGRAM_ACCOUNT_ID}/followers`;
      const response = await axios.get(url, {
        params: { access_token: Config.INSTAGRAM_ACCESS_TOKEN },
      });

      const followers = response.data.data;
      console.log('Подписчики:', followers);
      return followers.length > 0;
    } catch (error) {
      console.error('Ошибка проверки Instagram подписки:', error.message);
      return false;
    }
  }
}
