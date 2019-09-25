import { MetricHeaderModel, MetricRecordModel, MetricHeaderAttributes, MetricRecordAttributes } from 'libs/domain-model'

export interface MetricCountInput {
  timestamp?: number,
  value: number
}

export interface MetricHandler {
  count(input: MetricCountInput): void
  save(): Promise<void>
  countAndSave(input: MetricCountInput): Promise<void>
}

const createCount = (dataStore: Partial<MetricRecordAttributes>[]) => (input: MetricCountInput) => {
  const timestamp = input.timestamp || Date.now()
  dataStore.push({ timestamp, value: input.value })
}

const createSave = (dataStore: MetricRecordAttributes[], workingMetricId: any) => async () => {
  await MetricRecordModel.create(dataStore.map(e => ({ ...e, header: workingMetricId })))
  dataStore.splice(0, dataStore.length)
}

export const createMetric = async (name: string): Promise<MetricHandler> => {
  const metricHeader: MetricHeaderAttributes = { name }
  let workingMetric = await MetricHeaderModel
    .findOne(metricHeader)
    .select('_id name')
    .exec()
  if (!workingMetric) {
    workingMetric = await MetricHeaderModel.create(metricHeader)
  }
  const data = []
  return {
    count: createCount(data),
    save: createSave(data, workingMetric._id),
    countAndSave: input => MetricRecordModel.create({ ...input, header: workingMetric._id }) as any,
  }
}
