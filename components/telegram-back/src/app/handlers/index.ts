import { TelegramUserStatus } from 'libs/domain-model'

import buildHandler from '../middleware/buildHandler'
import showTypingMiddleware from '../middleware/showTyping'
import findOrCreateUserMiddleware from '../middleware/findOrCreateUser'
import createCheckUserStatusMiddleware from '../middleware/checkUserStatus'

import { handleStartEvent } from './start'
import { handleLessonEvent } from './lesson'
import { buildText } from '../utils/text-builder'

const baseMiddlewares = [
  showTypingMiddleware,
  findOrCreateUserMiddleware,
]

const checkUserStatusMiddlewareForLesson = createCheckUserStatusMiddleware(
  [TelegramUserStatus.fullKnown, TelegramUserStatus.partialKnown],
  ['notEnoughInfoToGiveInfoAboutLesson', 'sayYourGroupExample', 'setGroupAndGoBack'],
)

export default async (bot) => {
  const startHandler = buildHandler(bot, ...baseMiddlewares, handleStartEvent)
  const lessonHandler = buildHandler(bot, ...baseMiddlewares, checkUserStatusMiddlewareForLesson, handleLessonEvent)

  bot.onText(/\/start/, await startHandler(['command', 'start']))
  bot.onText(/\/lesson/, await lessonHandler(['command', 'lesson']))
  bot.onText(new RegExp(buildText('whatIsLesson')), await lessonHandler(['text', 'whatIsLesson']))
}
