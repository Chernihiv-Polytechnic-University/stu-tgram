import * as mongoose from 'mongoose'

const SIZE_2GB = 1024 * 1024 * 2e3

export interface MetricRecordAttributes {
  value: number
  timestamp: number,
  header: string,
}

export interface MetricHeaderAttributes {
  name: string
}

export interface MetricHeader extends MetricHeaderAttributes, mongoose.Document {}
export interface MetricRecord extends MetricRecordAttributes, mongoose.Document {}

const headerSchema = new mongoose.Schema({
  name: { type: String, index: true, unique: true },
}, {
  collection: 'MetricHeader',
  autoIndex: true,
  timestamps: true,
})

const recordSchema = new mongoose.Schema({
  value: { type: Number },
  timestamp: { type: Number },
  header: { type: mongoose.Schema.Types.ObjectId, index: true, required: true },
}, {
  collection: 'MetricRecord',
  autoIndex: true,
  capped: { size: SIZE_2GB, max: 1e9 },
})

export const MetricHeaderModel = mongoose.model<MetricHeader>('MetricHeaderModel', headerSchema)
export const MetricRecordModel = mongoose.model<MetricRecord>('MetricRecordModel', recordSchema)
