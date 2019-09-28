import * as telegram from 'node-telegram-bot-api'
import { buildText } from '../utils/text-builder'
import { Handler, Message } from '../types'

export const handleAboutSystemEvent: Handler = async (bot: telegram, msg: Message) => {
  const { id: chatId } = msg.tMessage.chat
  await bot.sendMessage(chatId, buildText('aboutSystemText'))
}

