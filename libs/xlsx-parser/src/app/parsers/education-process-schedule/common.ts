import { Worksheet, Row, Cell } from 'exceljs'

export const getRows = (worksheet: Worksheet): Row[] => {
  const rows = []

  worksheet.eachRow(row => rows.push(row))
  return rows
}

export const getCells = (row: Row): Cell[] => {
  const cells = []

  row.eachCell({ includeEmpty: true }, cell => cells.push(cell))
  return cells
}

export type Legend =
  'THEORY_LESSONS' |
  'EXAMINATION_PERIOD' |
  'PRACTICE' |
  'HOLIDAY' |
  'ATTESTATION' |
  'INTERNSHIP' |
  'CONSTITUENT_SESSION' |
  'PREPARATION_FOR_ATTESTATION' |
  'INSTALLATION_SESSION' |
  'TEST_WEEK'

export const legendDefinitions = {
  THEORY_LESSONS:  'Теоретичні заняття',
  EXAMINATION_PERIOD:  'Екзаменаційна сесія',
  PRACTICE:  'Практика',
  HOLIDAY:  'Канікули',
  ATTESTATION:  'Атестація',
  INTERNSHIP:  'Стажування',
  CONSTITUENT_SESSION:  'Установча сесія',
  PREPARATION_FOR_ATTESTATION:  'Підготовка до атестації',
  INSTALLATION_SESSION:  'Настановча сесія',
  TEST_WEEK:  'Заліковий тиждень',
  UNKNOWN: 'Невідомо',
}
