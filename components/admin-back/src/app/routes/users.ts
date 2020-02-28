import { Router } from 'express'
import { InitRoutes } from './index'
import { login, logout, create, update, remove, get } from '../handlers/users'
import { authMiddleware, createScopeMiddleware } from '../services/auth'

export const initRoutes: InitRoutes = async () => {
  const router = Router()

  router.post('/login', login)
  router.post('/logout', logout)

  router.patch('/me', authMiddleware, update)
  router.get('/me', authMiddleware, get)

  router.post('/', authMiddleware, createScopeMiddleware(['a']), create)
  router.delete('/:id', authMiddleware, createScopeMiddleware(['a']), remove)
  router.get(['/:id', '/'], authMiddleware, createScopeMiddleware(['a']), get)

  return router
}
