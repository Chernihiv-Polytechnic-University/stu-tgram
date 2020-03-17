import * as telegram from 'node-telegram-bot-api'
import { get, isNil } from 'lodash'
import { TelegramUserModel, StudentsGroupModel, StudentsGroup, TelegramUserStatus } from 'libs/domain-model'
import { buildText } from '../utils/text-builder'
import { Handler, Message } from '../types'

const SET_GROUP_REGEXP = buildText('myGroupParseRegexp')

const getGroupByText = async (groupText: string): Promise<StudentsGroup | never> => {
  const [groupName, subgroupNumber] = groupText.split(':')
  const group = await StudentsGroupModel
    .findOne({ subgroupNumber, name: groupName.replace(/ /g, '') }, { _id: 1 })
    .exec()
  return group
}

export const handleSetGroupEvent: Handler = async (bot: telegram, msg: Message) => {
  const { _id, telegram: { firstName, lastName } } = msg.locals.user
  const { text: msgText } = msg.tMessage
  const groupText = get(msgText.match(SET_GROUP_REGEXP), '[1]')
  if (isNil(groupText)) {
    await bot.sendMessage(msg.tMessage.chat.id, buildText('wrongGroup'))
    return
  }
  const group = await getGroupByText(groupText.toUpperCase())
  if (isNil(group)) {
    await bot.sendMessage(msg.tMessage.chat.id, buildText('groupNotFound', { groupText }))
    return
  }
  await TelegramUserModel.updateOne({ _id }, { $set: { groupId: group._id, status: TelegramUserStatus.partialKnown } })
  await bot.sendMessage(msg.tMessage.chat.id,  buildText('groupSet', { groupText }))
}
