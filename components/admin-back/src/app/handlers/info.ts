import { isString, pick } from 'lodash'
import { Request, Response } from 'express'
import { createLogger } from 'libs/logger'
import {  InfoModel, InfoAttributes, findAndPaginate } from 'libs/domain-model'
import * as catchUtils from '../utils/withCatch'

const logger = createLogger(`#handlers/${__filename}`)
const withCatch = catchUtils.withCatch(logger)

export const create = withCatch(['info', 'create'], async (req: Request, res: Response) => {
  const { question, answer, category } = req.body as InfoAttributes

  await InfoModel.create({ question, answer, category })

  res.status(201).send()
})

export const update = withCatch(['info', 'update'], async (req: Request, res: Response) => {
  const { id } = req.params
  const { question, answer, category } = req.body as InfoAttributes

  await InfoModel.updateOne({ _id: id }, { question, answer, category })

  res.status(204).send()
})

export const remove = withCatch(['info', 'remove'], async (req: Request, res: Response) => {
  const { id } = req.params

  await InfoModel.deleteOne({ _id: id })

  res.status(204).send()
})

export const get = withCatch(['info', 'get'], async (req: Request, res: Response) => {
  const { id } = req.params

  if (isString(id)) {
    const entity = await InfoModel
      .findById(id)
      .exec()
    res.send(entity)
    return
  }

  const additionalOptions = {
    pickCount: true,
    pickCountAll: true,
    sort: req.query.ordering ? req.query.ordering.replace(/,/g, ' ') : 'question',
    query: pick(req.query, ['question', 'category']),
  }

  const result = await findAndPaginate(InfoModel, { ...req.query, ...additionalOptions })

  res.send(result)
})
