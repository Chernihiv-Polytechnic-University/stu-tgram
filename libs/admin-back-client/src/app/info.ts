import { AxiosRequestConfig } from 'axios'
import * as domain from 'libs/domain-model'
import { InputWithId, ManyInput } from './shared'

export type UpdateInfoInput = InputWithId & domain.InfoAttributes

export type CreateInfoInput = domain.InfoAttributes

export type GetInfoInput = InputWithId
export type GetManyInfoInput = ManyInput & {
  question?: string
  category?: string,
}
export type DeleteInfoInput = InputWithId

export const updateInfo = ({ answer, question, category, id }: UpdateInfoInput): AxiosRequestConfig => {
  return {
    method: 'patch',
    url: `/info/${id}`,
    data: { answer, question, category },
  }
}

export const getManyInfo = (params: GetManyInfoInput): AxiosRequestConfig => {
  return {
    params,
    method: 'get',
    url: '/info',
  }
}

export const getInfo = ({ id }: GetInfoInput): AxiosRequestConfig => {
  return {
    method: 'get',
    url: `/info/${id}`,
  }
}

export const createInfo = ({ answer, question, category }: CreateInfoInput): AxiosRequestConfig => {
  return {
    method: 'post',
    url: '/info',
    data: { answer, question, category },
  }
}

export const deleteInfo = ({ id }: DeleteInfoInput): AxiosRequestConfig => {
  return {
    method: 'delete',
    url: `/info/${id}`,
  }
}
