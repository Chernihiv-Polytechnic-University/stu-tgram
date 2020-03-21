import { isNil, isObject, flatMap, intersection, get, isEqual, findLast } from 'lodash'
import * as Excel from 'exceljs'
import parseGroups from './parse-groups'
import parseLegend from './parse-legend'
import parseFirstWeekMonday from './parse-first-odd-week-monday'
import { Legend, getRows, getCells, legendDefinitions } from './common'

const MONTHS = [
  'Вересень',
  'Жовтень',
  'Листопад',
  'Грудень',
  'Січень',
  'Лютий',
  'Березень',
  'Квітень',
  'Травень',
  'Червень',
  'Липень',
  'Серпень',
]

// Main domain is week, check the doc
export interface Week {
  start: number
  end: number
  number: number
  column: number
  month: string
  isOdd: boolean
}

export interface GroupSchedule extends Week {
  group: string
  row: string
  definition: Legend
  realDefinition: string
}

export interface LegendData {
  cell: Excel.Cell,
  definition: Legend | string
  isTheory: boolean
}

const checkCellIsFilled = (cell: Excel.Cell) => {
  const fillPattern = get(cell, 'style.fill.pattern')
  return fillPattern && fillPattern !== 'none'
}

const compareCellByStyleFill = (one: Excel.Cell, two: Excel.Cell) => {
  const noColorOne = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { theme: 0 },
    bgColor: { theme: 0 },
  }
  const noColorTwo = { type: 'pattern', pattern: 'none' }
  if (
    (isEqual(get(one, 'style.fill'), noColorOne) || isEqual(get(one, 'style.fill'), noColorTwo))
    && (isEqual(get(two, 'style.fill'), noColorOne) || isEqual(get(two, 'style.fill'), noColorTwo))
  ) {
    return true
  }
  return isEqual(get(one, 'style.fill'), get(two, 'style.fill'))
}

const findMonthsRow = (worksheet: Excel.Worksheet) => {
  const rows = getRows(worksheet)
  return rows.find((r) => {
    // @ts-ignore
    const normalizedValues = r.values.map((v: any) => String(v).trim())
    return intersection(normalizedValues, MONTHS).length === MONTHS.length
  })
}

const findMonthsWithColumns = (row: Excel.Row): { month: string, columns: string[] }[] => {
  const cells = getCells(row)
  return MONTHS.map(month => ({ month, columns: cells.filter(c => month === String(c.value).trim()).map(c => c.col) }))
}

const getMonth = (monthsWithColumns, column: Excel.Column): string => {
  return monthsWithColumns.find(({ columns }) => columns.includes(column)).month
}

const getCellValueAsNumber = (cell: Excel.Cell): number => {
  if (isNil(cell)) { return 0 }
  if (isObject(cell.value)) { return Number(get(cell, 'value.result')) }
  return Number(cell.value)
}

const weekDataByColumn = (startWeekRow: Excel.Row, endWeekRow: Excel.Row, weekNumberRow: Excel.Row, monthsWithColumns) => (column): Week => {
  return {
    column,
    start: getCellValueAsNumber(startWeekRow.findCell(column)),
    end: getCellValueAsNumber(endWeekRow.findCell(column)),
    number: getCellValueAsNumber(weekNumberRow.findCell(column)),
    month: getMonth(monthsWithColumns, column),
    isOdd: checkCellIsFilled(weekNumberRow.findCell(column)),
  }
}

const findWeeks = (worksheet, monthRowNumber, monthsWithColumns): Week[] => {
  const startWeekRow = worksheet.findRow(monthRowNumber + 2)
  const endWeekRow = worksheet.findRow(monthRowNumber + 3)
  const weekNumberRow = worksheet.findRow(monthRowNumber + 4)
  const columns = flatMap(monthsWithColumns, ({ columns }) => columns)
  return columns.map(weekDataByColumn(startWeekRow, endWeekRow, weekNumberRow, monthsWithColumns))
}

const getCellLegendDefinition = (cell: Excel.Cell, legend) => {
  const cellLegend = legend.find(({ cell: legendCell, isTheory }) => compareCellsByLegend(cell, legendCell, { onlyByStyleFill: isTheory }))
  return (cellLegend && cellLegend.definition) || get(cell, 'value', 'UNKNOWN')
}

const compareCellsByLegend = (one, two, { onlyByStyleFill = false }) => {
  if (onlyByStyleFill) {
    return compareCellByStyleFill(one, two)
  }
  if (String(one.value).trim() !== String(two.value).trim()) {
    return false
  }
  if ((Object.values(get(one, 'style.border', {})).length > 0) !== (Object.values(get(two, 'style.border', {})).length > 0)) {
    return false
  }
  return compareCellByStyleFill(one, two)
}

const getLegendCells = (worksheet: Excel.Worksheet, legend: { cell: string, definition: Legend, isTheory: boolean }[]): LegendData[] => {
  return legend.map(({ cell: cellAddress, definition, isTheory }) => {
    // @ts-ignore
    const cell = worksheet.findCell(cellAddress)
    return { cell, definition, isTheory }
  })
}

const findGroupSchedule = (worksheet, weeks, legendCells) => (groupData): GroupSchedule[] => {
  const groupRow = worksheet.findRow(groupData.rowNumber)
  const fullGroupSchedule = weeks.map((week) => {
    const definition =  getCellLegendDefinition(groupRow.findCell(week.column), legendCells)
    return {
      definition,
      row: groupData.rowNumber,
      group: groupData.group.toUpperCase(),
      realDefinition: get(legendDefinitions, definition, definition),
      ...week,
    }
  })
  const lastAttestationWeek = findLast(fullGroupSchedule, ({ definition }) => definition === 'ATTESTATION')
  return fullGroupSchedule.filter(groupSchedule => lastAttestationWeek ? (groupSchedule.number <= lastAttestationWeek.number) : true)
}

export default (worksheet: Excel.Worksheet): GroupSchedule[] => {
  const { cellAddress } = parseFirstWeekMonday(worksheet)

  const groups = parseGroups(worksheet)
  const legend = parseLegend(worksheet).map(e => ({
    ...e,
    isTheory: e.definition === 'THEORY_LESSONS',
  }))
  legend.push({ cell: cellAddress, definition: 'THEORY_LESSONS', isTheory: true })

  const monthRow = findMonthsRow(worksheet)
  const monthsWithColumns = findMonthsWithColumns(monthRow)
  const weeks = findWeeks(worksheet, monthRow.number, monthsWithColumns)
  const legendCells = getLegendCells(worksheet, legend)

  return flatMap(groups, findGroupSchedule(worksheet, weeks, legendCells))
}
