import * as mongoose from 'mongoose'
import { File } from './common'

export enum RequestStatus {
  pending = 'p',
  consideration = 'c',
  done = 'd',
}

export interface RequestAttributes {
  text: string,
  onlyText: boolean,
  status: RequestStatus,
  requesterId: string,
  files?: File[],
}

export interface Request extends RequestAttributes, mongoose.Document {}

const schema = new mongoose.Schema({
  text: { type: String, required: true },
  onlyText: { type: Boolean, default: true },
  role: { type: String, enum: ['p', 'c', 'd'], default: 'p' },
  requesterId: { type: String, required: true },
  files: [{
    name: { type: String, required: true },
    data: { type: mongoose.Schema.Types.Buffer, required: true },
  }],
}, {
  collection: 'Request',
  autoIndex: true,
  timestamps: true,
})

export const RequestModel = mongoose.model<Request>('RequestModel', schema)
