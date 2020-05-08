import { AxiosRequestConfig } from 'axios'

export type EducationProcessScheduleInput = {
  file: any,
}

export const uploadEducationProcessSchedule = ({ file }: EducationProcessScheduleInput): AxiosRequestConfig => {
  return {
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    url: '/schedule/upload-education-process',
    data: { 'schedule-xlsx': file },
  }
}

export const compileImages = (): AxiosRequestConfig => {
  return {
    method: 'post',
    url: '/schedule/compile-images',
  }
}
