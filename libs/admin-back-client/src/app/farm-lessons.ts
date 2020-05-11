import { AxiosRequestConfig } from 'axios'

export type FarmLessonsInput = {
  from: string
  to: string
  week: 0 | 1
  type: 'teachers' | 'students',
}

export const farmLessons = ({ from, to, week, type }: FarmLessonsInput): AxiosRequestConfig => {
  return {
    method: 'post',
    url: `/lessons/farm/for-${type}`,
    data: { from, to, week },
  }
}
