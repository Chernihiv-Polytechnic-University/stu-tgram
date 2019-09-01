import * as mongoose from 'mongoose'

export interface LessonAttributes {
  isExist: boolean,
  course: number,
  number: number,
  day: string,
  name?: string,
  auditory?: string,
  week: number,
  group: {
    name: string,
    subgroupNumber: number,
  },
  teacher?: {
    name?: string,
  },
}

export interface Lesson extends LessonAttributes, mongoose.Document {}

const schema = new mongoose.Schema({
  isExist: { type: Boolean, default: false },
  course: { type: Number, default: 0 },
  number: { type: Number, default: -1 },
  day: { type: String },
  name: { type: String },
  auditory: { type: String },
  week: { type: Number, default: 0, enum: [0, 1] },
  group: {
    name: { type: String },
    part: { type: Number, default: 0, enum: [0, 1] },
  },
  teacher: {
    name: { type: String },
  },
}, {
  collection: 'Lesson',
  autoIndex: true,
  timestamps: true,
})

export const LessonModel = mongoose.model<Lesson>('LessonModel', schema)
