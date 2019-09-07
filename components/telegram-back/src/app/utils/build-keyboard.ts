import * as telegram from 'node-telegram-bot-api'
import { range } from 'lodash'
import { buildText } from './text-builder'

const DEFAULT_KEYBOARD_WIDTH = 2

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

export const buildKeyboardResponse
  = (type: 'inline' | 'panel',  buttonData: ButtonData[], width: number = DEFAULT_KEYBOARD_WIDTH): Keyboard => {
    const buttons: Button[] = buttonData.map((e) => {
      const button: Button =  { text: buildText(e.textId, e.textReplacers || {}) }
      if (type === 'inline' && e.cbData) { button.callback_data = e.cbData }
      return button
    })
    return type === 'panel'
    ? { keyboard: buildShape(buttons.length, width, buttons), resize_keyboard: true }
    : { inline_keyboard: buildShape(buttons.length, width, buttons) }
  }
