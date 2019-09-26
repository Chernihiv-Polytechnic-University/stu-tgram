import { TelegramUserStatus } from 'libs/domain-model'

import buildHandler from '../middleware/buildHandler'
import showTypingMiddleware from '../middleware/showTyping'
import findOrCreateUserMiddleware from '../middleware/findOrCreateUser'
import createCheckUserStatusMiddleware from '../middleware/checkUserStatus'

import { handleStartEvent } from './start'
import { handleGetLessonEvent } from './lesson'
import { handleSetGroupEvent } from './setGroup'
import { handleGetScheduleEvent, handleGetCallScheduleEvent } from './schedule'
import { handleGetWeekEvent } from './week'

import { buildText } from '../utils/text-builder'

const SET_GROUP_REGEXP = /Моя группа:(.+)/
const GET_NEXT_LESSON = new RegExp(buildText('whichLesson'))
const GET_SCHEDULE = new RegExp(buildText('whichSchedule'))
const GET_WEEK = new RegExp(buildText('whichWeek'))
const GET_CALL_SCHEDULE = new RegExp(buildText('whichCallSchedule'))
const LEFT_FEEDBACK = new RegExp(buildText('leftFeedback'))
const ABOUT_SYSTEM = new RegExp(buildText('aboutSystem'))
const CLAIM_ATTESTATION = new RegExp(buildText('claimAttestation'))

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
  const callScheduleHandler = buildHandler(bot, ...baseMiddlewares,  handleGetCallScheduleEvent)
  const weekHandler = buildHandler(bot, ...baseMiddlewares,  handleGetWeekEvent)

  bot.onText(/\/start/, await startHandler(['command', 'start']))

  bot.onText(/\/lesson/, await lessonHandler(['command', 'get_lesson']))
  bot.onText(/\/schedule/, await scheduleHandler(['command', 'get_schedule']))
  bot.onText(/\/callschedule/, await callScheduleHandler(['command', 'get_call_schedule']))
  bot.onText(/\/week/, await weekHandler(['command', 'get_week']))
  bot.onText(GET_SCHEDULE, await scheduleHandler(['text', 'get_schedule']))
  bot.onText(GET_NEXT_LESSON, await lessonHandler(['text', 'get_lesson']))
  bot.onText(SET_GROUP_REGEXP, await setGroupHandler(['text', 'set_group']))
  bot.onText(GET_CALL_SCHEDULE, await callScheduleHandler(['text', 'get_call_schedule']))
  bot.onText(GET_WEEK, await weekHandler(['text', 'get_week']))
}
