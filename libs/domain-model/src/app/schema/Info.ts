import * as mongoose from 'mongoose'
import { File } from './common'

export interface Text {
  question: string,
  answer: string,
  language: string,
}

export interface InfoAttributes {
  code: string,
  texts: Text[],
  onlyText: boolean,
  files?: File[],
}

export interface Info extends InfoAttributes, mongoose.Document {}

const schema = new mongoose.Schema({
  code: { type: String, required: true, index: true, unique: true },
  texts: [{
    question: { type: String, required: true },
    answer: { type: String, required: true },
    language: { type: String, required: true },
  }],
  onlyText: { type: String, default: true },
  files: [{
    isDoc: { type: String, default: false },
    isPhoto:  { type: String, default: false },
    name: { type: String, required: true },
    data: { type: mongoose.Schema.Types.Buffer, required: true },
  }],
}, {
  collection: 'Info',
  autoIndex: true,
  timestamps: true,
})

export const InfoModel = mongoose.model<Info>('InfoModel', schema)
