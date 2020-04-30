import { Router } from 'express'
import { InitRoutes } from './index'
import { create, update, remove, get, getCategories } from '../handlers/info'
import { authMiddleware } from '../services/auth'

export const initRoutes: InitRoutes = async () => {
  const router = Router()

  router.post('/', authMiddleware, createScopeMiddleware(['a']), create)
  router.delete('/:id', authMiddleware, createScopeMiddleware(['a']), remove)
  router.delete('/:id', authMiddleware, createScopeMiddleware(['a']), update)
  router.get(['/:id', '/'], authMiddleware, createScopeMiddleware(['a']), get)

  return router
}
