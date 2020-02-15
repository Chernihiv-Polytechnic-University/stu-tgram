import * as telegram from 'node-telegram-bot-api'
import { minBy, filter, flow } from 'lodash/fp'
import { get, isNil, find } from 'lodash'
import { Lesson, LessonModel, SystemSettingsModel } from 'libs/domain-model'
import { Handler, Message } from '../types'
import { buildText, getTimeUnitEnding } from '../utils/text-builder'
import {
  LAST_LESSON_NUMBER,
  Day,
  getNow,
  getCurrentWeekNumber,
  getLessonStartTimeAsStr,
  getLessonEndTimeAsStr,
  getNextDayWeekNumberOf,
  getNextDayOf,
  getCurrentDay,
  getCurrentLessonNumber,
  getDiffBetweenLessonStartAndNow,
  getDiffBetweenNowAndLessonStartInMinutes,
  nowIsAfterLessonsToday,
} from '../utils/dateTime'

const weekDays = ['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'НД']

const isLessonsEqualByDay = (first: Lesson, second: Lesson): boolean => {
  if (isNil(first) || isNil(second)) {
    return false
  }
  return first.day === second.day
}

export const handleGetLessonEvent: Handler = async (bot: telegram, msg: Message) => {
  const { telegram: { firstName, lastName }, groupId } = msg.locals.user
  const systemSettings = await SystemSettingsModel.findOne({})
  const now = getNow()
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
    let minutes = getDiffBetweenNowAndLessonStartInMinutes(currentLessonNumber)
    let textId = 'currentLessonIs'
    if (minutes < 0) {
      minutes = minutes * -1
      textId = 'currentLessonStarting'
    }
    const textOne = buildText(textId, {
      minutes,
      lessonNumber: currentLessonNumber,
      startTime: getLessonStartTimeAsStr(currentLessonNumber),
      endTime: getLessonEndTimeAsStr(currentLessonNumber),
      minutesEnd: getTimeUnitEnding(minutes),
      // number: currentLessonNumber,
      lessonName: get(currentLesson, 'name', '*'),
      auditory: get(currentLesson, 'auditory', '*'),
      teacherName: get(currentLesson, 'teacher.name', '*'),
    })
    await bot.sendMessage(msg.tMessage.chat.id, textOne)
  }

  // closest next lesson
  const nextLesson: Lesson = flow(
    filter((lesson: Lesson) => isNil(currentLesson) || lesson._id !== currentLesson._id), // filter current lesson if exists
    filter((lesson: Lesson) => !(nowIsAfterLessonsToday() && currentDay === lesson.day)), // filter today lessons if now is after lessons
    filter((lesson: Lesson) => !(lesson.day === currentDay && lesson.number <= currentLessonNumber)), // filter today lessons before current
    minBy((e: Lesson) => weekDays.indexOf(e.day) * LAST_LESSON_NUMBER + e.number),
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
    const text = buildText('nextLessonIs', {
      hours,
      minutes,
      lessonNumber: currentLessonNumber,
      startTime: getLessonStartTimeAsStr(currentLessonNumber),
      endTime: getLessonEndTimeAsStr(currentLessonNumber),
      minutesEnd: getTimeUnitEnding(m),
      hoursEnd: getTimeUnitEnding(h),
      // start,
      // number,
      lessonName: get(nextLesson, 'name', '*'),
      auditory: get(nextLesson, 'auditory', '*'),
      teacherName: get(nextLesson, 'teacher.name', '*'),
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
