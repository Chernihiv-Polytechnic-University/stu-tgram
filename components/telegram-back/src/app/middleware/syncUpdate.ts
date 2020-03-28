import * as telegram from 'node-telegram-bot-api'
import { Handler, Message } from '../types'
import { buildMainKeyboardResponse, KEYBOARD_TEXT_IDS_TO_REMOVE, MAIN_KEYBOARD_TEXT_IDS } from '../utils/build-keyboard'
import { buildText } from '../utils/text-builder'

const SYSTEM_VERSION = 1

const handler: Handler = async (bot: telegram, msg: Message) => {
  const { user } = msg.locals

  if (!user.lastSystemVersion || user.lastSystemVersion < SYSTEM_VERSION) {
    // private chat + actual keyboard
    const { keyboard } = user.telegram
    user.telegram = {
      ...user.telegram,
      privateChatId: msg.tMessage.chat.id,
      keyboard: keyboard && keyboard.length
        ? keyboard.filter(k => !KEYBOARD_TEXT_IDS_TO_REMOVE.includes(k))
        : MAIN_KEYBOARD_TEXT_IDS,
    }
    user.lastSystemVersion = SYSTEM_VERSION

    await bot.sendMessage(msg.tMessage.chat.id, buildText('processing'), { reply_markup: buildMainKeyboardResponse('panel', keyboard) } as any)
    await user.save()
  }
}

export default handler
