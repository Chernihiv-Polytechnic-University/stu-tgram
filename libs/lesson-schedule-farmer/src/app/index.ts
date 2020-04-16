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

const getTeacherSchedule = ({ baseUrl, universityId, entity, from, to }) => {
  return axios.get(`${baseUrl}/GetScheduleDataEmp?aVuzID=${universityId}&aEmployeeID="${entity.Key}"&aStartDate="${from}"&aEndDate="${to}"&&aStudyTypeID=null`)
    .then(({ data }) => data.d as object[])
    .then(map(e => ({ ...e, employee: entity.Value }) as Lesson))
}

const getGroups = ({ baseUrl, universityId, facultyId }): Promise<{ Key: string, Value: string }[]> => {
  return axios.get(
    `${baseUrl}/GetStudyGroups?aVuzID=${universityId}&aFacultyID="${facultyId}"&aEducationForm=null&aCourse=null&aGiveStudyTimes=false`,
  )
    .then(({ data }) => data.d.studyGroups)
}

const getStudentSchedule = ({ baseUrl, universityId, entity, from, to }): Promise<Lesson[]> => {
  return axios.get(`${baseUrl}/GetScheduleDataX?aVuzID=${universityId}&aStudyGroupID="${entity.Key}"&aStartDate="${from}"&aEndDate="${to}"&&aStudyTypeID=null`)
    .then(({ data }) => data.d as object[])
    .then(map(e => ({ ...e, group: entity.Value }) as Lesson))
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
  type: 'teachers' | 'students'
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
  [Symbol.asyncIterator]: () => {
    next: () => Promise<IteratorResult<FarmedLesson[]>>,
  },
}

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

const mapToFarmedLesson = (isOnlyTeacherLesson: boolean) => map((lesson: Lesson): FarmedLesson | [FarmedLesson, FarmedLesson] => {
  const farmed: FarmedLesson = {
    isOnlyTeacherLesson,
    name: lesson.discipline,
    day: dayMapper.has(lesson.week_day) ? dayMapper.get(lesson.week_day) : null,
    date: convertDate(lesson.full_date),
    type: typeMapper.has(lesson.study_type) ? typeMapper.get(lesson.study_type) : null,
    number: getNumberFromStr(lesson.study_time),
    auditory: lesson.cabinet,
    teacherName: lesson.employee,
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

const farmerFunctionsMapper = {
  teachers: {
    getEntities: getTeachers,
    getSchedule: getTeacherSchedule,
    mapToFarmed: mapToFarmedLesson(true),
  },
  students: {
    getEntities: getGroups,
    getSchedule: getStudentSchedule,
    mapToFarmed: mapToFarmedLesson(false),
  },
}

export const farmLessonSchedule = async ({ baseUrl, universityId, from, to, chunkSize, type }: FarmInput): Promise<Farmer> => {
  const faculties = await getFaculties({ baseUrl, universityId })

  const { getEntities, getSchedule, mapToFarmed } = farmerFunctionsMapper[type]

  const chunks = await pMap(faculties, ({ Key }) => getEntities({ baseUrl, universityId, facultyId: Key }))
      .then(flattenDeep)
      .then(chunk(chunkSize))

  const len = chunks.length
  let i = -1

  const next = async (): Promise<IteratorResult<FarmedLesson[]>> => {
    i += 1
    if (i >= len) {
      return { value: [], done: true }
    }
    const chunk = chunks[i]
    const data = await pMap(chunk, async (entity) => {
      const schedule = await getSchedule({ baseUrl, universityId, entity, from: reconvertDate(from), to: reconvertDate(to) })

      return mapToFarmed(schedule)
    })

    return { value: flattenDeep(data) as FarmedLesson[], done: false }
  }

  return { [Symbol.asyncIterator]: () => ({ next }) }
}
