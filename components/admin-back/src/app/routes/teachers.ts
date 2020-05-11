import { Router } from 'express'
import { InitRoutes } from './index'
import { get } from '../handlers/teachers'
import { authMiddleware } from '../services/auth'

export const initRoutes: InitRoutes = async () => {
  const router = Router()

  router.get(['/:id', '/'], authMiddleware, get)
  // TODO can't work due to the way to collect this data
  // Users should ask about changing teacher data in STU schedule DB and then refarm teachers / students schedule
  // router.patch('/:id', authMiddleware, update)

  return router
}
