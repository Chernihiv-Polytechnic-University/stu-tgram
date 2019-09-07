import * as mongoose from 'mongoose'
import { Group } from './common'

export enum TelegramUserRole {
  student = 's',
  teacher = 't',
}

export enum TelegramUserStatus {
  unknown = 'u',
  partialKnown = 'p',
  fullKnown = 'f',
}

export interface TelegramData {
  id: number
  firstName: string
  lastName: string
  username: string
}

export interface TelegramUserAttributes {
  name?: string
  group?: Group
  status: TelegramUserStatus
  code?: string
  telegram: TelegramData
  role?: TelegramUserRole
}

export interface TelegramUser extends TelegramUserAttributes, mongoose.Document {}

const schema = new mongoose.Schema({
  name: { type: String },
  group: {
    name: { type: String, index: true },
    subgroupNumber: { type: Number, index: true },
  },
  status: { type: String, enum: ['u', 'p', 't'], default: 'u' },
  role: { type: String, enum: ['s', 't'], default: 's' },
  code: { type: String },
  telegram: {
    id: { type: Number, index: true, unique: true },
    firstName: { type: String },
    lastName: { type: String },
    username: { type: String },
  },
}, {
  collection: 'TelegramUser',
  autoIndex: true,
  timestamps: true,
})

export const TelegramUserModel = mongoose.model<TelegramUser>('TelegramUserModel', schema)
