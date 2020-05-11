import {addDays, formatISO, startOfWeek} from 'date-fns'

export type FarmLessonsInput = {
  from: string
  to: string
  week: 0 | 1
  type: 'teachers' | 'students'
}

export const INITIAL_DATE = startOfWeek(new Date(), { weekStartsOn: 1 })

export const INITIAL_FARM_LESSON_INPUT: FarmLessonsInput = {
  from: formatISO(INITIAL_DATE, { representation: 'date' }),
  to: formatISO(addDays(INITIAL_DATE, 6), { representation: 'date' }),
  week: 0,
  type: 'teachers'
}