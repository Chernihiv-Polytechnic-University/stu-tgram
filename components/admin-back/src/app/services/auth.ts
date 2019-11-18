import { Request, Response, NextFunction, RequestHandler } from 'express'
import * as jwt from 'jsonwebtoken'
import * as bcrypt from 'bcrypt'
import * as config from 'config'

import { createLogger } from 'libs/logger'
import { UserAttributes, UserModel } from 'libs/domain-model'

const logger = createLogger(`#services/${__filename}`)

export interface JWTPayload {
  _id: string
  agent?: string
  ip?: string
  expiresIn: number
  hash: string
}

const saltRound = 11

export const hashPass = (password: string): Promise<string> => bcrypt.hash(password, saltRound)

const comparePass = (password: string, hash: string): Promise<boolean> => bcrypt.compare(password, hash)

const getHashPart = (user: UserAttributes) => {
  return user.password.slice(-12)
}

const getIp = (expressRequest: Request): string => config.get('USE_PROXY')
  ? expressRequest.header(config.get('IP_PROXY_HEADER_NAME')).toString()
  : expressRequest.connection.remoteAddress as string

const signJWT = async (data: JWTPayload): Promise<string> => new Promise((resolve, reject) => {
  jwt.sign(data, config.get('JWT_SECRET'), {}, (err, res) => {
    if (err) { return reject(err) }
    return resolve(res)
  })
})

const verifyJWT = async (token: string): Promise<JWTPayload> => new Promise((resolve, reject) => {
  jwt.verify(token, config.get('JWT_SECRET'), (err, data) => {
    if (err) { return reject(err) }
    return resolve(data as JWTPayload)
  })
})

export const getToken = async (login: string, password: string, expressRequest: Request): Promise<string> => {
  const user = await UserModel.findOne({ login })
  if (!user) {
    throw new Error('Wrong email or password')
  }
  const authenticated = await comparePass(password, user.password)
  if (!authenticated) {
    throw new Error('Wrong email or password')
  }
  const payload: JWTPayload = {
    _id: user._id,
    ip: getIp(expressRequest),
    agent: expressRequest.header('user-agent'),
    expiresIn: Date.now() + (config.get('JWT_LIFE_TIME') as number),
    hash: getHashPart(user),
  }
  return signJWT(payload)
}

const isValidToken = (payload: JWTPayload, expressRequest: Request, user: UserAttributes): boolean => {
  const ip = getIp(expressRequest)
  const agent = expressRequest.header('user-agent')
  return ip === payload.ip
    && agent === payload.agent
    && payload.hash === getHashPart(user)
    && payload.expiresIn > Date.now()
}

export const authMiddleware: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader) {
      res.status(401).send({ message: 'Not Authorized' })
      return
    }
    const payload: JWTPayload = await verifyJWT(authHeader.replace('Bearer ', ''))
    const user = await UserModel.findById(payload._id)
    if (!isValidToken(payload, req, user)) {
      res.status(401).send({ message: 'Not Authorized' })
      return
    }
    res.locals.user = user
    next()
  } catch (e) {
    res.status(401).send({ message: 'Not Authorized' })
  }
}

export const createScopeMiddleware = (scope: ('a' | 'm')[]): RequestHandler => async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { role } = res.locals.user
    if (scope.includes(role)) {
      next()
      return
    }
    res.status(403).send({ message: 'Forbidden for your role' })
  } catch (e) {
    next(e)
  }
}
