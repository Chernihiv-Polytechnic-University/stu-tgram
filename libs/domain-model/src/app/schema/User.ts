import * as mongoose from 'mongoose'

export enum UserRole {
  manager = 'm',
  admin = 'a',
}

export interface UserAttributes {
  name: string,
  login: string,
  password: string,
  role: UserRole,
}

export interface User extends UserAttributes, mongoose.Document {}

const schema = new mongoose.Schema({
  name: { type: String, required: true, index: true },
  login: { type: String, required: true, index: true, unique: true },
  password:{ type: String, required: true },
  role: { type: String, enum: ['a', 'm'], default: 'm' },
}, {
  collection: 'User',
  autoIndex: true,
  timestamps: true,
})

export const UserModel = mongoose.model<User>('UserModel', schema)
