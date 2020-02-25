import { Router } from 'express'
import { InitRoutes } from './index'
import { uploadLessonsSchedule, uploadEducationProcessSchedule, compileSchedulePNGs } from '../handlers/files'
import { authMiddleware, createScopeMiddleware } from '../services/auth'

export const initRoutes: InitRoutes = async ({ uploader }) => {
  const router = Router()

  router.use(authMiddleware, createScopeMiddleware(['a', 'm']))
  router.put('/schedule/upload-lessons', uploader.single('schedule-xlsx'), uploadLessonsSchedule)
  router.put('/schedule/upload-education-process', uploader.single('schedule-xlsx'), uploadEducationProcessSchedule)
  router.post('/schedule/compile-groups-images', compileSchedulePNGs)

  return router
}
