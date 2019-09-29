import * as telegram from 'node-telegram-bot-api'
import { SystemSettingsModel } from 'libs/domain-model'
import { buildText } from '../utils/text-builder'
import { Handler, Message } from '../types'
import { ODD_WEEK, getCurrentWeekNumber } from '../utils/dateTime'

export const handleGetWeekEvent: Handler = async (bot: telegram, msg: Message) => {
  const { id: chatId } = msg.tMessage.chat
  const systemSettings = await SystemSettingsModel.findOne({})
  const currentWeek = getCurrentWeekNumber(systemSettings.firstOddWeekMondayDate)

  if (currentWeek === ODD_WEEK) {
    await bot.sendMessage(chatId, buildText('oddWeek'))
  } else {
    await bot.sendMessage(chatId, buildText('evenWeek'))
  }
}
