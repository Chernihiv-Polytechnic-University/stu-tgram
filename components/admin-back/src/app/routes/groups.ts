import { Router } from 'express'
import { InitRoutes } from './index'
import {  get } from '../handlers/groups'
import { authMiddleware } from '../services/auth'

export const initRoutes: InitRoutes = async () => {
  const router = Router()

  router.get(['/:id', '/'], authMiddleware, get)

  return router
}
