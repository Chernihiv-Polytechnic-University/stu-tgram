import * as TelegramBot from 'node-telegram-bot-api'
import { connect as connectToDb } from 'libs/domain-model'
import config from './config'
import initHandlers from './handlers'

const T_BOT_TOKEN: string = config('BOT_TOKEN')

const bot = new TelegramBot(T_BOT_TOKEN, { polling: true })

const start = async () => {
  await connectToDb({
    host: config('MONGO_HOST'),
    database: config('MONGO_DATABASE'),
    user: config('MONGO_USER'),
    password: config('MONGO_PASSWORD'),
  })

  await initHandlers(bot)
}

start()
