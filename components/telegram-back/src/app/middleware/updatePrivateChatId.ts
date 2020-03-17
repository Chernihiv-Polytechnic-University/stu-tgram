import * as telegram from 'node-telegram-bot-api'
import { Handler, Message } from '../types'
import { buildMainKeyboardResponse } from '../utils/build-keyboard'

const handler: Handler = async (bot: telegram, msg: Message) => {
  const { user } = msg.locals

  if (user.telegram.privateChatId) {
    return
  }

  if (msg.tMessage.chat.type === 'private') {
    user.telegram = { ...user.telegram, privateChatId: msg.tMessage.chat.id }
    const { keyboard } = user.telegram
    await bot.sendMessage(msg.tMessage.chat.id, '', { reply_markup: buildMainKeyboardResponse('panel', keyboard) } as any)
    await user.save()
  }
}

export default handler
