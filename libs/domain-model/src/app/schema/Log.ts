import * as mongoose from 'mongoose'

export interface LogAttributes {
  timestamp: number
  name: string,
  data: any,
  labels: string[]
  level: number
}

export interface Log extends LogAttributes, mongoose.Document {}

const schema = new mongoose.Schema({
  timestamp: { type: Number, index: true },
  name: { type: String, index: true },
  data: { type: String },
  labels: { type: [String] },
  level: { type: Number },
}, {
  collection: 'Log',
  autoIndex: false,
  timestamps: true,
  capped: { size: 1024 * 1024 * 100, max: 1e5 },
})

export const LogModel = mongoose.model<Log>('LogModel', schema)
