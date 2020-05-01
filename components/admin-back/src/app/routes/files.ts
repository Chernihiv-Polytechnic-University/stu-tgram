import { Router } from 'express'
import { InitRoutes } from './index'
import { uploadLessonsSchedule, uploadEducationProcessSchedule, compilePNGs } from '../handlers/files'
import { authMiddleware } from '../services/auth'

export const initRoutes: InitRoutes = async ({ uploader }) => {
  const router = Router()

  router.put('/schedule/upload-lessons', authMiddleware, uploader.single('schedule-xlsx'), uploadLessonsSchedule)
  router.put('/schedule/upload-education-process', authMiddleware, uploader.single('schedule-xlsx'), uploadEducationProcessSchedule)
  router.post('/schedule/compile-images', authMiddleware, compilePNGs)

  return router
}
