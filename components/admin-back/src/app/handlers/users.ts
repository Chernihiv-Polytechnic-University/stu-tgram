import { set, isString, pick } from 'lodash'
import { Request, Response } from 'express'
import config from '../config'
import { createLogger } from 'libs/logger'
import {  UserModel, findAndPaginate } from 'libs/domain-model'
import { getToken, hashPass } from '../services/auth'
import * as catchUtils from '../utils/with-catch'

const logger = createLogger(`#handlers/${__filename}`)
const withCatch = catchUtils.withCatch(logger)

const FIELDS_TO_SELECT = '_id name login role createdAt updatedAt'

export const login = withCatch(['users', 'login'], async (req: Request, res: Response) => {
  try {
    const { login, password } = req.body

    const token = await getToken(login, password, req)

    res.cookie(
      config('AUTH_COOKIES_NAME'),
      token,
      { httpOnly: true, expires: new Date(Date.now() + config('AUTH_COOKIES_LIFETIME')) },
    )
      .status(204)
      .send()
  } catch (e) {
    if (e.message === 'Wrong email or password') {
      res.status(401).send({ message: e.message })
      return
    }

    throw e
  }
})

export const logout = withCatch(['users', 'logout'], async (req: Request, res: Response) => {
  res.clearCookie(config('AUTH_COOKIES_NAME'))
    .status(204)
    .send()
})

export const create = withCatch(['users', 'create'], async (req: Request, res: Response) => {
  const { login, password, role, name } = req.body

  const hashedPassword = await hashPass(password)

  await UserModel.create({ login, role, name, password: hashedPassword })

  res.status(201).send()
})

export const update = withCatch(['users', 'update'], async (req: Request, res: Response) => {
  const { _id } = res.locals.user
  const { login, password, name } = req.body
  const patch = {}

  if (isString(login)) { set(patch, 'login', login) }
  if (isString(name)) { set(patch, 'name', name) }
  if (isString(password)) { set(patch, 'password', await hashPass(password)) }

  await UserModel.updateOne({ _id }, patch)

  res.status(204).send()
})

export const remove = withCatch(['users', 'remove'], async (req: Request, res: Response) => {
  const { id } = req.params

  await UserModel.deleteOne({ _id: id })

  res.status(204).send()
})

export const get = withCatch(['users', 'get'], async (req: Request, res: Response) => {
  const { id } = req.params

  if (req.path === '/me') {
    const user = await UserModel
        .findById(res.locals.user._id)
        .select(FIELDS_TO_SELECT)
        .exec()
    res.send(user)
    return
  }

  if (isString(id)) {
    const user = await UserModel
        .findById(id)
        .select(FIELDS_TO_SELECT)
        .exec()
    res.send(user)
    return
  }

  const additionalOptions = {
    select: FIELDS_TO_SELECT,
    pickCount: true,
    pickCountAll: true,
    sort: req.query.ordering ? req.query.ordering.replace(/,/g, ' ') : 'name',
    query: pick(req.query, ['name', 'login']),
  }

  const result = await findAndPaginate(UserModel, { ...req.query, ...additionalOptions })

  res.send(result)
})
