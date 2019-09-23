import { TelegramUserStatus } from 'libs/domain-model'

import buildHandler from '../middleware/buildHandler'
import showTypingMiddleware from '../middleware/showTyping'
import findOrCreateUserMiddleware from '../middleware/findOrCreateUser'
import createCheckUserStatusMiddleware from '../middleware/checkUserStatus'

import { handleStartEvent } from './start'
import { handleGetLessonEvent } from './lesson'
import { handleSetGroupEvent } from './setGroup'
import { handleGetScheduleEvent } from './schedule'

import { buildText } from '../utils/text-builder'

const SET_GROUP_REGEXP = /Моя группа:(.+)/
const WHAT_IS_LESSON_REGEXP = new RegExp(buildText('whichLesson'))

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
  const lessonHandler = buildHandler(bot, ...baseMiddlewares, checkUserStatusMiddlewareForLesson, handleGetLessonEvent)
  const scheduleHandler = buildHandler(bot, ...baseMiddlewares, checkUserStatusMiddlewareForLesson, handleGetScheduleEvent)
  const setGroupHandler = buildHandler(bot, ...baseMiddlewares,  handleSetGroupEvent)

  bot.onText(/\/start/, await startHandler(['command', 'start']))

  bot.onText(/\/lesson/, await lessonHandler(['command', 'lesson']))
  bot.onText(/\/schedule/, await scheduleHandler(['command', 'schedule']))
  bot.onText(WHAT_IS_LESSON_REGEXP, await lessonHandler(['text', 'which_lesson']))
  bot.onText(SET_GROUP_REGEXP, await setGroupHandler(['text', 'set_group']))
}
