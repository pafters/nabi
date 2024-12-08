'use strict';

import { Context, ServiceSchema } from "moleculer";
import 'dotenv/config';
import TelegramBot, { Message } from 'node-telegram-bot-api';

type TokenObject = {
    token: string;
};

type BaseError = {
    message: string,
    status: number
}

const TelegramService: ServiceSchema = {
    version: 1,
    name: 'telegram-service',
    settings: {
        botToken: process.env.TELEGRAM_BOT_TOKEN, //  Вставьте сюда токен вашего бота из BotFather
    },
    actions: {
        async sendMessage(ctx: Context) {
            this.logger.info('Telegram Service get new Message -> ', ctx);
            return { message: 'Сообщение пришло' };
        },
    },
    methods: {
        async botHandler() {

            this.telegramBot.on('message', async (msg: Message) => {
                const text = msg.text;
                const chat = msg.chat;


                const res: TokenObject | BaseError = await this.broker.call('v1.user-service.authorize', {
                    chatId: chat.id,
                    username: msg.chat.username,
                    nickname: [chat.first_name, chat.last_name].join(' '),
                });

                this.logger.info('GET RES', res);

                if ('token' in res) {
                    try {
                        const { token } = res as TokenObject;
                        const url = `https://vk.com/auth=${token}` // URL может быть динамическим
                        const keyboard = {
                            inline_keyboard: [[{ text: "В личный кабинет", url }]],
                        };

                        await this.telegramBot.sendMessage(chat.id, "Нажмите кнопку, чтобы перейти в личный кабинет " + token, {
                            reply_markup: JSON.stringify(keyboard),
                            parse_mode: "HTML", //Optional:  For using HTML in your message
                        });
                    } catch (error) {
                        this.logger.error("Error sending message with button:", error);
                        // Обработка ошибки, например, отправка сообщения об ошибке администратору
                    }
                } else {
                    const { message, status } = res as BaseError;
                    await this.telegramBot.sendMessage(chat.id, "Ошибка обработки запроса: " + message + '. Status: ', status);
                }
            });

        }
    },
    async created() {
        this.logger.info('v1.TELEGRAM-SERVICE has been created');
        const botToken = this.settings.botToken;
        if (!botToken) {
            this.logger.error("TELEGRAM_BOT_TOKEN not set in environment variables!");
            return;
        }

        const bot = new TelegramBot(botToken, { polling: true });
        this.telegramBot = bot;

        this.botHandler();


        this.logger.info('Telegram bot started');
    },
    async started() {
        this.logger.info('v1.TELEGRAM-SERVICE has been started');
    },
    async stopped() {
        this.logger.info('v1.TELEGRAM-SERVICE has been stopped');
    }
};
export default TelegramService;