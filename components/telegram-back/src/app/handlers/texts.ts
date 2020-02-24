import * as telegram from 'node-telegram-bot-api'
import { buildText } from '../utils/text-builder'
import { Handler, Message } from '../types'

export const handleAboutSystemTextEvent: Handler = async (bot: telegram, msg: Message) => {
  const { id: chatId } = msg.tMessage.chat
  await bot.sendMessage(chatId, buildText('aboutSystemText'))
}

export const handleAttestationTextEvent: Handler = async (bot: telegram, msg: Message) => {
  const { id: chatId } = msg.tMessage.chat
  await bot.sendMessage(chatId, buildText('attestationText'))
}
