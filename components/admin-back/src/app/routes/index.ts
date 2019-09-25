import { Instance as MulterInstance } from 'multer'
import { Router } from 'express'

import { initRoutes as initFilesRoutes } from './files'

export interface InitRoutesOptions {
  uploader?: MulterInstance,
}

export interface InitRoutes {
  (options: InitRoutesOptions): Promise<Router>
}

export const initRoutes: InitRoutes = async (options) => {
  const router = Router()

  router.use('/files', await initFilesRoutes(options))

  return router
}
