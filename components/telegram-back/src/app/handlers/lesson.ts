// TODO refactor

import * as telegram from 'node-telegram-bot-api'
import { filter, flow, minBy } from 'lodash/fp'
import { find, get, isNil, isString } from 'lodash'
import { Lesson, LessonModel, SystemSettingsModel, TelegramUserRole } from 'libs/domain-model'
import { Handler, Message } from '../types'
import { buildText, getTimeUnitEnding } from '../utils/text-builder'
import {
  Day,
  getCurrentDay,
  getCurrentLessonNumber,
  getCurrentWeekNumber,
  getDiffBetweenLessonStartAndNow,
  getDiffBetweenNowAndLessonStartInMinutes,
  getLessonEndTimeAsStr,
  getLessonStartTimeAsStr,
  getNextDayOf,
  getNextDayWeekNumberOf,
  getNow,
  LAST_LESSON_NUMBER,
  nowIsAfterLessonsToday,
} from '../utils/date-time'

const weekDays = ['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'НД']

const isLessonsEqualByDay = (first: Lesson, second: Lesson): boolean => {
  if (isNil(first) || isNil(second)) {
    return false
  }
  return first.day === second.day
}

export const handleGetLessonEvent: Handler = async (bot: telegram, msg: Message) => {
  const { telegram: { firstName, lastName }, groupId, role, name } = msg.locals.user
  const systemSettings = await SystemSettingsModel.findOne({})
  const now = getNow()
  const currentWeek = getCurrentWeekNumber(systemSettings.firstOddWeekMondayDate)
  const currentDay = getCurrentDay()
  const nextDay = getNextDayOf(now)
  const nextDayWeek = getNextDayWeekNumberOf(now, systemSettings.firstOddWeekMondayDate)
  const currentLessonNumber = getCurrentLessonNumber()
  const forTeacher = role === TelegramUserRole.teacher

  const roleCriteria = forTeacher
    ? { 'teacher.only': true, 'teacher.name': name }
    : { groupId, 'teacher.only': { $ne: true } }
  const where = {
    day: { $in: [currentDay, nextDay] },
    week: { $in: [currentWeek % 2, nextDayWeek % 2] },
    isExist: true,
    ...roleCriteria,
  }
  const lessons: Lesson[] = await LessonModel.find(where)

  const currentLesson: Lesson = find(lessons, { number: currentLessonNumber, day: currentDay } as Partial<Lesson>)

  // now
  if (!isNil(currentLesson)) {
    let minutes = getDiffBetweenNowAndLessonStartInMinutes(currentLessonNumber)
    let textId =  forTeacher ? 'forTeacher_currentLessonIs' : 'currentLessonIs'
    if (minutes < 0) {
      minutes = minutes * -1
      textId = forTeacher ? 'forTeacher_currentLessonStarting' : 'currentLessonStarting'
    }

    if (!isString(currentLesson.auditory)) { textId += 'WithoutAuditory' }

    const textOne = buildText(textId, {
      minutes,
      lessonNumber: currentLessonNumber,
      startTime: getLessonStartTimeAsStr(currentLessonNumber),
      endTime: getLessonEndTimeAsStr(currentLessonNumber),
      minutesEnd: getTimeUnitEnding(minutes),
      lessonName: get(currentLesson, 'name', '*'),
      auditory: get(currentLesson, 'auditory', '*'),
      teacherName: get(currentLesson, 'teacher.name', '*'),
      groupName: get(currentLesson, 'group.name', '*'),
    })
    await bot.sendMessage(msg.tMessage.chat.id, textOne)
  }

  // closest next lesson
  const nextLesson: Lesson = flow(
    filter((lesson: Lesson) => isNil(currentLesson) || lesson._id !== currentLesson._id), // filter current lesson if exists
    filter((lesson: Lesson) => !(nowIsAfterLessonsToday() && currentDay === lesson.day)), // filter today lessons if now is after lessons
    filter((lesson: Lesson) => !(lesson.day === currentDay && lesson.number <= currentLessonNumber)), // filter today lessons before current
    filter((lesson: Lesson) => (currentDay === 'НД' ? lesson.week === nextDayWeek : true)), // filter current week for Sunday
    minBy((lesson: Lesson) => weekDays.indexOf(lesson.day) * LAST_LESSON_NUMBER + lesson.number),
  )(lessons)

  const showNextLesson = !isNil(nextLesson)
    && (
      isNil(currentLesson)
      || isLessonsEqualByDay(currentLesson, nextLesson)
    )

  if (showNextLesson)  {
    const { h, m } = getDiffBetweenLessonStartAndNow(nextLesson.day as Day, nextLesson.number)
    const hours = String(h)
    const minutes = String(m)
    let textId =  forTeacher ? 'forTeacher_nextLessonIs' : 'nextLessonIs'
    textId =  isString(nextLesson.auditory) ? textId : `${textId}WithoutAuditory`

    const text = buildText(textId, {
      hours,
      minutes,
      lessonNumber: nextLesson.number,
      startTime: getLessonStartTimeAsStr(nextLesson.number),
      endTime: getLessonEndTimeAsStr(nextLesson.number),
      minutesEnd: getTimeUnitEnding(m),
      hoursEnd: getTimeUnitEnding(h),
      lessonName: get(nextLesson, 'name', '*'),
      auditory: get(nextLesson, 'auditory', '*'),
      teacherName: get(nextLesson, 'teacher.name', '*'),
      groupName: get(nextLesson, 'group.name', '*'),
    })
    await bot.sendMessage(msg.tMessage.chat.id, text)
  }

  // current is last
  if (!isNil(currentLesson) && !showNextLesson) {
    const text = buildText('currentLessonIsLast')
    await bot.sendMessage(msg.tMessage.chat.id, text)
  }
  // no lessons today
  if (isNil(currentLesson) && isNil(nextLesson)) {
    const text = buildText('noLessonsSoonHaveRest', { name: [firstName, lastName].join(' ') })
    await bot.sendMessage(msg.tMessage.chat.id, text)
  }
}
