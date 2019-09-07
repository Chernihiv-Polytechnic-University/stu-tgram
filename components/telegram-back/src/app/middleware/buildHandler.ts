import * as telegram from 'node-telegram-bot-api'
import { Handler, HandlerResult, Message } from '../types'

export default (bot:telegram, ...handlers: Handler[]) => async (originalTMessage: telegram.Message) => {
  if (handlers.length < 1) {
    throw new Error('No handlers specified!')
  }
  const msg: Message = {
    tMessage: originalTMessage,
    locals: {},
  }
  try {
    for (let i = 0; i < handlers.length; i += 1) {
      console.log('handler', i + 1)
      const result = await handlers[i](bot, msg)
      if (result === HandlerResult.STOP) {
        break
      }
    }
  } catch (e) {
    console.log(e)
    // TODO CRITICAL: metrics, loggin
  }
}
