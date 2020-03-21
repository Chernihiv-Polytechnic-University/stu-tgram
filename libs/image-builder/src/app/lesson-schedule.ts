import * as path from 'path'
import * as fs from 'fs'
import { range, get, isString, find, filter, maxBy } from 'lodash'
import * as handlebars from 'handlebars'
import { LessonAttributes, LessonDay } from 'libs/domain-model'

const ODD_WEEK_NUM = 0
const EVEN_WEEK_NUM = 1

const scheduleTemplate = fs.readFileSync(path.resolve(__dirname, 'lesson-schedule.html'), 'utf8')

const getDayMaxLessonNumber = (dayName: LessonDay, lessons: LessonAttributes[]): number => {
  return get(maxBy(filter(lessons, { day: dayName }), 'number'), 'number', 1)
}

const buildWeekTemplate = (lessons: LessonAttributes[]) => [
  { name: 'ПН', isHeader: true, lessons: range(1, getDayMaxLessonNumber('ПН', lessons) + 1).map(e => ({ number: e, oddData: '', evenData: '' })) },
  { name: 'ВТ', isHeader: false, lessons: range(1, getDayMaxLessonNumber('ВТ', lessons) + 1).map(e => ({ number: e, oddData: '', evenData: '' })) },
  { name: 'СР', isHeader: false, lessons: range(1, getDayMaxLessonNumber('СР', lessons) + 1).map(e => ({ number: e, oddData: '', evenData: '' })) },
  { name: 'ЧТ', isHeader: false, lessons: range(1, getDayMaxLessonNumber('ЧТ', lessons) + 1).map(e => ({ number: e, oddData: '', evenData: '' })) },
  { name: 'ПТ', isHeader: false, lessons: range(1, getDayMaxLessonNumber('ПТ', lessons) + 1).map(e => ({ number: e, oddData: '', evenData: '' })) },
  { name: 'СБ', isHeader: false, lessons: range(1, getDayMaxLessonNumber('СБ', lessons) + 1).map(e => ({ number: e, oddData: '', evenData: '' })) },
  { name: 'НД', isHeader: false, lessons: range(1, getDayMaxLessonNumber('НД', lessons) + 1).map(e => ({ number: e, oddData: '', evenData: '' })) },
]

const createFindLessonBy = (lessons: LessonAttributes[]) => (condition: Partial<LessonAttributes>): LessonAttributes => {
  return find(lessons, condition) as LessonAttributes
}

const buildLessonData = (lesson: LessonAttributes) => {
  if (!lesson) { return '' }
  // tslint:disable-next-line:prefer-template
  return `${get(lesson, 'name', '*')}, ${get(lesson, 'teacher.name', '*')}`
    + (isString(lesson.auditory) ? `,ауд ${get(lesson, 'auditory', '*')}` : '')
}

const buildScheduleData = (lessons: LessonAttributes[]) => {
  const findLessonBy = createFindLessonBy(lessons)
  return buildWeekTemplate(lessons).map(dayTemplate => ({
    ...dayTemplate,
    lessons: dayTemplate.lessons.map(lessonTemplate => ({
      ...lessonTemplate,
      oddData: buildLessonData(findLessonBy({ day: dayTemplate.name as LessonDay, number: lessonTemplate.number, week: ODD_WEEK_NUM })),
      evenData: buildLessonData(findLessonBy({ day: dayTemplate.name as LessonDay, number: lessonTemplate.number, week: EVEN_WEEK_NUM })),
    })),
  }))
}

export const createLessonScheduleHTML = (
  lessons: LessonAttributes[],
  {
    groupName,
    subgroupNumber,
    teacherName,
  }:{
    groupName?: string,
    subgroupNumber?: number,
    teacherName?: string,
  },
): string => {
  const compileHTML = handlebars.compile(scheduleTemplate)
  const days = buildScheduleData(lessons)
  const name = teacherName ? teacherName : `${groupName}:${subgroupNumber}`
  return compileHTML({ days, name })
}
