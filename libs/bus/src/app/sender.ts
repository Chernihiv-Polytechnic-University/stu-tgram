import * as http from 'http'
import { Command, CreateSenderConfig, Sender } from './interfaces'

export const createSender = (config: CreateSenderConfig): Sender => ({
  send: (command: Command) => {
    const requestOptions: http.RequestOptions = {
      method: 'POST',
      host: config.serviceDomain,
      port: config.servicePort,
      path: '/',
    }

    return new Promise((resolve, reject) => {
      const request = http.request(requestOptions)

      request.on('finish', resolve)
      request.on('error', reject)

      request.write(JSON.stringify(command))
      request.end()
    })
  },
})
