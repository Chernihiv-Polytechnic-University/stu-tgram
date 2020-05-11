import { isString } from 'lodash'
import { Request, Response } from 'express'
import { withCatch } from '../utils/with-catch'
import { parseBoolean } from '../utils/parse-boolean'
import { createLogger } from 'libs/logger'
import { TeacherModel, Teacher } from 'libs/domain-model'
const logger = createLogger(`#handlers/${__filename}`)

const mapFullInfo = (teacher: Teacher) => ({
  ...teacher.toJSON(),
  lessonsScheduleImage: teacher.lessonsScheduleImage
    ? teacher.lessonsScheduleImage.toString('base64')
    : undefined,
})

export const get = withCatch(logger, ['get', 'teachers'], async (req: Request, res: Response) => {
  const { id } = req.params
  const { page, limit, query, full = false } = req.query

  if (isString(id)) {
    const result = await TeacherModel
        .findById(id, parseBoolean(full) ? {} : { lessonsScheduleImage: 0 })
        .then(mapFullInfo)

    res.send(result)

    return
  }

  const pageN = isString(page) ? Number(page) : 0
  const limitN = isString(limit) ? Number(limit) : 10
  const findInput = isString(query) ? { name: { $regex: new RegExp(query), $options: 'i' } } : {}

  const docs = await TeacherModel
      .find(findInput, parseBoolean(full) ? {} : { lessonsScheduleImage: 0 })
      .limit(limitN)
      .skip(pageN * limitN)

  const count = await TeacherModel.countDocuments(findInput).exec()
  const countAll = await TeacherModel.countDocuments({}).exec()
  const pages = Math.ceil(count / limitN)
  const pagesAll = Math.ceil(countAll / limitN)

  const result = {
    count,
    pages,
    pagesAll,
    countAll,
    docs: docs.map(mapFullInfo),
    limit: limitN,
    page: pageN,
  }

  res.send(result)
})
// TODO can't work due to the way to collect this data
// Users should ask about changing teacher data in STU schedule DB and then refarm teachers / students schedule
export const update = withCatch(logger, ['update', 'teachers'], async (req: Request, res: Response) => {
  const { id } = req.params
  const { name } = req.body

  await TeacherModel.updateOne({ _id: id }, { name })

  res.sendStatus(204)
})
