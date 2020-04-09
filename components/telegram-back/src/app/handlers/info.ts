import * as telegram from 'node-telegram-bot-api'
import { InfoModel, InfoCategoryAttributes, TelegramUserSessionAction } from 'libs/domain-model'
import { buildText } from '../utils/text-builder'
import { buildCustomKeyboardResponse } from '../utils/build-keyboard'
import  { Handler, Message } from '../types'

export const handleGetInfoEvent: Handler = async (bot: telegram, msg: Message) => {
  const { user } = msg.locals

  user.session = {
    action: TelegramUserSessionAction.infoCategories,
    step: 1,
  }
  await user.save()
  // @ts-ignore
  const categories: InfoCategoryAttributes[] = await InfoModel.findCategories()

  const keyboardData = [
    ...categories.map(e => e.category).sort(),
    buildText('back'),
  ]

  await bot.sendMessage(
    msg.tMessage.chat.id,
    buildText('infoCategories'),
    { reply_markup:  buildCustomKeyboardResponse('panel', keyboardData, 1) } as any,
  )
}

export const handleQuestionsCategoryEvent: Handler = async (bot: telegram, msg: Message) => {
  const { user } = msg.locals

  user.session = {
    action: TelegramUserSessionAction.infoCategoryQuestions,
    step: 2,
  }
  await user.save()

  const questions = await InfoModel.find({ category: msg.tMessage.text })

  const keyboardData = [
    ...questions.map(e => e.question).sort(),
    buildText('back'),
  ]

  const textId = questions.length ? 'infoCategoryQuestions' : 'resourceNotFoundCommon'

  await bot.sendMessage(
    msg.tMessage.chat.id,
    buildText(textId, { category: msg.tMessage.text }),
    { reply_markup:  buildCustomKeyboardResponse('panel', keyboardData, 1) } as any,
  )
}

export const handleQuestionEvent: Handler = async (bot: telegram, msg: Message) => {
  const question = await InfoModel.findOne({ question: msg.tMessage.text })

  const answer = question ? question.answer : buildText('resourceNotFoundCommon')

  await bot.sendMessage(
    msg.tMessage.chat.id,
    answer,
  )
}
