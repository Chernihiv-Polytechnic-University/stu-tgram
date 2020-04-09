import { Logger } from 'libs/logger'
import { Request, Response, NextFunction } from 'express'

export const logOnResponse = (logger: Logger) => (req: Request, res: Response, next: NextFunction) => {
  const { path, method, body, query, params } = req
  res.on('finish', () => {
    logger.info(['api'], {
      path,
      method,
      body: { ...body },
      query: { ...query },
      params: { ...params },
      traceToken: res.locals.traceToken,
      userId: res.locals.user && res.locals.user._id,
    })
  })
  next()
}
