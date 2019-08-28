import * as mongoose from 'mongoose'

export enum TelegramUserRole {
  student = 's',
  teacher = 't',
}

export interface TelegramUserAttributes {
  realName: string,
  telegramName: string,
  telegramUsername: string,
  role: TelegramUserRole,
}

export interface TelegramUser extends TelegramUserAttributes, mongoose.Document {}

const schema = new mongoose.Schema({
  name: { type: String, required: true, index: true },
  telegramName: { type: String, required: true, index: true },
  telegramUsername: { type: String, required: true },
  role: { type: String, enum: ['s', 't'], default: 's' },
}, {
  collection: 'TelegramUser',
  autoIndex: true,
  timestamps: true,
})

export const TelegramUserModel = mongoose.model<TelegramUser>('TelegramUserModel', schema)
