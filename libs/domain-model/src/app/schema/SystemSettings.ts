import * as mongoose from 'mongoose'

export interface SystemSettingsAttributes {
  firstOddWeekMondayDate: string // e.g., 2019-09-02
}

export interface SystemSettings extends SystemSettingsAttributes, mongoose.Document {}

const schema = new mongoose.Schema({
  firstOddWeekMondayDate: { type: String },
}, {
  collection: 'SystemSettings',
  autoIndex: true,
  timestamps: true,
})

export const SystemSettingsModel = mongoose.model<SystemSettings>('SystemSettingsModel', schema)
