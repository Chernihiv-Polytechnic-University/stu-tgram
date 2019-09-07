import * as config from 'config'
import * as TelegramBot from 'node-telegram-bot-api'
import { connect as connectToDb } from 'libs/domain-model'

import buildHandler from './middleware/buildHandler'
import showTypingMiddleware from './middleware/showTyping'
import telegramUserMiddleware from './middleware/telegramUser'

import * as startController from './controllers/start'

// replace the value below with the Telegram token you receive from @BotFather
const T_BOT_TOKEN: string = config.get('T_BOT_TOKEN')

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(T_BOT_TOKEN, { polling: true })

const baseMiddlewares = [
  showTypingMiddleware,
  telegramUserMiddleware,
]

const start = async () => {
  await connectToDb({
    host: config.get('MONGODB.HOST'),
    database: config.get('MONGODB.HOST'),
    user: config.get('MONGODB.USER'),
    password: config.get('MONGODB.PASSWORD'),
  })

  // Matches "/echo [whatever]"
  bot.onText(/\/start/, buildHandler(bot, ...baseMiddlewares, startController.handleStartEvent))

  bot.on('message', () => {
    // TODO: CRITICAL handler for notFound
  })
}


start()
