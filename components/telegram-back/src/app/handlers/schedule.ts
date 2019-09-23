import * as telegram from 'node-telegram-bot-api'
import { pick } from 'lodash'
import { StudentsGroupModel } from 'libs/domain-model'
import { buildText } from '../utils/text-builder'
import { Handler, Message } from '../types'

export const handleGetScheduleEvent: Handler = async (bot: telegram, msg: Message) => {
  const { groupId } = msg.locals.user
  const { id: chatId } = msg.tMessage.chat

  const group = await StudentsGroupModel.findOne({ _id: groupId }).exec()
  await bot.sendDocument(
    chatId, group.schedulePDF,
    {},
    { contentType: 'application/pdf', filename: buildText('scheduleFileName', { name: group.name, subgroupNumber: group.subgroupNumber }) },
  )
}
