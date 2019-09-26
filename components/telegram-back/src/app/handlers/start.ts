import * as telegram from 'node-telegram-bot-api'
import { buildText } from '../utils/text-builder'
import { buildKeyboardResponse, ButtonData } from '../utils/build-keyboard'
import { Handler, Message } from '../types'

const getKeyboardByTUserStatus = () => {
  const keyboardTextIds = ['whichLesson', 'whichSchedule', 'whichWeek', 'whichCallSchedule', 'leftFeedback', 'aboutSystem', 'claimAttestation']

  const buttonsData: ButtonData[] =  keyboardTextIds.map(textId => ({ textId }))
  return buildKeyboardResponse('panel', buttonsData)
}

export const handleStartEvent: Handler = async (bot: telegram, msg: Message) => {
  const { telegram: { username } } = msg.locals.user
  const text = buildText('hello', { username })
  const keyboard = getKeyboardByTUserStatus()
  await bot.sendMessage(msg.tMessage.chat.id, text, { reply_markup: keyboard } as any)
}

