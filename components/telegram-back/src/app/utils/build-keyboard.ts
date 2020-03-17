import * as telegram from 'node-telegram-bot-api'
import { range, uniq } from 'lodash'
import { buildText } from './text-builder'

const DEFAULT_KEYBOARD_WIDTH = 2

export const MAIN_KEYBOARD_TEXT_IDS = [
  'whichLesson',
  'whichSchedule',
  'whichWeek',
  'whichCallSchedule',
  'leftFeedback',
  'aboutSystem',
  'claimAttestation',
  'whichEducationSchedule',
  'settings',
]

export const REQUIRED_MAIN_KEYBOARD_TEXT_IDS = [
  'settings',
]

const SETTINGS_KEYBOARD_TEXT_IDS = [
  'setKeyboard',
  'back',
]

interface Button extends telegram.InlineKeyboardButton, telegram.KeyboardButton {}

export interface Keyboard {
  keyboard?: Button[][]
  inline_keyboard?: Button[][],
  resize_keyboard?: boolean
}

export interface ButtonData {
  textId: string,
  textReplacers?: { [key: string]: string }
  cbData?: string
}

const buildShape = (length: number, width: number, buttons): Button[][] => {
  const height = Math.ceil(length / width)
  const array = range(height).map(() => [])
  buttons.forEach((button, i) => {
    const row = Math.floor(i / width)
    array[row].push(button)
  })
  return array
}

export const buildSettingKeyboardResponse = () => {
  const buttons: Button[] = SETTINGS_KEYBOARD_TEXT_IDS.map(textId => ({
    text: buildText(textId),
  }))

  return { keyboard: buildShape(buttons.length, DEFAULT_KEYBOARD_WIDTH, buttons), resize_keyboard: true }
}

export const buildSetupKeyboardResponse   = (type: 'inline' | 'panel',  buttonData: string[], width: number): Keyboard => {
  const buttons: Button[] = uniq(buttonData).map((e) => {
    return { text: e }
  })

  return type === 'panel'
    ? { keyboard: buildShape(buttons.length, width, buttons), resize_keyboard: true }
    : { inline_keyboard: buildShape(buttons.length, width, buttons) }
}

export const buildMainKeyboardResponse
  = (type: 'inline' | 'panel',  buttonData: string[], width: number = DEFAULT_KEYBOARD_WIDTH): Keyboard => {
    const filteredButtonData = buttonData.length > 0
      ? buttonData
      : [...MAIN_KEYBOARD_TEXT_IDS]

    const buttons: Button[] = uniq([...filteredButtonData, ...REQUIRED_MAIN_KEYBOARD_TEXT_IDS]).map((e) => {
      return { text:  buildText(e,  {}) }
    })

    return type === 'panel'
    ? { keyboard: buildShape(buttons.length, width, buttons), resize_keyboard: true }
    : { inline_keyboard: buildShape(buttons.length, width, buttons) }
  }
