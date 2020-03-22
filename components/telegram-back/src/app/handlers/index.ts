import * as telegram from 'node-telegram-bot-api'
import { TelegramUserStatus, TelegramUserSessionAction } from 'libs/domain-model'

import buildHandler from '../middleware/buildHandler'
import showTypingMiddleware from '../middleware/showTyping'
import findOrCreateUserMiddleware from '../middleware/findOrCreateUser'
import createCheckUserStatusMiddleware from '../middleware/checkUserStatus'
import clearSessionMiddleware from '../middleware/clearSession'
import createChooseHandlerBySession from '../middleware/chooseHandlerBySession'
import updatePrivateChatIdMiddleware from '../middleware/updatePrivateChatId'

import { handleStartEvent } from './start'
import { handleGetLessonEvent } from './lesson'
import { handleSetGroupEvent } from './set-group'
import { handleSetTeacherEvent } from './set-teacher'
import { createGetScheduleEventHandler, handleGetCallScheduleEvent } from './schedule'
import { handleGetWeekEvent } from './week'
import { handleAboutSystemTextEvent, handleAttestationTextEvent, handleGoBackTextEvent } from './texts'
import { handleCreateFeedbackEvent, handleFeedbackCreatingEvent } from './feedback'
import { handleGetSettingsEvent, handleSetupUpdateKeyboard } from './settings'

import { buildText } from '../utils/text-builder'
import { escape } from '../utils/escape-regexp'
import { Handler } from '../types'

const SET_GROUP_REGEXP = new RegExp(buildText('myGroupRegexp'))
const ADD_KEY_REGEXP = new RegExp(buildText('addKeyMatchRegexp'))
const REMOVE_KEY_REGEXP = new RegExp(buildText('removeKeyMatchRegexp'))
const SET_TEACHER_REGEXP = new RegExp(buildText('teacherRegexp'))
const GET_NEXT_LESSON = new RegExp(`^${escape(buildText('whichLesson'))}$`)
const GET_LESSON_SCHEDULE = new RegExp(`^${escape(buildText('whichSchedule'))}$`)
const GET_EDUCATION_SCHEDULE = new RegExp(`^${escape(buildText('whichEducationSchedule'))}$`)
const GET_WEEK = new RegExp(`^${escape(buildText('whichWeek'))}$`)
const GET_CALL_SCHEDULE = new RegExp(`^${escape(buildText('whichCallSchedule'))}$`)
const LEFT_FEEDBACK = new RegExp(`^${escape(buildText('leftFeedback'))}$`)
const ABOUT_SYSTEM = new RegExp(`^${escape(buildText('aboutSystem'))}$`)
const CLAIM_ATTESTATION = new RegExp(`^${escape(buildText('claimAttestation'))}$`)
const GET_SETTINGS = new RegExp(`^${escape(buildText('settings'))}$`)
const SET_KEYBOARD = new RegExp(`^${escape(buildText('setKeyboard'))}$`)
const GO_BACK = new RegExp(`^${escape(buildText('back'))}$`)

// we should skip all handled events while processing session
const HANDLED_EVENTS_REGEXP: RegExp[] = [
  ADD_KEY_REGEXP,
  REMOVE_KEY_REGEXP,
  SET_GROUP_REGEXP,
  SET_TEACHER_REGEXP,
  GET_NEXT_LESSON,
  GET_EDUCATION_SCHEDULE,
  GET_LESSON_SCHEDULE,
  GET_WEEK,
  GET_CALL_SCHEDULE,
  LEFT_FEEDBACK,
  ABOUT_SYSTEM,
  CLAIM_ATTESTATION,
  GET_SETTINGS,
  SET_KEYBOARD,
  GO_BACK,
  /\/start/,
  /\/lesson/,
  /\/schedule/,
  /\/callschedule/,
  /\/week/,
]

const isHandledEvent = (text: string): boolean => HANDLED_EVENTS_REGEXP.reduce((res, regexp) => {
  return res || regexp.test(text)
}, false)

const pickMiddlewares = ({ withCheckUserStatus = false, withoutClearSession = false, withSessionHandler = false } = {}) => {
  const middlewares: Handler[] = [
    showTypingMiddleware,
    findOrCreateUserMiddleware,
    updatePrivateChatIdMiddleware,
  ]
  if (withCheckUserStatus) {
    middlewares.push(
      createCheckUserStatusMiddleware(
        [TelegramUserStatus.fullKnown, TelegramUserStatus.partialKnown],
        ['notEnoughInfoToGiveInfoAboutLesson', 'sayYourGroupExample', 'setGroupAndGoBack'],
      ),
    )
  }
  if (!withoutClearSession) {
    middlewares.push(clearSessionMiddleware)
  }
  if (withSessionHandler) {
    middlewares.push(
      createChooseHandlerBySession({
        [TelegramUserSessionAction.feedback]: handleCreateFeedbackEvent,
      }),
    )
  }
  return middlewares
}

