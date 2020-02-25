import { NextFunction, Request, Response } from 'express'

export const timeout = (seconds: number) => (req: Request, res: Response, next: NextFunction): void => {
  res.setHeader('Keep-Alive', `timeout=${seconds}`)
  next()
}
