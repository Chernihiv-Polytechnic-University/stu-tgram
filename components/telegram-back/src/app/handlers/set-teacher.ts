import * as telegram from 'node-telegram-bot-api'
import { get, isNil } from 'lodash'
import { TelegramUserModel, TeacherModel, TelegramUserStatus, TelegramUserRole } from 'libs/domain-model'
import { buildText } from '../utils/text-builder'
import { Handler, Message } from '../types'

const SET_TEACHER_REGEXP = buildText('teacherRegexp')

export const handleSetTeacherEvent: Handler = async (bot: telegram, msg: Message) => {
  const { _id } = msg.locals.user
  const { text: msgText } = msg.tMessage
  const teacherText = get(msgText.match(SET_TEACHER_REGEXP), '[1]')
  if (isNil(teacherText)) {
    await bot.sendMessage(msg.tMessage.chat.id, buildText('failedSetAttempt'))
    return
  }
  const teacher = await TeacherModel.findOne({ name: new RegExp(teacherText, 'i') }, { name: 1 })
  if (isNil(teacher)) {
    await bot.sendMessage(msg.tMessage.chat.id, buildText('teacherNotFound', { name: teacherText }))
    return
  }
  await TelegramUserModel.updateOne(
    { _id },
    { $set: { name: teacher.name, status: TelegramUserStatus.partialKnown, role: TelegramUserRole.teacher, groupId: null } },
  )
  await bot.sendMessage(msg.tMessage.chat.id,  buildText('teacherSet', { name: teacher.name }))
}
