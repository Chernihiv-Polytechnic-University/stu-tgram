import * as mongoose from 'mongoose'

export interface FeedbackAttributes {
  text: string,
  telegramUserId: string
}

export interface Feedback extends FeedbackAttributes, mongoose.Document {}

const schema = new mongoose.Schema({
  text: { type: String, required: true },
  telegramUserId: { type: String, required: true, index: true },
}, {
  collection: 'Feedback',
  autoIndex: true,
  timestamps: true,
})

export const FeedbackModel = mongoose.model<Feedback>('FeedbackModel', schema)
