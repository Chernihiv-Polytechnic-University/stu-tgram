import * as config from 'config'
import * as TelegramBot from 'node-telegram-bot-api'
import { connect as connectToDb } from 'libs/domain-model'
import initHandlers from './handlers'

// replace the value below with the Telegram token you receive from @BotFather
const T_BOT_TOKEN: string = config.get('T_BOT_TOKEN')

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(T_BOT_TOKEN, { polling: true })

const start = async () => {
  await connectToDb({
    host: config.get('MONGODB.HOST'),
    database: config.get('MONGODB.DATABASE'),
    user: config.get('MONGODB.USER'),
    password: config.get('MONGODB.PASSWORD'),
  })

  await initHandlers(bot)

  bot.on('message', () => {
    // TODO: CRITICAL handler for notFound
  })
}


start()
