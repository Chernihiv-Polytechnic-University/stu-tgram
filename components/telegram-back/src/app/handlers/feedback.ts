import * as telegram from 'node-telegram-bot-api'
import { TelegramUserSessionAction, FeedbackModel, FeedbackAttributes } from 'libs/domain-model'
import { buildText } from '../utils/text-builder'
import { Handler, Message } from '../types'

export const handleFeedbackCreatingEvent: Handler = async (bot: telegram, msg: Message) => {
  const { user } = msg.locals
  const { id: chatId } = msg.tMessage.chat
  user.session = {
    action: TelegramUserSessionAction.feedback,
    step: 1,
  }
  await user.save()
  await bot.sendMessage(chatId, buildText('feedbackCreatingText'))
}

export const handleCreateFeedbackEvent: Handler = async (bot: telegram, msg: Message) => {
  const { id: chatId } = msg.tMessage.chat
  const { user } = msg.locals
  user.session = null
  const feedback: FeedbackAttributes = { text: msg.tMessage.text, telegramUserId: user._id }
  await user.save()
  await FeedbackModel.create(feedback)
  await bot.sendMessage(chatId, buildText('feedbackAcceptedText'))
}
