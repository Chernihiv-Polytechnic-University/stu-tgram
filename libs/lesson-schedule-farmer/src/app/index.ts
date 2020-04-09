// TODO refactor

import { EventEmitter } from 'events'
import * as tls from 'tls'
import axios from 'axios'
import { map as pMap } from 'bluebird'
import { flattenDeep, map, flow, chunk } from 'lodash/fp'

// @ts-ignore
tls.DEFAULT_MIN_VERSION = 'TLSv1'

const getFaculties = ({ baseUrl, universityId }) => {
  return axios.get(`${baseUrl}/GetStudentScheduleFiltersData?aVuzID=${universityId}`)
    .then(({ data }) => data.d.faculties)
}

const getTeachers = ({ baseUrl, universityId, facultyId }) => {
  return axios.get(`${baseUrl}/GetEmployeeChairs?aVuzID=${universityId}&aFacultyID="${facultyId}"&aGiveStudyTimes=false`)
    .then(({ data }) => data.d.employees)
}

const getTeacherSchedule = ({ baseUrl, universityId, teacher, from, to }) => {
  return axios.get(`${baseUrl}/GetScheduleDataEmp?aVuzID=${universityId}&aEmployeeID="${teacher.Key}"&aStartDate="${from}"&aEndDate="${to}"&&aStudyTypeID=null`)
    .then(({ data }) => data.d)
}

const getGroups = ({ baseUrl, universityId, facultyId }): Promise<{ Key: string, Value: string }[]> => {
  return axios.get(
    `${baseUrl}/GetStudyGroups?aVuzID=${universityId}&aFacultyID="${facultyId}"&aEducationForm=null&aCourse=null&aGiveStudyTimes=false`,
  )
    .then(({ data }) => data.d.studyGroups)
}

const getSchedule = ({ baseUrl, universityId, group, from, to }): Promise<Lesson[]> => {
  return axios.get(`${baseUrl}/GetScheduleDataX?aVuzID=${universityId}&aStudyGroupID="${group.Key}"&aStartDate="${from}"&aEndDate="${to}"&&aStudyTypeID=null`)
    .then(({ data }) => data.d as object[])
    .then(map(e => ({ ...e, group: group.Value }) as Lesson))
}

enum FarmEvent {
  FARMED_PACK = 'fp',
  ERROR = 'err',
  END = 'end',
}

type Lesson = {
  study_time: string
  week_day: string
  full_date: string
  discipline: string
  study_type: string
  cabinet: string
  employee: string
  study_subgroup: string
  group?: string
  study_group?: string,
}

export type FarmInput = {
  baseUrl: string
  universityId: number
  from: string
  to: string
  chunkSize: number,
}

export type Day = 'ПН' | 'ВТ' | 'СР' | 'ЧТ' | 'ПТ' | 'СБ'
export type LessonType = 'lecture' | 'practice'

export type FarmedLesson = {
  group: {
    name: string
    subgroupNumber: number,
  },
  isOnlyTeacherLesson: boolean,
  name?: string
  day?: Day
  date?: string
  type?: LessonType
  auditory?: string
  number?: number
  teacherName?: string,
}

export type Farmer = {
  onFarmedPack: (listener: (lessons: FarmedLesson[]) => void) => void
  onError: (listener: (error: Error) => void) => void
  onEnd: (listener: () => void) => void,
}

const createFarmer = (emitter: EventEmitter): Farmer => ({
  onFarmedPack: (listener => emitter.on(FarmEvent.FARMED_PACK, listener)),
  onError: (listener => emitter.on(FarmEvent.ERROR, listener)),
  onEnd: (listener => emitter.on(FarmEvent.END, listener)),
})

/**
 * convert date format 'DD.MM.YYYY' into 'YYYY-MM-DD'
 * @param date
 */
const convertDate = (date: string): string => {
  if (!date) { return date }
  const [DD, MM, YYYY] = date.split('.')
  return `${YYYY}-${MM}-${DD}`
}

/**
 * convert date format 'YYYY-MM-DD' into 'DD.MM.YYYY'
 * @param date
 */
const reconvertDate = (date: string): string => {
  if (!date) { return date }
  const [YYYY, MM, DD] = date.split('-')
  return `${DD}.${MM}.${YYYY}`
}

