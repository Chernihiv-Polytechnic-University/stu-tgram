import * as lessonsScheduleParser from './parsers/lesson-schedule'
import * as educationScheduleParser from './parsers/education-process-schedule'

export { Lesson } from './parsers/lesson-schedule'
export { EducationSchedule } from './parsers/education-process-schedule'

export const parseLessonsSchedule = (fileBuffer: Buffer): Promise<lessonsScheduleParser.Lesson[]> => {
  return lessonsScheduleParser.parse(fileBuffer)
}

export const parseEducationSchedule = (fileBuffer: Buffer): Promise<educationScheduleParser.EducationSchedule> => {
  return educationScheduleParser.parse(fileBuffer)
}
