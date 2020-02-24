import * as telegram from 'node-telegram-bot-api'
import { TelegramUser } from 'libs/domain-model'

export enum HandlerResult {
  NEXT,
  STOP,
}

export type Handler = (bot: telegram, msg: Message) => Promise<HandlerResult | void>

export interface Message {
  tMessage: telegram.Message,
  locals: {
    user?: TelegramUser,
  }
}
