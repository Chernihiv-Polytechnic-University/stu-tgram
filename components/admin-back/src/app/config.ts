import * as dotenv from 'dotenv'
import * as createConfig from 'convict'

if (process.env.DOT_ENV) {
  dotenv.config({ path: process.env.DOT_ENV })
} else {
  dotenv.config()
}

const schema = {
  APP_PORT: {
    format:  Number,
    env: 'APP_PORT',
    default: 3000,
  },
  FILE_SIZE_LIMIT_BYTES: {
    format: Number,
    env: 'FILE_SIZE_LIMIT_BYTES',
  },
  JSON_SIZE_LIMIT: {
    format: String,
    env: 'JSON_SIZE_LIMIT',
    default: '25kb',
  },
  USE_PROXY: {
    format: Boolean,
    env: 'USE_PROXY',
    default: false,
  },
  AUTH_COOKIES_LIFETIME: {
    format: Number,
    env: 'AUTH_COOKIES_LIFETIME',
    default: 3600000,
  },
  AUTH_COOKIES_NAME: {
    format: String,
    env: 'AUTH_COOKIES_NAME',
    default: 'authorization',
  },
  JWT_LIFE_TIME: {
    format: Number,
    env: 'JWT_LIFE_TIME',
    default: 36000000,
  },
  JWT_SECRET: {
    format: String,
    env: 'JWT_SECRET',
    default: null,
  },
  MONGO_HOST: {
    format: String,
    env: 'MONGO_HOST',
    default: 'localhost',
  },
  MONGO_DATABASE: {
    format: String,
    env: 'MONGO_DATABASE',
    default: 'CNTU_UCSDOSSG',
  },
  MONGO_USER: {
    format: String,
    env: 'MONGO_USER',
    default: 'root',
  },
  MONGO_PASSWORD: {
    format: String,
    env: 'MONGO_PASSWORD',
    default: 'zxc123zxc123plkjn',
  },
}

const initConfig = <T>(definitions: T): (name: keyof T) => any => {
  const config = createConfig(definitions)

  config.validate({ allowed: 'strict' })

  return name => config.get(name as string)
}

export default initConfig(schema)
