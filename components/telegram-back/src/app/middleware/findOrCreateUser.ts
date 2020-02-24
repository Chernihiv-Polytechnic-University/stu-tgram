import * as telegram from 'node-telegram-bot-api'
import { isString } from 'lodash'
import { Handler, HandlerResult, Message } from '../types'
import { TelegramUserAttributes, TelegramUserModel, TelegramUserStatus } from 'libs/domain-model'

const handler: Handler = async (bot: telegram, msg: Message) => {
  const chatId = msg.tMessage.chat.id
  if (!msg.tMessage.from) {
    await bot.sendMessage(chatId, 'TODO: process case when from = null')
    return HandlerResult.STOP
  }
  const { from } = msg.tMessage
  const tUserId = from.id
  let user = await TelegramUserModel.findOne({ 'telegram.id': tUserId })
  if (!user) {
    const username = isString(from.username) ? from.username : `${from.first_name} ${from.last_name}`.trim()
    const userData: TelegramUserAttributes = {
      status: TelegramUserStatus.unknown,
      telegram: {
        username,
        id: tUserId,
        firstName: from.first_name,
        lastName: from.last_name,
      },
    }
    user = await TelegramUserModel.create(userData)
  }
  msg.locals.user = user
}

export default handler
