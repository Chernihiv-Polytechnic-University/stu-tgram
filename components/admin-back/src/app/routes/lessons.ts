import { Router } from 'express'
import { InitRoutes } from './index'
import { farmLessons } from '../handlers/lessons'
import { authMiddleware } from '../services/auth'

export const initRoutes: InitRoutes = async () => {
  const router = Router()

  router.post('/farm/for-students', authMiddleware, farmLessons('students'))
  router.post('/farm/for-teachers', authMiddleware, farmLessons('teachers'))

  return router
}
