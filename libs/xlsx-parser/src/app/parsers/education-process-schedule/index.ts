import * as Excel from 'exceljs/modern.nodejs'
import parseSchedule, { GroupSchedule } from './parse-schedule'

export interface EducationSchedule {
  firsOddWeekMondayDate: string,
  groupsSchedule: GroupSchedule[]
}

export const parse = async (fileBuffer): Promise<GroupSchedule[]> => {
  const excelWorkbook = new Excel.Workbook()
  await excelWorkbook.xlsx.load(fileBuffer)
  const worksheet = excelWorkbook.getWorksheet(1)

  const groupsSchedule = parseSchedule(worksheet)
  return groupsSchedule
}
