import * as moment from 'moment'

export type Day = 'ПН' | 'ВТ' | 'СР' | 'ЧТ' | 'ПТ' | 'СБ'

export const dateToDay = (date: string): Day => {
  if (!moment(date).isValid()) {
    return null
  }

  const dayNumber = moment(date).isoWeekday()
  return ['', 'ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'НД'][dayNumber] as Day
}
