import { InfoAttributes } from 'libs/domain-model'

export const INITIAL_NEW_QUESTION: InfoAttributes = {
  question: '',
  answer: '',
  category: ''
}

export const CREATE_UPDATE_DIALOG_DEFAULT_STATE: {
  mode: 'off' | 'create' | 'update'
  updatingId?: string
  initialValue: InfoAttributes
} = {
  mode: 'off',
  initialValue: INITIAL_NEW_QUESTION
}

export const ITEMS_PER_PAGE: number = 7
