import * as telegram from 'node-telegram-bot-api'
import { buildText } from '../utils/text-builder'
import { buildMainKeyboardResponse, ButtonData } from '../utils/build-keyboard'
import { Handler, Message } from '../types'

export const handleStartEvent: Handler = async (bot: telegram, msg: Message) => {
  const { telegram: { username, keyboard = [] } } = msg.locals.user

  const text = buildText('hello', { username })

  await bot.sendMessage(msg.tMessage.chat.id, text, { reply_markup:  buildMainKeyboardResponse('panel', keyboard) } as any)
}
