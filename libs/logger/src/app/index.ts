import { LogModel, checkIsConnected, LogAttributes } from 'libs/domain-model'

export type Logger = {
  info: (labels: string[], ...args: any[]) => void
  warn: (labels: string[], ...args: any[]) => void
  error: (labels?: string[], ...args: any[]) => void
}

const log = (name: string, labels: string[], level, ...args) => {
  const log: LogAttributes = {
    name,
    labels,
    level,
    timestamp: Date.now(),
    data: JSON.stringify(args.map((e) => {
      if (e instanceof Error) {
        return e.stack
      }
      if (typeof e === 'object') {
        return JSON.stringify(e)
      }
      return e.toString()
    })),
  }
  console.dir(log, { depth: 4 })
  LogModel.create(log).catch(e => console.error(e))
}

export const createLogger = (name: string, level: 'info' | 'warn' | 'error' | null = 'info'): Logger => {
  const mongoIsConnected = checkIsConnected()
  if (mongoIsConnected) {
    throw new Error('Connect to DB before using logger')
  }
  return {
    info: (labels: string[], ...args) => {
      if (level === 'info') {
        log(name, labels, 3, ...args)
      }
    },
    warn: (labels: string[], ...args) => {
      if (level === null || level === 'error') {
        return
      }
      log(name, labels, 2, ...args)
    },
    error: (labels: string[] = [], ...args) => {
      if (level === null) {
        return
      }
      log(name, labels, 1, ...args)
    },
  }
}
