import * as telegram from 'node-telegram-bot-api'
import { buildText } from '../utils/text-builder'
import { Handler, Message } from '../types'
import { buildMainKeyboardResponse } from '../utils/build-keyboard'

export const handleGoBackTextEvent: Handler = async (bot: telegram, msg: Message) => {
  const { telegram: { keyboard = [] } } = msg.locals.user

  await bot.sendMessage(msg.tMessage.chat.id, buildText('okay'), { reply_markup:  buildMainKeyboardResponse('panel', keyboard) } as any)
}

export const handleAboutSystemTextEvent: Handler = async (bot: telegram, msg: Message) => {
  const { id: chatId } = msg.tMessage.chat
  await bot.sendMessage(chatId, buildText('aboutSystemText'))
}

export const handleAttestationTextEvent: Handler = async (bot: telegram, msg: Message) => {
  const { id: chatId } = msg.tMessage.chat
  await bot.sendMessage(chatId, buildText('claimAttestationIsDeprecated'))
}