export default async (bot: telegram) => {
  const startHandler = buildHandler(bot, ...pickMiddlewares(), handleStartEvent)
  const updateKeyboardHandler = buildHandler(bot, ...pickMiddlewares(),  handleSetupUpdateKeyboard(true))
  const lessonHandler = buildHandler(bot, ...pickMiddlewares({ withCheckUserStatus: true }), handleGetLessonEvent)
  const lessonsScheduleHandler = buildHandler(bot, ...pickMiddlewares({ withCheckUserStatus: true }), createGetScheduleEventHandler('lessons'))
  const educationScheduleHandler = buildHandler(bot, ...pickMiddlewares({ withCheckUserStatus: true }), createGetScheduleEventHandler('education'))
  const setGroupHandler = buildHandler(bot, ...pickMiddlewares(),  handleSetGroupEvent)
  const setTeacherHandler = buildHandler(bot, ...pickMiddlewares(),  handleSetTeacherEvent)
  const callScheduleHandler = buildHandler(bot, ...pickMiddlewares(),  handleGetCallScheduleEvent)
  const weekHandler = buildHandler(bot, ...pickMiddlewares(),  handleGetWeekEvent)
  const aboutSystemTextHandler = buildHandler(bot, ...pickMiddlewares(),  handleAboutSystemTextEvent)
  const attestationTextHandler = buildHandler(bot, ...pickMiddlewares(),  handleAttestationTextEvent)
  const feedbackCreatingHandler = buildHandler(bot, ...pickMiddlewares(),  handleFeedbackCreatingEvent)
  const getSettingsHandler = buildHandler(bot, ...pickMiddlewares(),  handleGetSettingsEvent)
  const setupKeyboardHandler = buildHandler(bot, ...pickMiddlewares(),  handleSetupUpdateKeyboard(false))
  const goBackHandler = buildHandler(bot, ...pickMiddlewares(),  handleGoBackTextEvent)
  const sessionHandler = await buildHandler(bot, ...pickMiddlewares({ withoutClearSession: true, withSessionHandler: true }))(['text', 'session'])

  // TODO set all regexp as constants
  bot.onText(/\/start/, await startHandler(['command', 'start']))

  bot.onText(/\/lesson/, await lessonHandler(['command', 'get_lesson']))
  bot.onText(/\/schedule/, await lessonsScheduleHandler(['command', 'get_schedule']))
  bot.onText(/\/callschedule/, await callScheduleHandler(['command', 'get_call_schedule']))
  bot.onText(/\/week/, await weekHandler(['command', 'get_week']))
  bot.onText(GET_LESSON_SCHEDULE, await lessonsScheduleHandler(['text', 'get_schedule']))
  bot.onText(GET_EDUCATION_SCHEDULE, await educationScheduleHandler(['text', 'get_education_schedule']))
  bot.onText(GET_NEXT_LESSON, await lessonHandler(['text', 'get_lesson']))
  bot.onText(SET_GROUP_REGEXP, await setGroupHandler(['text', 'set_group']))
  bot.onText(SET_TEACHER_REGEXP, await setTeacherHandler(['text', 'set_teacher']))
  bot.onText(GET_CALL_SCHEDULE, await callScheduleHandler(['text', 'get_call_schedule']))
  bot.onText(GET_WEEK, await weekHandler(['text', 'get_week']))
  bot.onText(ABOUT_SYSTEM, await aboutSystemTextHandler(['text', 'about_system']))
  bot.onText(CLAIM_ATTESTATION, await attestationTextHandler(['text', 'attestations']))
  bot.onText(LEFT_FEEDBACK, await feedbackCreatingHandler(['text', 'feedback_creating']))
  bot.onText(GET_SETTINGS, await getSettingsHandler(['text', 'get_settings']))
  bot.onText(SET_KEYBOARD, await setupKeyboardHandler(['text', 'set_keyboard']))
  bot.onText(ADD_KEY_REGEXP, await updateKeyboardHandler(['text', 'update_keyboard']))
  bot.onText(REMOVE_KEY_REGEXP, await updateKeyboardHandler(['text', 'update_keyboard']))
  bot.onText(GO_BACK, await goBackHandler(['text', 'go_back']))

  bot.on('text', async (msg) => {
    if (isHandledEvent(msg.text)) {
      return
    }
    await sessionHandler(msg)
  })
}
