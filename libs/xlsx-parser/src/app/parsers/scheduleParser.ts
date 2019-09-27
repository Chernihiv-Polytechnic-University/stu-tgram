// TODO rewrite, test
import * as xlsx from 'xlsx'
import { range, get, isString } from 'lodash'

const DAYS = ['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ']
const GROUP_NUMBER_REGEXP = /^([0-9]{2,3})$/
const GROUP_CODE_REGEXP = /^([а-щА-ЩЬьЮюЯяЇїІіЄєҐґ]{2,4})$/
const AUDITORY_REGEXP = /[0-9]{1}[ ]{0,1}-[ ]{0,1}[0-9]{1,3}/
const GROUP_CODE_NUMBER_SEPARATOR = '-'
const LESSON_IS_COMMON_IXFE_THRESHOLD = 200
const DAYS_IN_WEEK = 6

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

const findCourse = (data) => {
  let course = null
  for (let i = 0; !course && i < data.length; i += 1) {
    const row = data[i]
    Object.values(row).forEach((value: string) => {
      if (value && value.trim().endsWith('курс')) {
        course = value.trim()
      }
    })
  }
  return course
}

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

const findGroupLessons = (data, groups, days, sheet) => {
  const sheetValues = Object.values(sheet)
  groups.forEach((group) => { group.days = [] })
  Object.values(days).forEach((day: any) => {
    const dayRows = day.rows.map(rowIndex => data[rowIndex])
    groups.forEach((group) => {
      const groupDay: any = { name: day.name, isOdd: day.isOdd }
      groupDay.lessons = dayRows.map(dayRow => group.columns.reduce((acc, column, i) => {
        const data =  dayRow[column]
        if (i === 0) {
          const size = get(sheetValues.find((e: any) => e.v === data), 'ixfe')
          return size > LESSON_IS_COMMON_IXFE_THRESHOLD
            ? [data, data]
            : [data]
        }
        return [...acc, dayRow[column]]
      }, []))
      group.days.push(groupDay)
    })
  })
  return groups
}

const parseLessonData = (lessonData) => {
  if (!lessonData) {
    return [null, null, null]
  }
  const auditoryData = lessonData.match(AUDITORY_REGEXP)
  const auditoryIndex = get(auditoryData, 'index', Number.MAX_SAFE_INTEGER)
  const auditoryName = get(auditoryData, '0', null)
  const splittedOne = lessonData.substr(0, auditoryIndex).split('\n')
  if (splittedOne.length > 1) {
    return [...splittedOne.map(str => str.trim()), auditoryName]
  }
  const splittedTwo = lessonData.substr(0, auditoryIndex).split('     ')
  return [...splittedTwo.map(str => str.trim()).filter(str => str.length > 1), auditoryName]
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
  return lessons
}

export const parse = (fileBuffer) => {
  const workbook = xlsx.read(fileBuffer)
  const result = []
  Object.values(workbook.Sheets).forEach((sheet, i) => {
    const data = xlsx.utils.sheet_to_json(sheet, { header: range(100).map(e => String(e)) })
    const groupsData = findGroups(data)
    const days = findDays(data)
    const groups = findGroupLessons(data, groupsData, days, sheet)
    result.push(...buildLessons(groups))
  })
  return result
}
