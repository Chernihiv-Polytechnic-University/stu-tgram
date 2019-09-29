import * as mongoose from 'mongoose'

const READY_STATE_CONNECTED = 1

export * from './schema/User'
export * from './schema/Info'
export * from './schema/Request'
export * from './schema/TelegramUser'
export * from './schema/Log'
export * from './schema/Lesson'
export * from './schema/Metric'
export * from './schema/StudentsGroup'
export * from './schema/SystemSettings'
export * from './schema/Feedback'

export interface ConnectConfig {
  host: string
  database: string
  user: string
  password: string
}

export const connect = (config: ConnectConfig): Promise<any> => {
  return  mongoose.connect(`mongodb://${config.host}/${config.database}`, {
    authSource: 'admin',
    user: config.user,
    pass: config.password,
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false,
  })
}

export const checkIsConnected = () => mongoose.connection.readyState === READY_STATE_CONNECTED

export { mongoose }
