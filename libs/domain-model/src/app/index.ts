import * as mongoose from 'mongoose'

export * from './schema/User'
export * from './schema/Info'
export * from './schema/Request'
export * from './schema/TelegramUser'

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
