import { Router } from 'express'
import { InitRoutes } from './index'
import {  get } from '../handlers/feedbacks'
import { authMiddleware, createScopeMiddleware } from '../services/auth'

export const initRoutes: InitRoutes = async () => {
  const router = Router()

  router.use(authMiddleware)
  router.get(['/:id', '/'], authMiddleware, get)

  return router
}
