import * as uuid from 'uuid/v4'
import { NextFunction, Request, Response } from 'express'

export const trace = (req: Request, res: Response, next: NextFunction): void => {
  res.locals.traceToken = uuid()
  next()
}
