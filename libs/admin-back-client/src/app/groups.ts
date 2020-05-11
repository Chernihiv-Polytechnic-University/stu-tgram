import { AxiosRequestConfig } from 'axios'
import { InputWithId, InputWithFull } from './shared'

export type GetGroupInput = InputWithId & InputWithFull

export type GetGroupsInput = InputWithFull & {
  limit?: number
  page?: number
  query?: string,
}

export const getGroup = ({ id, full = false }: GetGroupInput): AxiosRequestConfig => {
  return {
    params: { full },
    method: 'get',
    url: `/groups/${id}`,
  }
}

export const getGroups = (params: GetGroupsInput): AxiosRequestConfig => {
  return {
    params,
    method: 'get',
    url: '/groups/',
  }
}
