import { Worksheet } from 'exceljs'
import { isString, flatMap } from 'lodash'
import { getRows, getCells } from './common'

const GROUP_REGEXP = /([а-щА-ЩЬьЮюЯяЇїІіЄєҐґ]{2,4})-([0-9]{2,3})/g
const GROUPS_HEADER_CELL_VALUE = 'ШИФР ГРУПИ'

export interface GroupData {
  group: string,
  rowNumber: number
}

const getGroupsColumnKey = (worksheet) => {
  const rows = getRows(worksheet)
  // @ts-ignore
  const rowWithHeaderCell = rows.find(r => r.values.includes(GROUPS_HEADER_CELL_VALUE))
  const cells = getCells(rowWithHeaderCell)
  const headerCell = cells.find(c => c.value === GROUPS_HEADER_CELL_VALUE)
  return headerCell.col
}
// flatMap(groupsColumn.values, (value) => isString(value) && value.match(GROUP_REGEXP)).filter(e => e)
const getGroupsWithRow = (worksheet, groupsColumnKey) => {
  const rows = getRows(worksheet)
  return flatMap(rows, (row) => {
    const groupColumnCell = row.findCell(groupsColumnKey)
    if (groupColumnCell && isString(groupColumnCell.value) && groupColumnCell.value.match(GROUP_REGEXP)) {
      return groupColumnCell.value.match(GROUP_REGEXP)
        .map((group => ({ group, row })))
    }
  }).filter(e => e)
}

export default (worksheet: Worksheet): GroupData[] => {
  const groupsColumnKey = getGroupsColumnKey(worksheet)
  const groups = getGroupsWithRow(worksheet, groupsColumnKey)
  return groups.map(({ group, row }) => ({ group, rowNumber: row.number }))
}
