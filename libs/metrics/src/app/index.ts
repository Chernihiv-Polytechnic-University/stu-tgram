// TODO find the way to avoid Error: document is larger than the maximum size 16777216
import { MetricModel, MetricAttributes, MetricData } from 'libs/domain-model'

export interface MetricSaveInput {
  timestamp?: number,
  value: number
}

export interface MetricHandler {
  count(input: MetricSaveInput): void
  save(): Promise<void>
}

const createCount = (dataStore: MetricData[]) => (input: MetricSaveInput) => {
  const timestamp = input.timestamp || Date.now()
  dataStore.push({ timestamp, value: input.value })
}

const createSave = (dataStore: MetricData[], workingMetricId: any) => async () => {
  await MetricModel.updateOne({ _id: workingMetricId }, { $push: { data: { $each: dataStore } } })
  dataStore.splice(0, dataStore.length)
}

export const createMetric = async (name: string): Promise<MetricHandler> => {
  const metric: MetricAttributes = { name, isOld: false }
  let workingMetric = await MetricModel
    .findOne(metric)
    .select('_id name')
    .exec()
  if (!workingMetric) {
    workingMetric = await MetricModel.create(metric)
  }
  const data = []
  return {
    count: createCount(data),
    save: createSave(data, workingMetric._id),
  }
}
