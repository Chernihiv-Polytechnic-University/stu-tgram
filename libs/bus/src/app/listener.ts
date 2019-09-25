import * as http from 'http'
import * as bodyParser from 'body-parser'

import { Command, CreateListenerConfig } from './interfaces'

const parseJson = bodyParser.json()

const getCommand = (req, res): Promise<Command> => new Promise((resolve, reject) => {
  parseJson(req, res, (err) => {
    if (err) {
      reject(err)
      return
    }
    resolve(req.body)
  })
})

export const createListener = (config: CreateListenerConfig, handleCommand: (command: Command) => void) => {
  const server = http.createServer(async (req, res) => {
    if (req.url !== '/' || req.method !== 'POST') {
      res.writeHead(404)
      res.write('Not Found Error')
      res.end()
      return
    }
    try {
      const command = await getCommand(req, res)
      handleCommand(command)
    } catch (err) {
      config.logger.error(`Bus Listener Request Error: ${err.message}`, err)
    } finally {
      res.end()
    }
  })

  server.listen(config.port, () => {
    config.logger.info(`Bus listener is running on *:${config.port}`)
  })

  server.on('error', (err) => {
    config.logger.error(`Bus Listener Server Error: ${err.message}`, err)
  })
}
