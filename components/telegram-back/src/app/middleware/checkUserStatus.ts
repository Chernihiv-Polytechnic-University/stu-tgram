import * as telegram from 'node-telegram-bot-api'
import * as bluebird from 'bluebird'
import { buildText } from '../utils/text-builder'
import { Handler, HandlerResult, Message } from '../types'
import { TelegramUserStatus } from 'libs/domain-model'

const handler = (allowedStatuses: TelegramUserStatus[] = [], responseTextIdsIfNo: string[]): Handler => async (bot: telegram, msg: Message) => {
  const chatId = msg.tMessage.chat.id
  const { user } = msg.locals
  if (!allowedStatuses.includes(user.status)) {
    await bluebird.mapSeries(responseTextIdsIfNo, (textId) => {
      return bot.sendMessage(chatId, buildText(textId))
    })
    return HandlerResult.STOP
  }
}

export default handler
