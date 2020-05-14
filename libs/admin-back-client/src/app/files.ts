import { AxiosRequestConfig } from 'axios'

export type EducationProcessScheduleInput = {
  file: any,
}

export const uploadEducationProcessSchedule = ({ file }: EducationProcessScheduleInput): AxiosRequestConfig => {
  const formData = new FormData()

  formData.append('schedule-xlsx', file, file.name)

  return {
    method: 'put',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    url: '/files/schedule/upload-education-process',
    data: formData,
  }
}

export const compileImages = (): AxiosRequestConfig => {
  return {
    method: 'post',
    url: '/files/schedule/compile-images',
  }
}
