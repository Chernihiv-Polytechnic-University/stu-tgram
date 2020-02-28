import { AxiosRequestConfig } from 'axios'
import { InputWithId } from './shared'

export type GetGroupInput = InputWithId

export type GetGroupsInput = {
  limit?: number
  page?: number
  query?: string,
}

export const getGroup = ({ id }: GetGroupInput): AxiosRequestConfig => {
  return {
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
