import { LessonAttributes } from 'libs/domain-model'
import * as scheduleParser from './parsers/scheduleParser'

export const parseSchedule = (filePath: string): LessonAttributes[] => {
  return scheduleParser.parse(filePath)
}
