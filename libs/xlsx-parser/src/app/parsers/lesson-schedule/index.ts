// TODO rewrite, with only excel
import * as xlsx from 'xlsx'
import * as Excel from 'exceljs/modern.nodejs'
import { range, get, isString, min, flatMap, map, filter, isEqual } from 'lodash'

const DAYS = ['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ']
const GROUP_NUMBER_REGEXP = /^([0-9]{2,3})$/
const GROUP_CODE_REGEXP = /^([а-щА-ЩЬьЮюЯяЇїІіЄєҐґ]{2,4})$/
const AUDITORY_REGEXP = /[0-9]{1}[ ]{0,1}-[ ]{0,1}[0-9]{1,3}/
const GROUP_CODE_NUMBER_SEPARATOR = '-'
const DAYS_IN_WEEK = 6

const DEFAULT_AUDITORY = 'хтозна-де'
const DEFAULT_TEACHER_NAME = 'Викладач'
const DEFAULT_LESSON_NAME = 'Пара'

export interface Lesson {
  isExist: boolean,
  course: number,
  number: number,
  group: { subgroupNumber: number, name: string },
  week: number,
  day: 'ПН' | 'ВТ' | 'СР' | 'ЧТ' | 'ПТ' | 'СБ',
  auditory?: string
  name?: string
  teacher?: { name: string }
}

const filterNoLessons = (lessons: Lesson[]) =>
  filter(lessons, (e) => {
    // in this case, almost completely that this is a mistake of the current parsing
    return (
      e.week !== 1 // last week
      || e.day !== 'СБ' // last day
      || e.auditory !== DEFAULT_AUDITORY // unknown place
      || e.teacher.name !== DEFAULT_TEACHER_NAME // unknown teacher
    )
      &&
    (
      e.auditory !== DEFAULT_AUDITORY
      || e.teacher.name !== DEFAULT_TEACHER_NAME
      || e.name !== DEFAULT_LESSON_NAME
    )
  })

const checkValueIsGroup = (value) => {
  if (!value.includes(GROUP_CODE_NUMBER_SEPARATOR)) {
    return false
  }
  const [groupCode, groupNumber] = value.split('-').map(e => e.trim())
  return GROUP_CODE_REGEXP.test(groupCode) && GROUP_NUMBER_REGEXP.test(groupNumber)
}

const findGroups = (data) => {
  const groups = []
  let groupRowIsFound = false
  for (let i = 0; !groupRowIsFound && i < data.length; i += 1) {
    const row = data[i]
    Object.entries(row).forEach(([key, value]) => {
      const valueIsGroup = checkValueIsGroup(value)
      if (valueIsGroup) {
        const columns = [Number(key), Number(key) + 1]
        groups.push({ columns, name: value })
        groupRowIsFound = true
      }
    })
  }
  return groups
}
const findDays = (data) => {
  const days = {}
  let isOdd = true
  let lastDay = null
  let dayColumn = null
  for (let i = 0; i < data.length; i += 1) {
    isOdd = Object.keys(days).length <= DAYS_IN_WEEK
    const row = data[i]
    if (dayColumn && row[dayColumn]) {
      const day = row[dayColumn]
      if (!DAYS.includes(day)) {
        // can be days headers (e.g: Пн, ВТ) or smth like this
        lastDay = null
        continue
      }
      // new day
      lastDay = day
      isOdd = Object.keys(days).length + 1 <= DAYS_IN_WEEK
      days[`${lastDay}-${isOdd ? 'odd' : 'even'}`] = { isOdd, rows: [i], name: lastDay }
      continue
    }
    if (dayColumn && !lastDay) {
      // value after not day
      continue
    }
    if (dayColumn) {
      // value after day
      days[`${lastDay}-${isOdd ? 'odd' : 'even'}`].rows.push(i)
      continue
    }
    // find first day
    Object.entries(row).forEach(([key, value]: [any, any]) => {
      if (!dayColumn && DAYS.includes(value.trim())) {
        lastDay = value.trim()
        dayColumn = key
        days[`${lastDay}-${isOdd ? 'odd' : 'even'}`] = { isOdd, rows: [i], name: lastDay }
      }
    })
  }
  return days
}

