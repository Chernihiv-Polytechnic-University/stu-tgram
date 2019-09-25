import { readFileSync } from 'fs'
import { resolve as resolvePath } from 'path'
import { parse } from '#parsers/scheduleParser'

describe('scheduleParser', () => {
  describe('snapshots', () => {
    it('2019-2020.xls', () => {
      const xlsxBuffer = readFileSync(resolvePath(__dirname, 'sources', '2019-2020.xls'))
      const lessons = parse(xlsxBuffer)
      expect(lessons).toMatchSnapshot()
    })
  })
})
