// TODO fix
import { Handler } from 'express'
import { mapSeries } from 'bluebird'
import { map, values, find, groupBy, flow, pick, omit, filter } from 'lodash/fp'
import { parseSchedule, Lesson as ParsedLesson } from 'libs/xlsx-parser'
import { creteSchedulePDF } from 'libs/schedule-builder'
import {
  StudentsGroupAttributes,
  StudentsGroupModel,
  LessonAttributes,
  LessonModel,
  StudentsGroup,
} from 'libs/domain-model'

const getGroupByGroupData = (groups: StudentsGroup[], data: StudentsGroupAttributes): StudentsGroup =>
  find((g: StudentsGroup) => g.name === data.name && g.subgroupNumber === data.subgroupNumber)(groups) as StudentsGroup

const buildLessonInsert = (groups: StudentsGroup[], lesson: ParsedLesson) =>
  ({ ...omit(['group'])(lesson), groupId: getGroupByGroupData(groups, lesson.group)._id })

const buildGroupsUpdateOptions = (groups: Partial<StudentsGroupAttributes>[]) =>
  map((e: Partial<StudentsGroupAttributes>) => ({ updateOne: { filter: e, replacement: e, upsert: true } }))(groups)

const extractGroups = (lessons: ParsedLesson[]): any[] => flow(
  map('group'),
  groupBy((group: StudentsGroupAttributes) => `${group.name}${group.subgroupNumber}`),
  map(values),
  map('0'),
)(lessons)

export const uploadSchedule: Handler = async (req, res, next) => {
  try {
    const { buffer: fileBuffer } = req.file

    await LessonModel.remove({}).exec()

    const lessons: ParsedLesson[] = await parseSchedule(fileBuffer)
    const parsedGroups = extractGroups(lessons)
    const groupsBulkWriteOptions = buildGroupsUpdateOptions(parsedGroups)

    await StudentsGroupModel.bulkWrite(groupsBulkWriteOptions)
    const groups: StudentsGroup[] = await StudentsGroupModel.find({ name: { $in: map('name', parsedGroups) } }).exec()

    await LessonModel.deleteMany({ groupId: { $in: map('_id', groups) } })
    await LessonModel.create(lessons.map(lesson => buildLessonInsert(groups, lesson)))

    res.status(204).send()
  } catch (e) {
    next(e)
  }
}

export const compileSchedulePDFs: Handler = async (req, res, next) => {
  try {
    const groups = await StudentsGroupModel.find().exec()
    const lessons = await LessonModel.find().exec()

    await mapSeries(groups, async (g: StudentsGroup, i: number) => {
      const groupLessons = filter({ groupId: g._id.toString(), isExist: true } as Partial<LessonAttributes>)(lessons)
      const schedulePDF: Buffer = await creteSchedulePDF(groupLessons, g.name, g.subgroupNumber)
      g.set('schedulePDF', schedulePDF)
      await g.save()
    })
    res.status(204).send()
  } catch (e) {
    next(e)
  }
}
