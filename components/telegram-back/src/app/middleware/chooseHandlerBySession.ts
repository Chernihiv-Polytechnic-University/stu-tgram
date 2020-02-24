import * as telegram from 'node-telegram-bot-api'
import { isNil, get } from 'lodash'
import { Handler, Message } from '../types'
import { buildText } from '../utils/text-builder'

const createHandler = (handlerMapper: { [key: string]: Handler }): Handler => async (bot: telegram, msg: Message) => {
  const { user } = msg.locals
  const { id: chatId } = msg.tMessage.chat
  if (isNil(get(user, 'session.action'))) {
    await bot.sendMessage(chatId, buildText('unknownMessage'))
    return
  }
  return handlerMapper[user.session.action](bot, msg)
}

export default createHandler
