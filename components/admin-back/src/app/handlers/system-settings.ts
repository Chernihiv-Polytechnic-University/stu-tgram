import { isString, pick } from 'lodash'
import { Request, Response } from 'express'
import { createLogger } from 'libs/logger'
import { SystemSettingsAttributes, SystemSettingsModel } from 'libs/domain-model'
import * as catchUtils from '../utils/with-catch'

const logger = createLogger(`#handlers/${__filename}`)
const withCatch = catchUtils.withCatch(logger)

export const update = withCatch(['system-settings', 'update'], async (req: Request, res: Response) => {
  const { firstOddWeekMondayDate } = req.body as SystemSettingsAttributes

  await SystemSettingsModel.updateOne({ }, { $set: { firstOddWeekMondayDate } })

  res.status(204).send()
})

export const get = withCatch(['system-settings', 'get'], async (req: Request, res: Response) => {
  const entity = await SystemSettingsModel.findOne()

  res.send(entity)
})
