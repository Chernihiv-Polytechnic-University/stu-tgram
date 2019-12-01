import * as moment from 'moment'
import * as Excel from 'exceljs/modern.nodejs'
import parseFirstOddWeekMonday from './parse-first-odd-week-monday'
import parseSchedule, { GroupSchedule } from './parse-schedule'

export interface EducationSchedule {
  firsOddWeekMondayDate: string,
  groupsSchedule: GroupSchedule[]
}

export const parse = async (fileBuffer): Promise<EducationSchedule> => {
  const excelWorkbook = new Excel.Workbook()
  await excelWorkbook.xlsx.load(fileBuffer)
  const worksheet = excelWorkbook.getWorksheet(1)

  const firsOddWeekMondayDay = parseFirstOddWeekMonday(worksheet)
  const firsOddWeekMondayDate = moment()
    .startOf('year')
    .set({ month: 9, day: firsOddWeekMondayDay.dayNumber })
    .format('YYYY-MM-DD')
  const groupsSchedule = parseSchedule(worksheet)
  return { firsOddWeekMondayDate, groupsSchedule }
}
