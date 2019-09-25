import * as telegram from 'node-telegram-bot-api'
import { TelegramUserStatus } from 'libs/domain-model'
import { buildText } from '../utils/text-builder'
import { buildKeyboardResponse, ButtonData } from '../utils/build-keyboard'
import { Handler, Message } from '../types'

const getKeyboardByTUserStatus = (status: TelegramUserStatus) => {
  const mapper = {
    [TelegramUserStatus.unknown]: ['whichLesson', 'schedule'], // , 'questionAnswer', 'letsGetAcquainted', 'whyIShouldGetAcquainted', 'aboutBot'],
    [TelegramUserStatus.partialKnown]: ['whichLesson', 'schedule'], // 'questionAnswer', 'letsGetAcquainted', 'whyIShouldGetAcquainted', 'aboutBot'],
    [TelegramUserStatus.fullKnown]: ['whichLesson', 'schedule'], // 'questionAnswer', 'requests', 'settings', 'feedback', 'aboutBot'],
  }

  const buttonsData: ButtonData[] =  mapper[status].map(textId => ({ textId }))
  return buildKeyboardResponse('panel', buttonsData)
}

export const handleStartEvent: Handler = async (bot: telegram, msg: Message) => {
  const { status, telegram: { username } } = msg.locals.user
  const text = buildText('hello', { username })
  const keyboard = getKeyboardByTUserStatus(status)
  await bot.sendMessage(msg.tMessage.chat.id, text, { reply_markup: keyboard } as any)
}
