import * as ua from './texts/ua.json'

export const getTimeUnitEnding = (hours: number): string => {
  if (hours > 4) return ''
  if (hours > 2) return 'и'
  if (hours === 1) return 'y'
  return ''
}

export const buildText = (textId: string, replacers: { [key: string]: string | number } = {}): string => {
  const text = ua[textId]
  if (!text) {
    throw new Error(`Text does not exist. Text Id: ${textId}`)
  }
  return Object.entries(replacers).reduce((acc: string, [key, value]) => acc.replace(`{${key}}`, String(value)), text)
}
