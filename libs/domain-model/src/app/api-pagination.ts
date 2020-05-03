import { Model, Document } from 'mongoose'

export interface PaginationOptions {
  search?: [string, string][]
  query?:  { [key: string]: any }
  sort?: string
  select?: string
  limit?: number | string
  page?: number | string

  pickCountAll?: boolean
  pickCount?: boolean
}

export interface PaginateResult<T> {
  docs: T[]
  limit: number
  page: number
  pages?: number
  pagesAll?: number
  count?: number
  countAll?: number
}

export const findAndPaginate = async <T extends Document>(model: Model<T>, options: PaginationOptions = {}): Promise<PaginateResult<T>> => {
  const condition: any = {}
  const dbPromises = []

  const pagination = {
    page: options.page ? Number(options.page) : 0,
    limit: options.limit ? Number(options.limit) : 10,
  }

  if (options.query && Object.keys(options.query)) {
    Object.entries(options.query).forEach(([key, value]: [string, string]) => {
      condition[key] = { $regex: value, $options: 'i' }
    })
  }

  const docsQuery = model.find(condition)

  if (options.sort) { docsQuery.sort(options.sort) }
  if (options.select) { docsQuery.select(options.select) }

  docsQuery.limit(pagination.limit)
  docsQuery.skip(pagination.limit * pagination.page)

  dbPromises.push(docsQuery.exec())

  if (options.pickCount) { dbPromises.push(model.countDocuments(condition).exec()) }
  if (options.pickCountAll) { dbPromises.push(model.countDocuments({}).exec()) }

  const dbResult = await Promise.all(dbPromises)

  const result: PaginateResult<T> = {
    docs: dbResult[0],
    limit: pagination.limit,
    page: pagination.page,
  }

  if (dbResult[1]) {
    result.count = dbResult[1]
    result.pages = Math.ceil(result.count / result.limit)
  }

  if (dbResult[2]) {
    result.countAll = dbResult[2]
    result.pagesAll = Math.ceil(result.countAll / result.limit)
  }

  return result
}
