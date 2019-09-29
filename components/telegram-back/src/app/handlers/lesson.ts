import * as telegram from 'node-telegram-bot-api'
import { minBy, filter, flow } from 'lodash/fp'
import { get, isNil, find } from 'lodash'
import * as moment from 'moment-timezone'
import { Lesson, LessonModel, SystemSettingsModel } from 'libs/domain-model'
import { Handler, Message } from '../types'
import { buildText } from '../utils/text-builder'

import {
  LAST_LESSON_NUMBER,
  Day,
  getCurrentWeekNumber,
  getNextDayWeekNumberOf,
  getNextDayOf,
  getCurrentDay,
  getCurrentLessonNumber,
  getDiffBetweenLessonStartAndNow,
  getDiffBetweenNowAndLessonStartInMinutes,
  nowIsAfterLessonsToday,
} from '../utils/dateTime'

const weekDays = ['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'НД']

export const handleGetLessonEvent: Handler = async (bot: telegram, msg: Message) => {
  const { telegram: { firstName, lastName }, groupId } = msg.locals.user
  const systemSettings = await SystemSettingsModel.findOne({})
  const now = moment()
  const currentWeek = getCurrentWeekNumber(systemSettings.firstOddWeekMondayDate)
  const currentDay = getCurrentDay()
  const nextDay = getNextDayOf(now)
  const nextDayWeek = getNextDayWeekNumberOf(now, systemSettings.firstOddWeekMondayDate)
  const currentLessonNumber = getCurrentLessonNumber()

  const where = { groupId, day: { $in: [currentDay, nextDay] }, week: { $in: [currentWeek % 2, nextDayWeek % 2] }, isExist: true }
  const lessons: Lesson[] = await LessonModel.find(where)
  const currentLesson: Lesson = find(lessons, { number: currentLessonNumber, day: currentDay } as Partial<Lesson>)

  // now
  if (!isNil(currentLesson)) {
    const afterStartInMinutes = getDiffBetweenNowAndLessonStartInMinutes(currentLessonNumber).toString()
    const textOne = buildText('currentLessonIs', {
      minutes: afterStartInMinutes,
      // number: currentLessonNumber,
      lessonName: get(currentLesson, 'name', '*'),
      auditory: get(currentLesson, 'auditory', '*'),
      teacherName: get(currentLesson, 'teacher.name', '*'),
    })
    await bot.sendMessage(msg.tMessage.chat.id, textOne)
  }

  // closest next lesson
  const nextLesson: Lesson = flow(
    filter((e: Lesson) => isNil(currentLesson) || (e.number !== currentLesson.number && e.day !== currentLesson.day)), // filter current lesson
    filter((e: Lesson) => !(nowIsAfterLessonsToday() && currentDay === e.day)), // filter today lessons if now is after lessons
    filter((e: Lesson) => !(e.day === currentDay && e.number <= currentLessonNumber)), // filter today lessons before current
    minBy((e: Lesson) => weekDays.indexOf(e.day) * LAST_LESSON_NUMBER + e.number),
  )(lessons)

  if (!isNil(nextLesson))  {
    const { h, m } = getDiffBetweenLessonStartAndNow(nextLesson.day as Day, nextLesson.number)
    const hours = String(h)
    const minutes = String(m)
    const text = buildText('nextLessonIs', {
      hours,
      minutes,
      // start,
      // number,
      lessonName: get(nextLesson, 'name', '*'),
      auditory: get(nextLesson, 'auditory', '*'),
      teacherName: get(nextLesson, 'teacher.name', '*'),
    })
    await bot.sendMessage(msg.tMessage.chat.id, text)
  }

  // current is last
  if (!isNil(currentLesson) && isNil(nextLesson)) {
    const text = buildText('currentLessonIsLast')
    await bot.sendMessage(msg.tMessage.chat.id, text)
  }
  // no lessons today
  if (isNil(currentLesson) && isNil(nextLesson)) {
    const text = buildText('noLessonsSoonHaveRest', { name: [firstName, lastName].join(' ') })
    await bot.sendMessage(msg.tMessage.chat.id, text)
  }
}
