import * as mongoose from 'mongoose'

export enum TelegramUserRole {
  student = 's',
  teacher = 't',
}

export enum TelegramUserStatus {
  unknown = 'u',
  partialKnown = 'p',
  fullKnown = 'f',
}

export enum TelegramUserSessionAction {
  feedback = 'fb',
  infoCategories = 'ic',
  infoCategoryQuestions = 'iq',
  setGroup = 'sg',
}

export interface TelegramData {
  id: number
  firstName: string
  lastName: string
  username: string
  privateChatId?: number
  keyboard?: string[]
}

export interface TelegramUserSession {
  action: TelegramUserSessionAction,
  step: number
}

export interface TelegramUserAttributes {
  name?: string
  groupId?: string
  status: TelegramUserStatus
  code?: string
  telegram: TelegramData
  role?: TelegramUserRole
  session?: TelegramUserSession
  lastSystemVersion?: number
}

export interface TelegramUser extends TelegramUserAttributes, mongoose.Document {}

const schema = new mongoose.Schema({
  name: { type: String },
  groupId: { type: String, index: true },
  status: { type: String, enum: ['u', 'p', 't'], default: 'u' },
  role: { type: String, enum: ['s', 't'], default: 's' },
  code: { type: String },
  lastSystemVersion: { type: Number, default: 0 },
  telegram: {
    id: { type: Number, index: true, unique: true },
    firstName: { type: String },
    lastName: { type: String },
    username: { type: String },
    privateChatId: { type: Number, index: true },
    keyboard: [String],
  },
  session: {
    action: { type: String },
    step: { type: Number },
  },
}, {
  collection: 'TelegramUser',
  autoIndex: true,
  timestamps: true,
})

export const TelegramUserModel = mongoose.model<TelegramUser>('TelegramUserModel', schema)
