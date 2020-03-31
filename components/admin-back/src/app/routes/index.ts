import { Instance as MulterInstance } from 'multer'
import { Router } from 'express'

import { initRoutes as initFilesRoutes } from './files'
import { initRoutes as initUserRoutes } from './users'
import { initRoutes as initFeedbacksRoutes } from './feedbacks'
import { initRoutes as initInfoRoutes } from './info'
import { initRoutes as initGroupsRoutes } from './groups'

export interface InitRoutesOptions {
  uploader?: MulterInstance,
}

export interface InitRoutes {
  (options: InitRoutesOptions): Promise<Router>
}

export const initRoutes: InitRoutes = async (options) => {
  const router = Router()

  router.use('/files', await initFilesRoutes(options))
  router.use('/users', await initUserRoutes(options))
  router.use('/feedbacks', await initFeedbacksRoutes(options))
  router.use('/info', await initInfoRoutes(options))
  router.use('/groups', await initGroupsRoutes(options))

  return router
}
