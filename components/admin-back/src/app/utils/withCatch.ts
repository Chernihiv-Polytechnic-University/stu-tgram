import { curry } from 'lodash'
import { Handler } from 'express'
import { Logger } from 'libs/logger'

export const withCatch = curry((logger: Logger, logLabels: string[], handlerFn: Handler): Handler => async (req, res, next) => {
  try {
    await handlerFn(req, res, next)

  } catch (err) {
    logger.warn(logLabels, err)

    next(err)
  }
})
