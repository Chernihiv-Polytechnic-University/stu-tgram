import * as ua from './texts/ua.json'

export const buildText = (textId: string, replacers: { [key: string]: string } = {}) => {
  const text = ua[textId]
  if (!text) {
    throw new Error(`Text does not exist. Text Id: ${textId}`)
  }
  return Object.entries(replacers).reduce((acc: string, [key, value]) => acc.replace(`{${key}}`, value), text)
}