const dayMapper = new Map<string, Day>([
  ['Понеділок', 'ПН'],
  ['Вівторок', 'ВТ'],
  ['Середа', 'СР'],
  ['Четвер', 'ЧТ'],
  ['П\'ятниця', 'ПТ'],
  ['Субота', 'СБ'],
])

const typeMapper = new Map<string, LessonType>([
  ['Лекції', 'lecture'],
  ['Практичні', 'practice'],
  ['Лабораторні', 'practice'],
])

const getNumberFromStr = (str: string) => {
  if (!str || !/[1-9]/.test(str)) { return null }
  const [lessonNumber] = str.match(/[1-9]/g)
  return Number(lessonNumber)
}

const mapToFarmedLesson = (isOnlyTeacherLesson: boolean, teacherName?: string) => map((lesson: Lesson) => {
  const farmed: FarmedLesson = {
    isOnlyTeacherLesson,
    name: lesson.discipline,
    day: dayMapper.has(lesson.week_day) ? dayMapper.get(lesson.week_day) : null,
    date: convertDate(lesson.full_date),
    type: typeMapper.has(lesson.study_type) ? typeMapper.get(lesson.study_type) : null,
    number: getNumberFromStr(lesson.study_time),
    auditory: lesson.cabinet,
    teacherName: teacherName ? teacherName : lesson.employee,
    group: null,
  }

  if (isOnlyTeacherLesson) {
    farmed.group = { name: lesson.study_group, subgroupNumber: null }

    return farmed
  }

  const subgroupNumber = lesson.study_subgroup ? getNumberFromStr(lesson.study_subgroup) : null

  if (subgroupNumber) {
    farmed.group = { subgroupNumber, name: lesson.group }

    return farmed
  }

  const one = { ...farmed, group: { name: lesson.group, subgroupNumber: 1 } }
  const two = { ...farmed, group: { name: lesson.group, subgroupNumber: 2 } }

  return [one, two]
})

const farmAndEmit = (forTeachers: boolean) =>
  async ({ baseUrl, universityId, from, to, chunkSize }: FarmInput, emitter: EventEmitter): Promise<void> => {
    try {
      const faculties = await getFaculties({ baseUrl, universityId })

      if (!forTeachers) {
        // farm students schedule
        const groupsChunks = await pMap(faculties, ({ Key }) => getGroups({ baseUrl, universityId, facultyId: Key }))
          .then(flattenDeep)
          .then(chunk(chunkSize))

        await pMap(groupsChunks, async (groups) => {
          const data = await pMap(groups, async (group) => {
            const groupSchedule = await getSchedule({ baseUrl, universityId, group, from: reconvertDate(from), to: reconvertDate(to) })

            return mapToFarmedLesson(false)(groupSchedule)
          })

          emitter.emit(FarmEvent.FARMED_PACK, flattenDeep(data))
        }, { concurrency: 1 })
      } else {
        // farm teachers schedule
        const teacherChunks = await pMap(faculties,  ({ Key }) => getTeachers({ baseUrl, universityId, facultyId: Key }))
          .then(flattenDeep)
          .then(chunk(chunkSize))

        await pMap(teacherChunks, async (teachers) => {
          const data = await pMap(teachers, async (teacher) => {
            const schedule = await getTeacherSchedule({ baseUrl, universityId, teacher, from: reconvertDate(from), to: reconvertDate(to) })

            return mapToFarmedLesson(true, teacher.Value)(schedule)
          })

          emitter.emit(FarmEvent.FARMED_PACK, flattenDeep(data))
        }, { concurrency: 1 })
      }

    } catch (err) {

      emitter.emit(FarmEvent.ERROR, err)
    } finally {

      emitter.emit(FarmEvent.END)
      emitter.removeAllListeners()
    }
  }

export const farmLessonSchedule = (input: FarmInput): Farmer => {
  const farmerEmitter = new EventEmitter()
  const farmer = createFarmer(farmerEmitter)

  farmAndEmit(false)(input, farmerEmitter)

  return farmer
}

export const farmTeacherLessonSchedule = (input: FarmInput): Farmer => {
  const farmerEmitter = new EventEmitter()
  const farmer = createFarmer(farmerEmitter)

  farmAndEmit(true)(input, farmerEmitter)

  return farmer
}
