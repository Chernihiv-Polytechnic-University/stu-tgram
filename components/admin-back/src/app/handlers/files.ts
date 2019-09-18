import { Handler } from 'express'
import { map, values, find, groupBy, flow, pick, omit } from 'lodash/fp'
import { parseSchedule, Lesson as ParsedLesson } from 'libs/xlsx-parser'
import {
  StudentsGroupAttributes,
  StudentsGroupModel,
  LessonAttributes,
  LessonModel,
  StudentsGroup,
} from 'libs/domain-model'

const getGroupByGroupData = (groups: StudentsGroup[], data: StudentsGroupAttributes): StudentsGroup =>
  find(g => g.name === data.name && g.subgroupNumber === data.subgroupNumber)(groups)

const buildLessonFilter = (groups: StudentsGroup[], lesson: ParsedLesson) =>
  ({ ...pick(['number', 'day', 'week'])(lesson), groupId: getGroupByGroupData(groups, lesson.group)._id })

const buildLessonUpdate = (groups: StudentsGroup[], lesson: ParsedLesson) =>
  ({ ...omit(['group'])(lesson), groupId: getGroupByGroupData(groups, lesson.group)._id })

const extractGroupsAsBulkWriteOptions = (lessons: ParsedLesson[]): StudentsGroupAttributes[] => flow(
  map('group'),
  groupBy((group: StudentsGroupAttributes) => `${group.name}${group.subgroupNumber}`),
  map(values),
  map('0'),
  map((e: StudentsGroupAttributes) => ({ ...e, name: e.name })),
  map((e: StudentsGroupAttributes) => ({ updateOne: { filter: e, replacement: e, upsert: true } })),
)(lessons)

const buildLessonsAsGroupWriteOptions = (lessons: ParsedLesson[], groups: StudentsGroup[]): LessonAttributes[] => map(lesson => ({
  updateOne: {
    filter: buildLessonFilter(groups, lesson),
    update: buildLessonUpdate(groups, lesson),
    upsert: true,
  },
}))(lessons)

export const uploadSchedule: Handler = async (res, req, next) => {
  try {
    const { buffer: fileBuffer } = res.file

    const lessons: ParsedLesson[] = parseSchedule(fileBuffer)
    const groupsBulkWriteOptions = extractGroupsAsBulkWriteOptions(lessons)

    await StudentsGroupModel.bulkWrite(groupsBulkWriteOptions)
    const groups: StudentsGroup[] = await StudentsGroupModel.find().exec()

    const lessonsBulkWriteOptions = buildLessonsAsGroupWriteOptions(lessons, groups)

    await LessonModel.bulkWrite(lessonsBulkWriteOptions)

    req.status(204).send()
  } catch (e) {
    next(e)
  }
}
