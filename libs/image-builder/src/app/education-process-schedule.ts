import * as path from 'path'
import * as fs from 'fs'
import * as moment from 'moment'
import { flatMap, sortBy, range } from 'lodash'
import { EducationWeekData } from 'libs/domain-model'

moment.locale('uk')

const scheduleTemplate = fs.readFileSync(path.resolve(__dirname, 'education-process-schedule.html'), 'utf8')

interface DayInfo {
  date: string
  definition: string
}

const buildDays = (weeks: EducationWeekData[], firstOddWeekMondayData: string): DayInfo[] => {
  const sorted = sortBy(weeks, 'number')
  const [firstWeek] = sorted

  const cursor = moment(firstOddWeekMondayData).month(firstWeek.month).date(firstWeek.start)

  return flatMap(sorted, (week) => {
    return range(0, 7).map(() => {
      const dayInfo = { date: cursor.format('YYYY-MM-DD'), definition: week.definition }
      cursor.add(1, 'd')
      return dayInfo
    })
  })
}

const stringifyDayInfoList = (dayInfoList: DayInfo[]): string => {
  return `[${dayInfoList.map(e => `{date: '${e.date}', definition: '${e.definition}'}`).join(',')}]`
}

export const createEducationScheduleHTML = (
  weeks: EducationWeekData[],
  firstOddWeekMondayData: string,
): string => {
  const dayInfoList = buildDays(weeks, firstOddWeekMondayData)
  const dayInfoListAsStr = stringifyDayInfoList(dayInfoList)

  return scheduleTemplate.replace('\'{{{dayInfoList}}}\'', dayInfoListAsStr)
    .replace('{{{firstOddWeekMonday}}}', firstOddWeekMondayData)
}
