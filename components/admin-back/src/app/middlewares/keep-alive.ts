import { NextFunction, Request, Response } from 'express'

export const keepAlive = (req: Request, res: Response, next: NextFunction): void => {
  res.setHeader('Connection', 'keep-alive')
  next()
}