const findGroupLessons = (data, groups, days, sheet, excelWorksheet: Excel.Worksheet) => {
  const sheetValues = Object.entries(sheet).map(([key, value]) => ({
    ...value,
    cell: key,
  }))
  groups.forEach((group) => { group.days = [] })
  Object.values(days).forEach((day: any) => {
    const groupColumns = flatMap(groups, 'columns')
    const minColumn = min(map(groupColumns, Number))
    const dayRows = day.rows.map(rowIndex => data[rowIndex]).map(e => Object.entries(e).reduce((acc, [key, value]) => {
      const cellName = get(sheetValues.find((e: any) => isString(e.v) && e.v === value), 'cell')
      const cell = isString(cellName) ? excelWorksheet.getCell(cellName) : {}
      if (Number(key) < minColumn || !cell.isMerged) {
        return { ...acc, [key]: value }
      }
      // use `${value} ` to make new value different from original
      const update = range(Number(key), Number(key) + cell._mergeCount + 1).reduce((acc, k) => ({ ...acc, [k]: `${value} ` }), {})
      return {
        ...acc,
        ...update,
      }
    }, {}))

    groups.forEach((group) => {
      const groupDay: any = { name: day.name, isOdd: day.isOdd }
      groupDay.lessons = dayRows.map(dayRow => group.columns.reduce((acc, column) => [...acc, dayRow[column]], []))
      group.days.push(groupDay)
    })
  })
  return groups
}

const parseLessonData = (lessonData) => {
  if (!lessonData) {
    return [DEFAULT_LESSON_NAME, DEFAULT_TEACHER_NAME, DEFAULT_AUDITORY]
  }
  const auditoryData = lessonData.match(AUDITORY_REGEXP)
  const auditoryIndex = get(auditoryData, 'index', Number.MAX_SAFE_INTEGER)
  const auditoryName = get(auditoryData, '0', DEFAULT_AUDITORY)
  const lessonDataWithoutAuditory = lessonData.replace(auditoryName, '')
  const splittedOne = lessonDataWithoutAuditory.split('\n')
  if (splittedOne.length > 1) {
    return [...splittedOne.map(str => str.trim()), auditoryName]
  }
  const splittedTwo = lessonDataWithoutAuditory
    .split('     ')
    .map(str => str.trim())
    .filter(str => str.length > 1)
  const lessonName = get(splittedTwo, '0', DEFAULT_LESSON_NAME)
  const teacherName = get(splittedTwo, '1', DEFAULT_TEACHER_NAME)
  return [lessonName, teacherName, auditoryName]
}

const buildLessons = (groups) => {
  const lessons = []
  groups.forEach((group) => {
    group.days.forEach((day) => {
      day.lessons.forEach((lessonsSource, i) => {
        if (isString(lessonsSource[0])) {
          const [lessonName, teacherName, auditory] = parseLessonData(lessonsSource[0])
          const lesson = {
            auditory,
            course: 0,
            number: i + 1,
            isExist: true,
            group:  { subgroupNumber: 1, name: group.name && group.name.replace(/ /g, '') },
            week: day.isOdd ? 0 : 1,
            day: day.name,
            name: lessonName,
            teacher: { name: teacherName },
          }
          lessons.push(lesson)
        }
        if (isString(lessonsSource[1])) {
          const [lessonName, teacherName, auditory] = parseLessonData(lessonsSource[1])
          const lesson = {
            auditory,
            course: 0,
            number: i + 1,
            isExist: true,
            group:  { subgroupNumber: 2, name: group.name && group.name.replace(/ /g, '') },
            week: day.isOdd ? 0 : 1,
            day: day.name,
            name: lessonName,
            teacher: { name: teacherName },
          }
          lessons.push(lesson)
        }
      })
    })
  })
  return filterNoLessons(lessons)
}

export const parse = async (fileBuffer) => {
  const workbook = xlsx.read(fileBuffer)
  const excelWorkbook = new Excel.Workbook()
  await excelWorkbook.xlsx.load(fileBuffer)
  const result = []
  Object.values(workbook.Sheets).forEach((sheet, i) => {
    const data = xlsx.utils.sheet_to_json(sheet, { header: range(100).map(e => String(e)) })
    const groupsData = findGroups(data)
    const days = findDays(data)
    const groups = findGroupLessons(data, groupsData, days, sheet, excelWorkbook.getWorksheet(i + 1))
    result.push(...buildLessons(groups))
  })
  return result
}
