const SYMBOLS = ['*', '+', '?', '^', '$']

export const escape = (text: string): string => {
  return SYMBOLS.reduce((res, symb) => {
    return res.replace(new RegExp(`[\\${symb}]`, 'g'), '.{1}').slice()
  }, text)
}
