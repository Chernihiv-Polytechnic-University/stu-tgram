import * as telegram from 'node-telegram-bot-api'
import { difference, get, uniq } from 'lodash'
import { TelegramUserRole, StudentsGroupModel } from 'libs/domain-model'
import {
  buildSettingKeyboardResponse,
  buildCustomKeyboardResponse,
  MAIN_KEYBOARD_TEXT_IDS,
  REQUIRED_MAIN_KEYBOARD_TEXT_IDS,
} from '../utils/build-keyboard'
import { Handler, Message } from '../types'
import { buildText } from '../utils/text-builder'

const REMOVE_KEY_REGEXP = new RegExp(buildText('removeKeyMatchRegexp'))
const ADD_KEY_REGEXP = new RegExp(buildText('addKeyMatchRegexp'))

export const handleGetSettingsEvent: Handler = async (bot: telegram, msg: Message) => {
  const { role, name, groupId } = msg.locals.user
  const userType = role === TelegramUserRole.teacher
    ? buildText('teacher').toLowerCase()
    : buildText('student').toLowerCase()

  if (role === TelegramUserRole.teacher) {
    await bot.sendMessage(msg.tMessage.chat.id, buildText('userTeacherInfo1', { userType, name }))
    await bot.sendMessage(msg.tMessage.chat.id, buildText('sayYourTeacherNameExample'))
    await bot.sendMessage(msg.tMessage.chat.id, buildText('userTeacherInfo2'))
    await bot.sendMessage(msg.tMessage.chat.id, buildText('sayYourGroupExample'))
  } else {
    const group = await StudentsGroupModel.findOne({ _id: groupId })
      .select('name subgroupNumber')
      .exec()
    const groupText = group ? `${group.name}:${group.subgroupNumber}` : buildText('notSpecified')
    await bot.sendMessage(msg.tMessage.chat.id, buildText('userStudentInfo1', { userType, group: groupText }))
    await bot.sendMessage(msg.tMessage.chat.id, buildText('sayYourGroupExample'))
    await bot.sendMessage(msg.tMessage.chat.id, buildText('userStudentInfo2'))
    await bot.sendMessage(msg.tMessage.chat.id, buildText('sayYourTeacherNameExample'))
  }

  await bot.sendMessage(msg.tMessage.chat.id, buildText('pickFunction'), { reply_markup:  buildSettingKeyboardResponse() } as any)
}

export const handleSetupUpdateKeyboard = (isKeyboardUpdateHandler: boolean): Handler => async (bot: telegram, msg: Message) => {
  const { user } = msg.locals
  const { telegram: { keyboard } } = user

  const removeKey = get(msg.tMessage.text.match(REMOVE_KEY_REGEXP), '[1]', '').trim()
  const addKey = get(msg.tMessage.text.match(ADD_KEY_REGEXP), '[1]', '').trim()

  console.log({ removeKey, addKey, r: msg.tMessage.text.match(REMOVE_KEY_REGEXP) })

  if (keyboard.length === 0) {
    user.set('telegram.keyboard', MAIN_KEYBOARD_TEXT_IDS)
  }

  if (removeKey) {
    const removeKeyTextId = MAIN_KEYBOARD_TEXT_IDS.find(id => buildText(id) === removeKey)
    const keyboard = difference(user.telegram.keyboard, [removeKeyTextId])
    user.set('telegram.keyboard', keyboard)
  }

  if (addKey) {
    const addKeyTextId = MAIN_KEYBOARD_TEXT_IDS.find(id => buildText(id) === addKey)
    const keyboard = uniq([...user.telegram.keyboard, addKeyTextId])
    user.set('telegram.keyboard', keyboard)
  }

  await user.save()

  const keyboardWithActions = difference(MAIN_KEYBOARD_TEXT_IDS, REQUIRED_MAIN_KEYBOARD_TEXT_IDS)
    .map(key => user.telegram.keyboard.includes(key)
      ? `${buildText(key)} ${buildText('removeKey')}`
      : `${buildText(key)} ${buildText('addKey')}`,
  )

  await bot.sendMessage(
    msg.tMessage.chat.id,
    isKeyboardUpdateHandler ? buildText('okay') : buildText('removeAddKeys'),
    { reply_markup:  buildCustomKeyboardResponse('panel', [...keyboardWithActions, buildText('back')], 1) } as any,
  )
}
