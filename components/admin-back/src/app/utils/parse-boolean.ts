export const parseBoolean = (value: string | boolean | undefined): boolean => {
  return value === 'true' || value === true
}
