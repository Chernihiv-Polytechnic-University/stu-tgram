import * as telegram from 'node-telegram-bot-api'
import { createLogger } from 'libs/logger'
import { createMetric } from 'libs/metrics'
import { Handler, HandlerResult, Message } from '../types'

const logger = createLogger(`#middleware/buildHandler`)

export default (bot:telegram, ...handlers: Handler[]) => async (labels: string[]) => {
  const invocations = await createMetric(`${labels.join('_')}_invocations_count`)
  const duration = await createMetric(`${labels.join('_')}_duration`)
  const errors = await createMetric(`${labels.join('_')}_errors`)
  return async (originalTMessage: telegram.Message) => {
    logger.info(labels, 'event received', { messageId: originalTMessage.message_id })
    const startedAt = Date.now()
    if (handlers.length < 1) {
      throw new Error('No handlers specified!')
    }
    const msg: Message = {
      tMessage: originalTMessage,
      locals: {},
    }
    try {
      for (let i = 0; i < handlers.length; i += 1) {
        const result = await handlers[i](bot, msg)
        if (result === HandlerResult.STOP) {
          break
        }
      }
      logger.info(labels, 'event processed', { messageId: originalTMessage.message_id })
      await Promise.all([duration.countAndSave({ value: Date.now() - startedAt }), invocations.countAndSave({ value: 1 })])
    } catch (e) {
      logger.error(labels, 'error', e)
      await errors.countAndSave({ value: 1 })
    }
  }
}
