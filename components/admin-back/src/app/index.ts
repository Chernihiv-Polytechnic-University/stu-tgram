import { createServer } from 'http'
import * as initExpress from 'express'
import * as initSocket from 'socket.io'
import * as compress from 'compression'
import * as multer from 'multer'
import * as cors from 'cors'
import * as helmet from 'helmet'
import * as bodyParser from 'body-parser'
import * as cookieParser from 'cookie-parser'
import * as config from 'config'
import { timeout } from './middlewares/timeout'
import { trace } from './middlewares/trace'
import { logOnResponse } from './middlewares/log-on-end'
import { init as initSocketManager } from './services/socket-manager'

import { connect } from 'libs/domain-model'
import { createLogger } from 'libs/logger'

import { initRoutes } from './routes'

const logger = createLogger('index')

const app = initExpress()
const server = createServer(app)
const socket = initSocket(server)

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
  app.use(cors())
  app.use(helmet())
  app.use(cookieParser())
  app.use(compress())
  app.use(timeout(60 * 30))
  app.use(trace)
  app.use(logOnResponse(logger))
  app.use(initSocketManager(socket).middleware)
  app.use(bodyParser.json({ limit: config.get('JSON_SIZE_LIMIT') }))
  initRoutes({ uploader })
    .then(router => app.use('/api/v1', router))
    .then(connectToDb)
    .then(server.listen(config.get('APP_PORT')) as any)
    .then(() => logger.info([], `Server running on *:${config.get('APP_PORT')}`))
    .catch(err => logger.error([], err))
}

runApp()
