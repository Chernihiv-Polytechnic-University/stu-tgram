import * as telegram from 'node-telegram-bot-api'
import { Handler, Message } from '../types'

const handler: Handler = async (bot: telegram, msg: Message) => {
  const chatId = msg.tMessage.chat.id
  await bot.sendChatAction(chatId, 'typing')
}

export default handler
