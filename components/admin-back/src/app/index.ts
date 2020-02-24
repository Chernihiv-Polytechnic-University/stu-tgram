import * as express from 'express'
import * as compress from 'compression'
import * as multer from 'multer'
import * as cors from 'cors'
import * as helmet from 'helmet'
import * as bodyParser from 'body-parser'
import * as cookieParser from 'cookie-parser'
import * as config from 'config'

import { connect } from 'libs/domain-model'
import { createLogger } from 'libs/logger'

import { initRoutes } from './routes'

const logger = createLogger('index')

const app: express.Express = express()
const uploader = multer({
  storage: multer.memoryStorage(),
  limits: { fieldSize: config.get('FILE_SIZE_LIMIT_BYTES') },
})

const connectToDb = () => connect({
  host: config.get('MONGODB.HOST'),
  database: config.get('MONGODB.DATABASE'),
  user: config.get('MONGODB.USER'),
  password: config.get('MONGODB.PASSWORD'),
})

const runApp = () => {
  app.use(cors({ credentials: true, origin: config.get('FRONT_URLS') }))
  app.use(helmet())
  app.use(cookieParser())
  app.use(compress())
  app.use(bodyParser.json({ limit: config.get('JSON_SIZE_LIMIT') }))
  initRoutes({ uploader })
    .then(router => app.use('/api/v1', router))
    .then(connectToDb)
    .then(() => new Promise((resolve, reject) => app.listen(config.get('APP_PORT'), (err) => { if (err) return reject(err); resolve() })))
    .then(() => logger.info([], `Server running on *:${config.get('APP_PORT')}`))
    .catch(err => logger.error([], err))
}

runApp()
