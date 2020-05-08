import { Router } from 'express'
import { InitRoutes } from './index'
import { get, update } from '../handlers/system-settings'
import { authMiddleware } from '../services/auth'

export const initRoutes: InitRoutes = async () => {
  const router = Router()

  router.use(authMiddleware)
  router.get(['/'], get)
  router.post(['/'], update)

  return router
}
