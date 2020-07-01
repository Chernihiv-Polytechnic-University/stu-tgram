import * as educationScheduleParser from './parsers/education-process-schedule'
import { GroupSchedule } from './parsers/education-process-schedule/parse-schedule'

export { GroupSchedule } from './parsers/education-process-schedule/parse-schedule'

export const parseEducationSchedule = (fileBuffer: Buffer): Promise<GroupSchedule[]> => {
  return educationScheduleParser.parse(fileBuffer)
}
