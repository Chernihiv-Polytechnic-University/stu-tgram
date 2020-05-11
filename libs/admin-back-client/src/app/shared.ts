
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

export type ManyInput = {
  sort?: string
  limit?: number
  page?: number,
}

export type InputWithFull = {
  full?: boolean,
}
