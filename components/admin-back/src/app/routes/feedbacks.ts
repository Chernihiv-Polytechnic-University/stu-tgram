import { Router } from 'express'
import { InitRoutes } from './index'
import {  get } from '../handlers/feedbacks'
import { authMiddleware } from '../services/auth'

export const initRoutes: InitRoutes = async () => {
  const router = Router()

  router.use(authMiddleware)
  router.get(['/:id', '/'], get)

  return router
}
