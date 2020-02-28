import { AxiosRequestConfig } from 'axios'
import { InputWithId } from './shared'

export type LoginInput = {
  login: string
  password: string,
}

export type UpdateUserInput = InputWithId & {
  login?: string
  password?: string
  name?: string,
}

export type CreateUserInput = {
  login: string
  password: string
  role: 'a' | 'm'
  name: string,
}

export type GetUserInput = InputWithId
export type DeleteUserInput = InputWithId

export const login = ({ login, password }: LoginInput): AxiosRequestConfig => {
  return {
    method: 'post',
    url: '/users/login',
    data: { login, password },
  }
}

export const logout = (): AxiosRequestConfig => {
  return {
    method: 'post',
    url: '/users/logout',
    data: {},
  }
}

export const updateCurrentUser = ({ login, password, name }: Omit<UpdateUserInput, 'id'>): AxiosRequestConfig => {
  return {
    method: 'patch',
    url: '/users/me',
    data: { login, password, name },
  }
}

export const getUser = ({ id }: GetUserInput): AxiosRequestConfig => {
  return {
    method: 'get',
    url: `/users/${id}`,
  }
}

export const getCurrentUser = (): AxiosRequestConfig => {
  return getUser({ id: 'me' })
}

export const createUser = ({ login, password, role, name }: CreateUserInput): AxiosRequestConfig => {
  return {
    method: 'post',
    url: '/users',
    data: { login, password, role, name },
  }
}

export const deleteUser = ({ id }: DeleteUserInput): AxiosRequestConfig => {
  return {
    method: 'delete',
    url: `/users/${id}`,
  }
}

export const getUsers = (): AxiosRequestConfig => {
  return getUser({ id: '' })
}
