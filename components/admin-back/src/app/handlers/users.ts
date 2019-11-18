import { set, isString } from 'lodash'
import { Request, Response } from 'express'
import { createLogger } from 'libs/logger'
import { UserAttributes, UserModel, findAndPaginate } from 'libs/domain-model'
import { getToken, hashPass } from '../services/auth'

const logger = createLogger(`#handlers/${__filename}`)

export const login = async (req: Request, res: Response, next) => {
  try {
    const { login, password } = req.body

    const token = await getToken(login, password, req)

    res.send({ token })
  } catch (e) {
    if (e.message === 'Wrong email or password') {
      res.status(401).send({ message: e.message })
      return
    }

    logger.error(e)

    next(e)
  }
}

export const create = async (req: Request, res: Response, next) => {
  try {
    const { login, password, role, name } = req.body

    const hashedPassword = await hashPass(password)

    await UserModel.create({ login, role, name, password: hashedPassword })

    res.status(201).send()
  } catch (e) {
    logger.error(e)

    next(e)
  }
}

// getOne, getList

export const update = async (req: Request, res: Response, next) => {
  try {
    const { _id } = res.locals.user
    const { login, password, name } = req.body
    const patch = {}

    if (isString(login)) { set(patch, 'login', login) }
    if (isString(name)) { set(patch, 'name', name) }
    if (isString(password)) { set(patch, 'password', await hashPass(password)) }

    await UserModel.updateOne({ _id }, patch)

    res.status(204).send()
  } catch (e) {
    logger.error(e)

    next(e)
  }
}

export const remove = async (req: Request, res: Response, next) => {
  try {
    const { id } = req.params

    await UserModel.deleteOne({ _id: id })

    res.status(204).send()
  } catch (e) {
    logger.error(e)

    next(e)
  }
}

export const get = async (req: Request, res: Response, next) => {
  const select = '_id name login role createdAt updatedAt'
  try {
    const { id } = req.params

    if (req.path === '/me') {
      const user = await UserModel
        .findById(res.locals.user._id)
        .select(select)
        .exec()
      res.send(user)
      return
    }

    if (isString(id)) {
      const user = await UserModel
        .findById(id)
        .select(select)
        .exec()
      res.send(user)
      return
    }

    const additionalOptions = {
      select,
      pickCount: true,
      pickCountAll: true,
      sort: req.query.ordering ? req.query.ordering.replace(/,/g, ' ') : 'name',
    }

    const result = await findAndPaginate(UserModel, { ...req.query, ...additionalOptions })

    res.send(result)
  } catch (e) {
    logger.error(e)

    next(e)
  }
}
