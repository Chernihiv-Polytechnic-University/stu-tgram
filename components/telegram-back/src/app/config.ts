import * as dotenv from 'dotenv'
import * as createConfig from 'convict'

if (process.env.DOT_ENV) {
  dotenv.config({ path: process.env.DOT_ENV })
} else {
  dotenv.config()
}

const schema = {
  BOT_TOKEN: {
    format: String,
    env: 'BOT_TOKEN',
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
