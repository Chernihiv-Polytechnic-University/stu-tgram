import { pick } from 'lodash'
import { Request, Response } from 'express'
import { createLogger } from 'libs/logger'
import { LessonModel, LessonAttributes, StudentsGroupModel, StudentsGroup, StudentsGroupAttributes, TeacherModel } from 'libs/domain-model'
import { farmLessonSchedule, FarmedLesson } from 'libs/lesson-schedule-farmer'
import { flow, map, values, groupBy, find, uniq } from 'lodash/fp'
import { dateToDay } from '../utils/date-to-day'
import * as catchUtil from '../utils/with-catch'
import config from '../config'

const CHUNK_SIZE = 10

const logger = createLogger(`#handlers/${__filename}`)
const withCatch = catchUtil.withCatch(logger)

const prepareLessons = map<FarmedLesson, FarmedLesson>((lesson) => {
  if (lesson && !lesson.day) {
    return { ...lesson, day: dateToDay(lesson.date) }
  }
  return lesson
})

const getGroupByGroupData = (groups: StudentsGroup[], data: StudentsGroupAttributes): StudentsGroup =>
  find((g: StudentsGroup) => g.name === data.name && g.subgroupNumber === data.subgroupNumber)(groups) as StudentsGroup

const buildLessonInsert = (forTeachers: boolean) => (week: number, lesson: FarmedLesson, groups?: StudentsGroup[]): LessonAttributes => ({
  week,
  isExist: true,
  day: lesson.day,
  number: lesson.number,
  auditory: lesson.auditory,
  teacher: { name: lesson.teacherName, only: forTeachers },
  groupId: forTeachers ? null : getGroupByGroupData(groups, lesson.group)._id,
  group: forTeachers ? lesson.group : null,
  name: lesson.name + (lesson.type === 'lecture' ? ' (лек)' : ' (пр)'),
})

const buildLessonInsertForStudents = buildLessonInsert(false)
const buildLessonInsertForTeachers = buildLessonInsert(true)

const buildGroupsUpdateOptions = map<StudentsGroupAttributes, any>((e: StudentsGroupAttributes) => ({
  updateOne: { filter: e, update: { $set: { ...e } }, upsert: true },
}))

const buildTeachersUpdateOptions = map<string, any>((name: string) => ({
  updateOne: { filter: { name }, update: { $set: { name } }, upsert: true },
}))

const extractGroups = (lessons: FarmedLesson[]): any[] => flow(
  map('group'),
  groupBy((group: StudentsGroupAttributes) => `${group.name}${group.subgroupNumber}`),
  map(values),
  map('0'),
)(lessons)

const extractTeachers = (lessons: FarmedLesson[]): any[] => flow(
  map('teacherName'),
  uniq,
)(lessons)

export const update = withCatch(['lessons', 'update'], async (req: Request, res: Response, next) => {
  try {
    const { id } = req.params

    await LessonModel.updateOne({ _id: id }, { $set: pick(req.body, ['name', 'auditory', 'teacher']) })

    res.sendStatus(204)
  } catch (e) {
    logger.error(e)

    next(e)
  }
})

const handleTeachersSchedule = async (week: number, lessons: FarmedLesson[]): Promise<void> => {
  const teachers = extractTeachers(lessons)

  const teachersBulkWriteOptions = buildTeachersUpdateOptions(teachers)

  if (!teachersBulkWriteOptions.length) {
    return
  }

  await TeacherModel.bulkWrite(teachersBulkWriteOptions)

  const preparedLessons = prepareLessons(lessons)

  await LessonModel.deleteMany({ week: Number(week), 'teacher.name': { $in: teachers }, 'teacher.only': true })
  await LessonModel.create(preparedLessons.filter(l => !!l.day).map(lesson => buildLessonInsertForTeachers(Number(week), lesson)))
}

const handleStudentsSchedule = async (week: number, lessons: FarmedLesson[]): Promise<void> => {
  const parsedGroups = extractGroups(lessons)
  const groupsBulkWriteOptions = buildGroupsUpdateOptions(parsedGroups)

  if (!groupsBulkWriteOptions.length) {
    return
  }

  await StudentsGroupModel.bulkWrite(groupsBulkWriteOptions)

  const groups: StudentsGroup[] = await StudentsGroupModel.find({ name: { $in: map('name', parsedGroups) } }).exec()
  const preparedLessons = prepareLessons(lessons)

  await LessonModel.deleteMany({ week: Number(week), groupId: { $in: map('_id', groups) }, 'teacher.only': { $ne: true } })
  await LessonModel.create(preparedLessons.filter(l => l.day !== null).map(lesson => buildLessonInsertForStudents(Number(week), lesson, groups)))
}

export const farmLessons = (type: 'students' | 'teachers') =>  withCatch(
  ['lessons', 'farm', type],
  async (req: Request, res: Response) => {
    const { from, to, week } = req.body

    const farmer = await farmLessonSchedule({
      type,
      from,
      to,
      baseUrl: config('SCHEDULE_DB_BASE_URL'),
      universityId: config('SCHEDULE_DB_UNIVERSITY_ID'),
      chunkSize: CHUNK_SIZE,
    })

    const handlePack = type === 'teachers' ? handleTeachersSchedule : handleStudentsSchedule

    for await (const pack of farmer) {
      await handlePack(Number(week), pack)
    }

    res.sendStatus(204)
  },
)
