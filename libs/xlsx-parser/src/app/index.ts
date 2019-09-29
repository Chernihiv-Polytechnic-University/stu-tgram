import * as scheduleParser from './parsers/scheduleParser'

export { Lesson } from './parsers/scheduleParser'

export const parseSchedule = (fileBuffer: Buffer): Promise<scheduleParser.Lesson[]> => {
  return scheduleParser.parse(fileBuffer)
}
