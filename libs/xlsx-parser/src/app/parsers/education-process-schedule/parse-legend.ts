/*
 Check the doc, you can find every legend item have a pattern
 X Legend symbol cell,can be only '-' or '- legend value',[legend value or nothing if legend value defined in the previous cell]
*/

import { Worksheet, Row, Cell } from 'exceljs'
import { uniqBy, findLast, flatMap } from 'lodash'
import { getRows, getCells, Legend } from './common'

export interface LegendData {
  cell: string
  definition: Legend
}

/*
Legends are placed after all schedule
*/
const LAST_SCHEDULE_ROW_CELL_HEADER = /[ ]*денна[ ]*/i

const PATTERNS: { [key in Legend]: RegExp } = {
  THEORY_LESSONS: /[ ]*Теоретичні[ ]*заняття[ ]*/gi,
  EXAMINATION_PERIOD: /[ ]*Екзаменаційна[ ]*сесія[ ]*/gi,
  PRACTICE: /[ ]*Практика[ ]*/gi,
  HOLIDAY: /[ ]*Канікули[ ]*/gi,
  ATTESTATION: /[ ]*Атестація[ ]*/gi,
  INTERNSHIP: /[ ]*Стажування[ ]*/gi,
  CONSTITUENT_SESSION: /[ ]*Установча[ ]*сесія[ ]*/gi,
  PREPARATION_FOR_ATTESTATION: /[ ]*Підготовка[ ]*до[ ]*атестації[ ]*/gi,
  INSTALLATION_SESSION: /[ ]*Настановча[ ]*сесія[ ]*/gi,
  TEST_WEEK: /[ ]*Заліковий[ ]*тиждень[ ]*/gi,
}

const checkValuesIsLegendDefinition = array => !!Object.values(PATTERNS)
  .find(pattern => array.find(e => pattern.test(e)))

const findLegendRows = (worksheet: Worksheet): Row[] => {
  const rows = getRows(worksheet)
  // @ts-ignore
  const lastScheduleRowNumber: Row = findLast(rows, row => row.values.find<string>(e => LAST_SCHEDULE_ROW_CELL_HEADER.test(String(e))))
  return rows
    .filter(r => r.number > lastScheduleRowNumber.number)
    .filter(r => checkValuesIsLegendDefinition(r.values))
}

/*
Legend cells always have style.fill or style.border
After legend cells always exist cells with legend definition, maybe through the cell with '-'
 */
const getLegendCells = (row: Row): { cell: Cell, definition: Legend }[] => {
  const cells = getCells(row)
  const legendDefinitionCells = cells.filter(c => checkValuesIsLegendDefinition([c.value]))
  const clearedLegendDefinitionCells = uniqBy(legendDefinitionCells.map(c => c.master), e => e.address)
  return clearedLegendDefinitionCells.map(cell => findLegendCell(cell, cells))
}

const findDefinitionByCell = (definitionCell: Cell): Legend => {
  return Object.entries(PATTERNS).reduce<Legend>((result, [definitionName, pattern]) => {
    if (result) {
      return String(result) as Legend
    }
    if (pattern.test(String(definitionCell.value))) {
      return definitionName as Legend
    }
  }, null)
}

const findLegendCell = (legendDefinitionCell: Cell, rowCells: Cell[]): { cell: Cell, definition: Legend } => {
  const maybeLegendRows = [Number(legendDefinitionCell.col) - 1, Number(legendDefinitionCell.col) - 2]
  const [prevTwo, prevOne] = rowCells.filter(c => maybeLegendRows.includes(Number(c.col)))
  if (/-/.test(String(legendDefinitionCell.value))) {
    return { cell: prevOne, definition: findDefinitionByCell(legendDefinitionCell) }
  }
  if (/-/.test(String(prevOne.value))) {
    return { cell: prevTwo, definition: findDefinitionByCell(legendDefinitionCell) }
  }
}

export default (worksheet: Worksheet): LegendData[] => {
  const legendRows = findLegendRows(worksheet)

  return flatMap(legendRows, (row) => {
    return getLegendCells(row).map(({ cell, definition }) => ({ definition, cell: cell.address }))
  })
}
