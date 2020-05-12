import { AxiosRequestConfig } from 'axios'
import { InputWithId, ManyInput } from './shared'

export type GetFeedbackInput = InputWithId

export type GetFeedbacksInput = Pick<ManyInput, 'page' | 'limit'>

export const getFeedback = ({ id }: GetFeedbackInput): AxiosRequestConfig => {
  return {
    method: 'get',
    url: `/feedbacks/${id}`,
  }
}

export const getFeedbacks = (params: GetFeedbacksInput): AxiosRequestConfig => {
  return {
    params,
    method: 'get',
    url: '/feedbacks',
  }
}
