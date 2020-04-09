import * as telegram from 'node-telegram-bot-api'
import { isString } from 'lodash'
import { TelegramUserAttributes, TelegramUserModel, TelegramUserStatus } from 'libs/domain-model'
import { Handler, HandlerResult, Message } from '../types'
import { buildText } from '../utils/text-builder'
import { MAIN_KEYBOARD_TEXT_IDS } from '../utils/build-keyboard'

const extractUsername = (user: telegram.User): string => {
  if (isString(user.username)) { return user.username }
  if (isString(user.first_name) && isString(user.last_name)) { return `${user.first_name} ${user.last_name}` }
  if (isString(user.first_name)) { return user.first_name }
  if (isString(user.last_name)) { return user.last_name }
  return buildText('anonymous')
}

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
    const userData: TelegramUserAttributes = {
      status: TelegramUserStatus.unknown,
      telegram: {
        id: tUserId,
        username: extractUsername(from),
        firstName: from.first_name,
        lastName: from.last_name,
        keyboard: MAIN_KEYBOARD_TEXT_IDS,
      },
    }
    user = await TelegramUserModel.create(userData)
  }
  msg.locals.user = user
}

export default handler
