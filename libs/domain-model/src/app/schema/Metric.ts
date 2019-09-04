// TODO can be broken by Error: document is larger than the maximum size 16777216, find the way to avoid it
// TODO labels??
import * as mongoose from 'mongoose'

export interface MetricData {
  value: number
  timestamp: number,
}

export interface MetricAttributes {
  name: string
  isOld: boolean
  data?: [MetricData],
}

export interface Metric extends MetricAttributes, mongoose.Document {}

const schema = new mongoose.Schema({
  name: { type: String, index: true, required: true },
  isOld:  { type: Boolean, default: false },
  data: [{
    value: { type: Number, required: true },
    timestamp: { type: Number, required: true },
  }],
}, {
  collection: 'Metric',
  autoIndex: false,
  timestamps: true,
  capped: { size: 1024 * 1024 * 100, max: 1e5 },
})

export const MetricModel = mongoose.model<Metric>('MetricModel', schema)
