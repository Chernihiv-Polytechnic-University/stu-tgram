import { readFileSync } from 'fs'
import { resolve as resolvePath } from 'path'
import { parse } from '#parsers/scheduleParser'

describe('scheduleParser', () => {
  describe('snapshots', () => {
    it('feit1920.xls', async () => {
      const xlsxBuffer = readFileSync(resolvePath(__dirname, 'sources', 'feit1920.xlsx'))
      const lessons = await parse(xlsxBuffer)
      expect(lessons).toMatchSnapshot()
    })
  })
})
