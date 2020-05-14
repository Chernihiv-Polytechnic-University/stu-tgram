import { map as pMap, mapSeries } from 'bluebird'
import { map, values, find, groupBy, flow, omit } from 'lodash/fp'
import { parseLessonsSchedule, parseEducationSchedule, Lesson as ParsedLesson } from 'libs/xlsx-parser'
import { createImageMaker } from 'libs/image-builder'
import { createLogger } from 'libs/logger'
import {
  SystemSettingsModel,
  StudentsGroupAttributes,
  StudentsGroupModel,
  LessonModel,
  StudentsGroup,
  TeacherModel,
  TeacherAttributes,
} from 'libs/domain-model'
import * as catchUtil from '../utils/with-catch'

const logger = createLogger(`#handlers/${__filename}`)
const withCatch = catchUtil.withCatch(logger)

const getGroupByGroupData = (groups: StudentsGroup[], data: StudentsGroupAttributes): StudentsGroup =>
  find((g: StudentsGroup) => g.name === data.name && g.subgroupNumber === data.subgroupNumber)(groups) as StudentsGroup

const buildLessonInsert = (groups: StudentsGroup[], lesson: ParsedLesson) =>
  ({ ...omit(['group'])(lesson), groupId: getGroupByGroupData(groups, lesson.group)._id })

const buildGroupsUpdateOptions = (groups: Partial<StudentsGroupAttributes>[]) =>
  map((e: Partial<StudentsGroupAttributes>) => ({ updateOne: { filter: e, update: { $set: { ...e } }, upsert: true } }))(groups)

const extractGroups = (lessons: ParsedLesson[]): any[] => flow(
  map('group'),
  groupBy((group: StudentsGroupAttributes) => `${group.name}${group.subgroupNumber}`),
  map(values),
  map('0'),
)(lessons)

export const uploadLessonsSchedule = withCatch(['files', 'upload_lessons', 'deprecated'], async (req, res) => {
  const { buffer: fileBuffer } = req.file

  const lessons: ParsedLesson[] = await parseLessonsSchedule(fileBuffer)
  const parsedGroups = extractGroups(lessons)
  const groupsBulkWriteOptions = buildGroupsUpdateOptions(parsedGroups)

  await StudentsGroupModel.bulkWrite(groupsBulkWriteOptions)
  const groups: StudentsGroup[] = await StudentsGroupModel.find({ name: { $in: map('name', parsedGroups) } }).exec()

  await LessonModel.deleteMany({ groupId: { $in: map('_id', groups) } })
  await LessonModel.create(lessons.map(lesson => buildLessonInsert(groups, lesson)))

  res.status(204).send()
})

export const uploadEducationProcessSchedule = withCatch(['files', 'education_schedule'], async (req, res, next) => {

  const { buffer: fileBuffer } = req.file

  const groupsSchedule = await parseEducationSchedule(fileBuffer)

  const groups = await StudentsGroupModel.find().select('_id name').exec()

  await mapSeries(groups, async ({ name, _id }) => {
    await StudentsGroupModel.updateOne(
      { _id, name },
      { educationSchedule: groupsSchedule.filter(g => new RegExp(g.group, 'i').test(name)) },
    )
  })

  res.status(204).send()
})

export const compilePNGs = withCatch(['files', 'compile_png'], async (req, res) => {
  const concurrency = req.query.concurrency ? Number(req.query.concurrency) : 5
  const settings = await SystemSettingsModel.findOne().exec()
  const groups = await StudentsGroupModel.find().select('_id name subgroupNumber educationSchedule').exec()
  const teachers: TeacherAttributes[] = await TeacherModel.find().select('_id name').exec()

  const imageMaker = await createImageMaker()
  const all = groups.length + teachers.length
  let left = 0

  res.locals.socket.emit('image_compiling', { all, left })

  await pMap(groups, async (g: StudentsGroup, i) => {
    const lessons = await LessonModel.find({ groupId: g._id.toString() }).exec()
    const lessonsScheduleImage: Buffer = await imageMaker.createLessonSchedulePNG(lessons, { groupName: g.name, subgroupNumber: g.subgroupNumber })

    const educationScheduleImage: Buffer = (!g.educationSchedule || !g.educationSchedule.length)
      ? null
      : await imageMaker.createEducationSchedulePNG(g.educationSchedule, settings.firstOddWeekMondayDate)

    await StudentsGroupModel.updateOne({ _id: g._id }, { $set: { lessonsScheduleImage, educationScheduleImage } }).exec()

    left += 1
    res.locals.socket.emit('image_compiling', { all, left })

  }, { concurrency })

  await pMap(teachers, async (teacher, i) => {
    const lessons = await LessonModel.find({ teacher: { name: teacher.name, only: true } }).exec()
    const lessonsScheduleImage: Buffer = await imageMaker.createLessonSchedulePNG(lessons, { teacherName: teacher.name })

    await TeacherModel.updateOne({ _id: teacher._id }, { $set: { lessonsScheduleImage } }).exec()

    left += 1
    res.locals.socket.emit('image_compiling', { all, left })
  }, { concurrency })

  await imageMaker.destruct()

  res.status(204).send()
})
