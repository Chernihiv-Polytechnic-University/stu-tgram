import * as lessonsScheduleParser from './parsers/lesson-schedule'
import * as educationScheduleParser from './parsers/education-process-schedule'
import { GroupSchedule } from './parsers/education-process-schedule/parse-schedule'

export { Lesson, DEFAULT_LESSON_NAME, DEFAULT_TEACHER_NAME } from './parsers/lesson-schedule'
export { GroupSchedule } from './parsers/education-process-schedule/parse-schedule'

export const parseLessonsSchedule = (fileBuffer: Buffer): Promise<lessonsScheduleParser.Lesson[]> => {
  return lessonsScheduleParser.parse(fileBuffer)
}

export const parseEducationSchedule = (fileBuffer: Buffer): Promise<GroupSchedule[]> => {
  return educationScheduleParser.parse(fileBuffer)
}
