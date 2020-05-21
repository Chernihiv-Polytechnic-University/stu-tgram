import React, { useContext, useState } from 'react'
import {
  ThemeProvider
} from '@material-ui/core'
import Information from '../../../components/Information'
import theme from '../../../shared/theme'
import { INITIAL_FARM_LESSON_INPUT, FarmLessonsInput } from './constants'
import { addWeeks, formatISO } from 'date-fns'
import { AppContext } from '../../../shared/reducer'
import FarmContainer from './FarmContainer'
import FarmingResultComponent from './FarmingResultComponent'

const ManageSchedule: React.FC = () => {
  const { client } = useContext(AppContext)
  const [farmLessonsInput, setFarmLessonsInput] = useState<FarmLessonsInput>(INITIAL_FARM_LESSON_INPUT)
  const [farming, setFarming] = useState<boolean>(false)
  const [isFarmingSuccess, setFarmingSuccess] = useState<boolean>(false)
  const [isFarmingStarted, setFarmingStarted] = useState<boolean>(false)

  const handleWeekChange = (event: any) => {
    if (event.target.value === '0') {
      setFarmLessonsInput({ ...farmLessonsInput, week: 0 })
      return
    }
    setFarmLessonsInput({ ...farmLessonsInput, week: 1 })
  }

  const handleTypeChange = (event: any) => {
    setFarmLessonsInput({ ...farmLessonsInput, type: event.target.value })
  }

  const handleDateChange = (date: Date | null) => {
    if (date === null) return
    setFarmLessonsInput({ ...farmLessonsInput,
      from: formatISO(date, { representation: 'date' }),
      to: formatISO(addWeeks(date, 1), { representation: 'date' })
    })
  }

  const handleFarmLessonsClick = async () => {
    setFarming(true)
    setFarmingStarted(true)
    await client.farmLessons(farmLessonsInput)
      .then((result: any) => {
        if (result.isSuccess) {
          setFarmingSuccess(true)
        } else {
          setFarmingSuccess(false)
        }
        setFarming(false)
        setFarmLessonsInput(INITIAL_FARM_LESSON_INPUT)
      })
  }

  return (<ThemeProvider theme={theme}>
    <Information>
      Інтерфейс відповідає за збір розкладу з https://schedule.stu.cn.ua<br />
      Для виконання збору даних необхідно вказати тиждень, дату початку тижня та тип акторів<br />
      Для повного розкладу необхідно виконати 4 рази процес збору для кожної пари тиждень-актори<br />
      Процес одного збору займає близько однієї хвилини<br/>
    </Information>
    {isFarmingStarted && !farming
      ? (isFarmingSuccess ? <FarmingResultComponent type='success'/> : <FarmingResultComponent type='failed'/>)
      : null}
    <FarmContainer
      farmLessonsInput={farmLessonsInput}
      handleWeekChange={handleWeekChange}
      handleDateChange={handleDateChange}
      handleTypeChange={handleTypeChange}
      handleFarmLessonsClick={handleFarmLessonsClick}
      farming={farming}
    />
  </ThemeProvider>)
}

export default  ManageSchedule