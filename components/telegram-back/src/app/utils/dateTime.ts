import * as moment from 'moment-timezone'
import { get, last } from 'lodash'

moment.locale('uk')
moment.tz.setDefault('Europe/Kiev')

export const NO_LESSON_NUMBER = -1
export const LAST_LESSON_NUMBER = 7

export type Day = 'ПН' | 'ВТ' | 'СР' | 'ЧТ' | 'ПТ' | 'СБ' | 'НД'

export interface TimeMark {
  h: number
  m: number
}

const minutesPerHour = 60

// start - means start of a break of next lesson, workStart - the start of the lesson itself
const schedule = [
  { start: { h: 8, m: 0 }, workStart: { h: 8, m: 0 }, end: { h: 9, m: 20 }, number: 1 },
  { start: { h: 9, m: 20 }, workStart: { h: 9, m: 40 }, end: { h: 11, m: 0 }, number: 2 },
  { start: { h: 11, m: 0 }, workStart: { h: 11, m: 25 }, end: { h: 12, m: 45 }, number: 3 },
  { start: { h: 12, m: 45 }, workStart: { h: 13, m: 10 }, end: { h: 14, m: 30 }, number: 4 },
  { start: { h: 14, m: 30 }, workStart: { h: 14, m: 50 }, end: { h: 16, m: 10 }, number: 5 },
  { start: { h: 16, m: 10 }, workStart: { h: 16, m: 25 }, end: { h: 17, m: 45 }, number: 6 },
  { start: { h: 17, m: 45 }, workStart: { h: 18, m: 0 }, end: { h: 19, m: 20 }, number: 7 },
]

const getMinutesNumber = (hours: number, minutes: number): number => hours * minutesPerHour + minutes

export const getCurrentWeekNumber = (): number => {
  const formatted = moment().format('w')
  return Number(formatted)
}

export const getNextDayWeekNumberOf = (dateTime: moment.Moment): number => {
  const formatted = dateTime.clone().add(1, 'd').format('w')
  return Number(formatted)
}

export const getCurrentDay = (): Day => {
  const formatted = moment().format('ddd')
  return formatted.toUpperCase() as any
}

export const getNextDayOf = (dateTime: moment.Moment): Day => {
  const formatted = dateTime.clone().add(1, 'd').format('ddd')
  return formatted.toUpperCase() as any
}

export const getCurrentLessonNumber = (): number => {
  const formatted = moment().format('HH:mm')
  const [h, m] = formatted.split(':').map(Number)
  console.log({ h, m })
  const lessonData = schedule.find((e) => {
    return (getMinutesNumber(e.start.h, e.start.m) <= getMinutesNumber(h, m))
    && (getMinutesNumber(e.end.h, e.end.m) > getMinutesNumber(h, m))
  })
  return get(lessonData, 'number', NO_LESSON_NUMBER)
}

export const nowIsAfterLessonsToday = (): boolean => {
  const formatted = moment().format('HH:mm')
  const [h, m] = formatted.split(':').map(Number)
  const lastLesson = last(schedule)
  return getMinutesNumber(h, m) > getMinutesNumber(lastLesson.end.h, lastLesson.end.m)
}

export const getDiffBetweenLessonStartAndNow = (day: Day, lesson: number): TimeMark => {
  const lessonData = schedule.find(e => e.number === lesson)
  const lessonStartMoment = moment().day(day).set(lessonData.workStart)
  const differenceInMinutes = lessonStartMoment.diff(moment(), 'm')
  return { h: Math.floor(differenceInMinutes / minutesPerHour), m: differenceInMinutes % minutesPerHour }
}

export const getDiffBetweenNowAndLessonStartInMinutes = (lesson: number): number => {
  const lessonData = schedule.find(e => e.number === lesson)
  const lessonStartMoment = moment().set(lessonData.workStart)
  const differenceInMinutes = moment().diff(lessonStartMoment, 'm')
  return differenceInMinutes
}
