import * as telegram from 'node-telegram-bot-api'
import { Handler, Message } from '../types'

const handler: Handler = async (bot: telegram, msg: Message) => {
  const { user } = msg.locals
  if (user.session) {
    user.session = null
    await user.save()
  }
}

export default handler
