import * as telegram from 'node-telegram-bot-api'
import { Handler, Message } from '../types'

const handler: Handler = async (bot: telegram, msg: Message) => {
  const { user } = msg.locals

  if (user.telegram.privateChatId) {
    return
  }

  if (msg.tMessage.chat.type === 'private') {
    user.telegram = { ...user.telegram, privateChatId: msg.tMessage.chat.id }
    await user.save()
  }
}

export default handler
