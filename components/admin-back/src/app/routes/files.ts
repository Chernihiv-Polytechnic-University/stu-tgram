import { Router } from 'express'
import { InitRoutes } from './index'
import { uploadSchedule } from '../handlers/files'

export const initRoutes: InitRoutes = async ({ uploader }) => {
  const router = Router()

  router.put('/schedule/upload', uploader.single('schedule-xlsx'), uploadSchedule)

  return router
}
