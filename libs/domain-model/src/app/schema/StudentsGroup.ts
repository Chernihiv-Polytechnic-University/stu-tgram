import * as mongoose from 'mongoose'
import { Group } from './common'

export interface EducationWeekData {
  start: number
  end: number
  number: number
  column: number
  month: string
  isOdd: boolean
  group: string
  row: string
  definition: string
  realDefinition: string
}

export interface StudentsGroupAttributes extends Group {
  lessonsScheduleImage?: Buffer
  educationScheduleImage?: Buffer
  educationSchedule?: EducationWeekData[]
}

export interface StudentsGroup extends StudentsGroupAttributes, mongoose.Document {}

const schema = new mongoose.Schema({
  name: { type: String, required: true },
  subgroupNumber: { type: Number, required: true, enum: [1, 2] },
  lessonsScheduleImage: { type: Buffer },
  educationScheduleImage: { type: Buffer },
  educationSchedule: [{
    _id: false,
    start: Number,
    end: Number,
    number: Number,
    column: Number,
    month: String,
    isOdd: Boolean,
    group: String,
    row: String,
    definition: String,
    realDefinition: String,
  }],
}, {
  collection: 'StudentsGroup',
  autoIndex: true,
  timestamps: true,
})

schema.index({ name: 1, subgroupNumber: 1 }, { unique: true })

export const StudentsGroupModel = mongoose.model<StudentsGroup>('StudentsGroupModel', schema)
