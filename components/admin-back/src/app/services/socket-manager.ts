import { Server } from 'socket.io'
import { Request, Response } from 'express'

export type SocketEvent = 'png_compiling'

export const init = (io: Server) => {
  io.on('connect', (socket => socket.emit('connect')))

  return {
    middleware (req: Request, res: Response, next) {
      res.locals.socket = {
        emit (event: SocketEvent, data: any) { io.emit(event, data) },
      }
      next()
    },
  }
}
