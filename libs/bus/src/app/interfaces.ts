export interface Command {
  command: string,
  payload?: { [key: string]: any }
}

export interface Logger {
  info: (...args: any) => void
  error: (...args: any) => void
}

export interface CreateListenerConfig {
  logger: Logger,
  port: number
}

export interface CreateSenderConfig {
  serviceDomain: string,
  servicePort: number,
}

export interface Sender {
  send: (command: Command) => Promise<void>
}
