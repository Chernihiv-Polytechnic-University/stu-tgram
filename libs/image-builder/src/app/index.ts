import * as puppeteer from 'puppeteer'
import { LessonAttributes, EducationWeekData } from 'libs/domain-model'

import { createLessonScheduleHTML } from './lesson-schedule'
import { createEducationScheduleHTML } from './education-process-schedule'

export const createImageMaker = async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] })
  const page = await browser.newPage()

  return {
    destruct: (): Promise<void> => browser.close(),
    createLessonSchedulePNG: async (
      lessons: LessonAttributes[],
      groupName: string,
      subgroupNumber: number,
    ) => {
      const html = createLessonScheduleHTML(lessons, groupName, subgroupNumber)
      await page.setContent(html)
      const data = await page.screenshot({ type: 'png', fullPage: true })
      return data
    },
    createEducationSchedulePNG: async (weeks: EducationWeekData[], firstOddWeekMondayData: string) => {
      const html = createEducationScheduleHTML(weeks, firstOddWeekMondayData)
      await page.setContent(html)
      // await page.screenshot({ path: 'es' + groupName + '.png', type: 'png', fullPage: true })
      const data = await page.screenshot({ type: 'png', fullPage: true })
      return data
    },
  }
}
