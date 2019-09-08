import * as telegram from 'node-telegram-bot-api'
import { buildText } from '../utils/text-builder'
import { Handler, Message } from '../types'

export const handleLessonEvent: Handler = async (bot: telegram, msg: Message) => {
  const { telegram: { firstName, lastName } } = msg.locals.user
  const text = buildText('noLessonsHaveRest', { name: [firstName, lastName].join(' ') })
  await bot.sendMessage(msg.tMessage.chat.id, text)
}
