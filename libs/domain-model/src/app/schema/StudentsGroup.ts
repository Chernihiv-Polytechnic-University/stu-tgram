import * as mongoose from 'mongoose'
import { Group } from './common'

export interface StudentsGroupAttributes extends Group {}

export interface StudentsGroup extends StudentsGroupAttributes, mongoose.Document {}

const schema = new mongoose.Schema({
  name: { type: String, required: true },
  subgroupNumber: { type: Number, required: true, enum: [1, 2] },
}, {
  collection: 'StudentsGroup',
  autoIndex: true,
  timestamps: true,
})

schema.index({ name: 1, subgroupNumber: 1 }, { unique: true })

export const StudentsGroupModel = mongoose.model<StudentsGroup>('StudentsGroupModel', schema)
