import React, {useContext, useState} from 'react'
import {
  ThemeProvider,
  Grid,
  Button,
  RadioGroup,
  FormControl,
  FormControlLabel,
  Radio
} from '@material-ui/core'
import Information from '../../../components/Information'
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers'
import DateFnsUtils from '@date-io/date-fns'
import theme from '../../../shared/theme'
import Paper from '../../../components/Paper'
import { INITIAL_FARM_LESSON_INPUT, FarmLessonsInput } from './constants'
import { addWeeks, formatISO } from 'date-fns'
import { uk } from 'date-fns/locale'
import { AppContext } from "../../../shared/reducer";

const ManageSchedule: React.FC = () => {
  const { client } = useContext(AppContext)
  const [farmLessonsInput, setFarmLessonsInput] = useState<FarmLessonsInput>(INITIAL_FARM_LESSON_INPUT)

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
    const result1 = await client.farmLessons(farmLessonsInput)
      .then((result: any) => console.log(result))
  }

  console.log(farmLessonsInput)

  return (<ThemeProvider theme={theme}>
    <Information content='Content'/>
    <Grid container spacing={3} justify='center'>
      <Paper title='Оберіть тиждень:'>
        <FormControl component="fieldset">
          <RadioGroup
            aria-label="week"
            name="week"
            value={farmLessonsInput.week}
            onChange={handleWeekChange}>
            <FormControlLabel
              value={0}
              control={<Radio color='primary'/>}
              label="Парний"
            />
            <FormControlLabel
              value={1}
              control={<Radio color='primary'/>}
              label="Непарний"
            />
          </RadioGroup>
        </FormControl>
      </Paper>

      <Paper title='Оберіть початок тижня:'>
        <MuiPickersUtilsProvider utils={DateFnsUtils} locale={uk}>
          <DatePicker
            autoOk
            openTo='date'
            orientation="landscape"
            value={farmLessonsInput.from}
            onChange={handleDateChange}
            variant='static'/>
        </MuiPickersUtilsProvider>
      </Paper>
      <Paper title='Оберіть акторів:'>
        <FormControl component="fieldset">
          <RadioGroup
            aria-label="type"
            name='type'
            value={farmLessonsInput.type}
            onChange={handleTypeChange}>
            <FormControlLabel
              value='teachers'
              control={<Radio color='primary'/>}
              label="Викладачі"
            />
            <FormControlLabel
              value='students'
              control={<Radio color='primary'/>}
              label="Здобувачі вищої освіти"
            />
          </RadioGroup>
        </FormControl>
      </Paper>
      <Button
        style={{ marginBottom: '66px' }}
        variant='outlined'
        onClick={handleFarmLessonsClick}
        color='primary'>
        Отримати інформацію
      </Button>
    </Grid>
  </ThemeProvider>)
}

export default  ManageSchedule