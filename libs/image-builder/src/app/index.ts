import * as puppeteer from 'puppeteer'
import { LessonAttributes, EducationWeekData } from 'libs/domain-model'

import { createLessonScheduleHTML } from './lesson-schedule'
import { createEducationScheduleHTML } from './education-process-schedule'

export const createImageMaker = async () => {

  return {
    destruct: (): Promise<void> => Promise.resolve(),
    createLessonSchedulePNG: async (
      lessons: LessonAttributes[],
      {
        groupName,
        subgroupNumber,
        teacherName,
      }:{
        groupName?: string,
        subgroupNumber?: number,
        teacherName?: string,
      },
    ) => {
      const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] })
      const html = createLessonScheduleHTML(lessons, { groupName, subgroupNumber, teacherName })
      const page = await browser.newPage()
      await page.setContent(html)
      const data = await page.screenshot({ type: 'png', fullPage: true })
      await page.close()
      await browser.close()
      return data
    },
    createEducationSchedulePNG: async (weeks: EducationWeekData[], firstOddWeekMondayData: string) => {
      const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] })
      const html = createEducationScheduleHTML(weeks, firstOddWeekMondayData)
      const page = await browser.newPage()
      await page.setContent(html)
      // await page.screenshot({ path: 'es' + groupName + '.png', type: 'png', fullPage: true })
      const data = await page.screenshot({ type: 'png', fullPage: true })
      await page.close()
      await browser.close()
      return data
    },
  }
}
