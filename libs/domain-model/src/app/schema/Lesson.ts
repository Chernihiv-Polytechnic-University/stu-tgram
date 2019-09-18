import * as mongoose from 'mongoose'

export type LessonDay = 'ПН' | 'ВТ' | 'СР' | 'ЧТ' | 'ПТ' | 'СБ'
export interface LessonAttributes {
  isExist: boolean,
  number: number,
  day: LessonDay,
  name?: string,
  auditory?: string,
  week: number,
  groupId: string,
  teacher?: {
    name?: string,
  },
}

export interface Lesson extends LessonAttributes, mongoose.Document {}

const schema = new mongoose.Schema({
  isExist: { type: Boolean, default: false },
  number: { type: Number, default: -1 },
  day: { type: String, enum: ['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ'] },
  name: { type: String },
  auditory: { type: String },
  week: { type: Number, default: 0, enum: [0, 1] },
  groupId: { type: String, index: true },
  teacher: {
    name: { type: String },
  },
}, {
  collection: 'Lesson',
  autoIndex: true,
  timestamps: true,
})

export const LessonModel = mongoose.model<Lesson>('LessonModel', schema)
