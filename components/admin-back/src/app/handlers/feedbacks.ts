import { isString } from 'lodash'
import { Request, Response } from 'express'
import { createLogger } from 'libs/logger'
import { FeedbackModel, mongoose } from 'libs/domain-model'
import { withCatch } from '../utils/withCatch'

const logger = createLogger(`#handlers/${__filename}`)

const buildPipeline = (page: number, limit: number, id: string) => {
  const pipeline: any[] = [
    { $skip: page * limit },
    { $limit: limit },
    { $project: { text: 1, createdAt: 1, telegramUserId: { $toObjectId: '$telegramUserId' } } },
    { $lookup: { from: 'TelegramUser', localField: 'telegramUserId', foreignField: '_id', as: 'author' } },
    { $unwind: '$author' },
    { $project: { text: 1, createdAt: 1, author: 1, authorGroupId: { $toObjectId: '$author.groupId' } } },
    { $lookup: { from: 'StudentsGroup', as: 'group', let: { groupId: '$authorGroupId' }, pipeline: [
          { $match: { $expr: { $eq: ['$_id', '$$groupId'] } } },
          { $project: { name: 1, subgroupNumber: 1 } },
    ] } },
    { $unwind: '$group' },
  ]
  if (isString(id)) {
    pipeline.unshift({ $match: { _id: mongoose.Types.ObjectId(id) } })
  }
  return pipeline
}

export const get = withCatch(logger, ['feedbacks', 'get'], async (req: Request, res: Response) => {
  const { id } = req.params
  const { page, limit } = req.query

  if (isString(id)) {
    const result = await FeedbackModel.aggregate(buildPipeline(0, 1, id))
    res.send(result[0] ? result[0] : undefined)
    return
  }

  const pageN = isString(page) ? Number(page) : 0
  const limitN = isString(limit) ? Number(limit) : 10

  const docs = await FeedbackModel.aggregate(buildPipeline(pageN, limitN, id))
  const count = await FeedbackModel.countDocuments({}).exec()
  const pages = Math.ceil(count / limitN)

  const result = {
    docs,
    count,
    pages,
    limit: limitN,
    page: pageN,
    pagesAll: pages,
    countAll: count,
  }

  res.send(result)
})
