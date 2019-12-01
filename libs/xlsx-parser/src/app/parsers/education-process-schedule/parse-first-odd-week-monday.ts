import { intersection, range, get, first } from 'lodash'
import { Worksheet, Row, Cell } from 'exceljs'
import { getRows } from './common'

export interface FirstOddWeekMondayData {
  cellAddress: string
  dayNumber: number
}

const checkCellIsFilled = (cell) => {
  const fillPattern = get(cell, 'style.fill.pattern')
  return fillPattern && fillPattern !== 'none'
}

// See doc, for now it is Row number 9
const findWeekNumberRow = (rows: Row[]): Row => {
  const PATTERN = ['ШИФР ГРУПИ', ...range(1, 50)]
  return rows.find((row) => {
    const array = intersection(row.values as [], PATTERN)
    return array.length === PATTERN.length
  })
}

const findWeekNumberCells = (weekNumberRow: Row): Cell[] => {
  const cells = []
  weekNumberRow.eachCell((cell) => {
    if (typeof cell.value === 'number') {
      cells.push(cell)
    }
  })
  return cells
}
// See doc, for now it is Cell F9
const findFirstOddWeekCell = (weekNumberCells: Cell[]): Cell => {
  // all odd weeks are marked, even weeks are not
  const oddWeekCells = weekNumberCells
    .filter(checkCellIsFilled)
    .sort((a, b) => Number(a.value) - Number(b.value))

  return first(oddWeekCells)
}
// See doc, for now it is FirstOddWeekCell - 2r => F9 - 2r = F7
const findFirstDayOfWeek = (weekCell: Cell, worksheet: Worksheet): number => {
  const [rowNumber] = weekCell.address.match(/\d+/)
  const startWeekDayRowNumber = Number(rowNumber) - 2
  const startWeekDayCellAddress = first<string>(weekCell.address.match(/[^\d+]/)) + startWeekDayRowNumber
  return Number(worksheet.getCell(startWeekDayCellAddress).value)
}

export default (worksheet: Worksheet): FirstOddWeekMondayData => {
  const rows = getRows(worksheet)

  const weekNumberRow = findWeekNumberRow(rows)
  const weekNumberCells = findWeekNumberCells(weekNumberRow)
  const firstOddWeekCell = findFirstOddWeekCell(weekNumberCells)
  const dayNumber = findFirstDayOfWeek(firstOddWeekCell, worksheet)
  return {
    dayNumber,
    cellAddress: firstOddWeekCell.address
  }
}
