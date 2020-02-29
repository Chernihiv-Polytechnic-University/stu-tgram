
export type InputWithId = {
  id: string,
}

export type ManyOutput<T> = {
  docs: T[]
  count: number
  pages: number
  limit: number
  page: number
  pagesAll: number
  countAll: number,
}
