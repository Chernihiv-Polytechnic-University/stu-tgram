import { AxiosRequestConfig } from 'axios'
import { InputWithId, InputWithFull } from './shared'

export type GetTeacherInput = InputWithId & InputWithFull

export type GetTeachersInput = InputWithFull & {
  limit?: number
  page?: number
  query?: string,
}

export const getTeacher = ({ id, full = false }: GetTeacherInput): AxiosRequestConfig => {
  return {
    params: { full },
    method: 'get',
    url: `/teachers/${id}`,
  }
}

export const getTeachers = (params: GetTeachersInput): AxiosRequestConfig => {
  return {
    params,
    method: 'get',
    url: '/teachers',
  }
}
