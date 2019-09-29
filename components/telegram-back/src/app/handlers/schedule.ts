import * as telegram from 'node-telegram-bot-api'
import { StudentsGroupModel } from 'libs/domain-model'
import { buildText } from '../utils/text-builder'
import { Handler, Message } from '../types'
import { callSchedule, getTime } from '../utils/dateTime'

export const handleGetScheduleEvent: Handler = async (bot: telegram, msg: Message) => {
  const { groupId } = msg.locals.user
  const { id: chatId } = msg.tMessage.chat

  const group = await StudentsGroupModel.findOne({ _id: groupId }).exec()
  await bot.sendDocument(
    chatId,
    group.schedulePDF,
    {},
    { contentType: 'application/pdf', filename: buildText('scheduleFileName', { name: group.name, subgroupNumber: group.subgroupNumber }) },
  )
}

export const handleGetCallScheduleEvent: Handler = async (bot: telegram, msg: Message) => {
  const { id: chatId } = msg.tMessage.chat
  const text = callSchedule.reduce((acc, record) => {
    const recordText = buildText('callScheduleRecord', {
      number: record.number,
      start: getTime(record.workStart.h, record.workStart.m),
      end: getTime(record.end.h, record.end.m),
      break: record.breakBeforeInMinutes,
    })
    return `${acc}\n${recordText}`
  }, buildText('callScheduleHeader'))
  await bot.sendMessage(chatId, text)
}
