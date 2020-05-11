import { AxiosRequestConfig } from 'axios'
import * as domain from 'libs/domain-model'

export type UpdateSystemSettingsInput = Pick<domain.SystemSettingsAttributes, 'firstOddWeekMondayDate'>

export const updateSystemSettings = ({ firstOddWeekMondayDate }: UpdateSystemSettingsInput): AxiosRequestConfig => {
  return {
    method: 'post',
    url: '/system-settings',
    data: { firstOddWeekMondayDate },
  }
}

export const getSystemSettings = (): AxiosRequestConfig => {
  return {
    method: 'get',
    url: '/system-settings',
  }
}
