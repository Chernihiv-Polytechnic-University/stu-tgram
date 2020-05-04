import { UserAttributes, UserRole } from 'libs/domain-model'

export const INITIAL_NEW_USER: UserAttributes = {
  name: '',
  login: '',
  password: '',
  role: UserRole.manager
}

export const INITIAL_ERROR: any = {
  name: false,
  login: false,
  password: false
}

export const MAPPER: { [k: string]: RegExp } = {
  login: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
  password: /^.{9,}$/,
  name: /^[\S| ]{6,45}$/
}

export const ITEMS_PER_PAGE: number = 8
