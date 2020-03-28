import * as mongoose from 'mongoose'

export interface InfoAttributes {
  question: string
  answer: string
  category: string
}

export interface InfoCategoryAttributes {
  category: string
  questionsCount: number
}

export interface Info extends InfoAttributes, mongoose.Document {}

const schema = new mongoose.Schema({
  question: { type: String, index: true },
  category: { type: String, index: true },
  answer: { type: String },
}, {
  collection: 'Info',
  autoIndex: true,
  timestamps: true,
})

// tslint:disable-next-line:only-arrow-functions
schema.statics.findCategories = function (limit: number, skip: number) {
  const pipeline: any[] = [
    { $group: { _id: '$category', questionsCount: { $sum: 1 } } },
    { $project: { category: '$_id', questionsCount: '$questionsCount' } },
  ]

  if (limit) { pipeline.push({ $limit: limit }) }
  if (skip) { pipeline.push({ $skip: skip }) }

  return this.aggregate(pipeline)
}

export const InfoModel = mongoose.model<Info>('InfoModel', schema)
