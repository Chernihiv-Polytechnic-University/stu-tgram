import { isString } from 'lodash'
import { Request, Response } from 'express'
import { withCatch } from '../utils/with-catch'
import { createLogger } from 'libs/logger'
import { StudentsGroupModel, StudentsGroup } from 'libs/domain-model'
const logger = createLogger(`#handlers/${__filename}`)

const SELECT_MANY_FIELDS = '_id subgroupNumber name createdAt updatedAt'

const mapFullInfo = (group: StudentsGroup) => ({
  ...group.toJSON(),
  educationScheduleImage: group.educationScheduleImage.toString('base64'),
  lessonsScheduleImage: group.lessonsScheduleImage.toString('base64'),
})

export const get = withCatch(logger, ['get', 'groups'], async (req: Request, res: Response) => {
  const { id } = req.params
  const { page, limit, query } = req.query

  if (isString(id)) {
    const result = await StudentsGroupModel
        .findById(id, { educationSchedule: 0 })
        .then(mapFullInfo)

    res.send(result)

    return
  }

  const pageN = isString(page) ? Number(page) : 0
  const limitN = isString(limit) ? Number(limit) : 10
  const findInput = isString(query) ? { name: { $regex: new RegExp(query), $options: 'i' } } : {}

  const docs = await StudentsGroupModel
      .find(findInput)
      .limit(limitN)
      .skip(pageN * limitN)
      .select(SELECT_MANY_FIELDS)

  const count = await StudentsGroupModel.countDocuments(findInput).exec()
  const countAll = await StudentsGroupModel.countDocuments({}).exec()
  const pages = Math.ceil(count / limitN)
  const pagesAll = Math.ceil(countAll / limitN)

  const result = {
    docs,
    count,
    pages,
    pagesAll,
    countAll,
    limit: limitN,
    page: pageN,
  }

    res.send(result)
  })