import * as path from 'path'
import * as fs from 'fs'
import * as pdf from 'dynamic-html-pdf'
import { range, get, find } from 'lodash'
import { LessonAttributes, LessonDay } from 'libs/domain-model'

const ODD_WEEK_NUM = 0
const EVEN_WEEK_NUM = 1

const options = { format: 'A2', type: 'pdf' }

const schedulePdfTemplate = fs.readFileSync(path.resolve(__dirname, 'schedule.html'), 'utf8')

const weekTemplate = [
  { name: 'ПН', isHeader: true, lessons: range(1, 8).map(e => ({ number: e, oddData: '', evenData: '' })) },
  { name: 'ВТ', isHeader: false, lessons: range(1, 8).map(e => ({ number: e, oddData: '', evenData: '' })) },
  { name: 'СР', isHeader: false, lessons: range(1, 8).map(e => ({ number: e, oddData: '', evenData: '' })) },
  { name: 'ЧТ', isHeader: false, lessons: range(1, 8).map(e => ({ number: e, oddData: '', evenData: '' })) },
  { name: 'ПТ', isHeader: false, lessons: range(1, 8).map(e => ({ number: e, oddData: '', evenData: '' })) },
  { name: 'СБ', isHeader: false, lessons: range(1, 8).map(e => ({ number: e, oddData: '', evenData: '' })) },
]

const createFindLessonBy = (lessons: LessonAttributes[]) => (condition: Partial<LessonAttributes>): LessonAttributes => {
  return find(lessons, condition) as LessonAttributes
}

const buildLessonData = (lesson: LessonAttributes) =>
  lesson ? `${get(lesson, 'name', '*')}, ${get(lesson, 'teacher.name', '*')}, ауд ${get(lesson, 'auditory', '*')}` : ''

const buildScheduleData = (lessons: LessonAttributes[]) => {
  const findLessonBy = createFindLessonBy(lessons)
  return weekTemplate.map(dayTemplate => ({
    ...dayTemplate,
    lessons: dayTemplate.lessons.map(lessonTemplate => ({
      ...lessonTemplate,
      oddData: buildLessonData(findLessonBy({ day: dayTemplate.name as LessonDay, number: lessonTemplate.number - 1, week: ODD_WEEK_NUM })),
      evenData: buildLessonData(findLessonBy({ day: dayTemplate.name as LessonDay, number: lessonTemplate.number - 1, week: EVEN_WEEK_NUM })),
    })),
  }))
}

export const creteSchedulePDF = async (lessons: LessonAttributes[], groupName: string, subgroupNumber: number): Promise<Buffer> => {
  const scheduleData = buildScheduleData(lessons)
  const document = {
    template: schedulePdfTemplate,
    type: 'buffer',
    context: {
      groupName,
      subgroupNumber,
      days: scheduleData,
    },
  }
  return pdf.create(document, options)
}
