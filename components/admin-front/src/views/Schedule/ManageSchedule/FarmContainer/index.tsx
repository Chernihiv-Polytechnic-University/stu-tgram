import React from 'react'
import Paper from '../../../../components/Paper'
import { Button, FormControl, FormControlLabel, Grid, Radio, RadioGroup, CircularProgress } from '@material-ui/core'
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers'
import DateFnsUtils from '@date-io/date-fns'
import { uk } from 'date-fns/locale'
import { FarmLessonsInput } from '../constants'

type FarmContainerProps = {
  farmLessonsInput: FarmLessonsInput
  handleWeekChange: any
  handleDateChange: any
  handleTypeChange: any
  handleFarmLessonsClick: any
  farming: boolean
}

const FarmContainer: React.FC<FarmContainerProps> = (props) => {
  const {
    farmLessonsInput,
    handleTypeChange,
    handleDateChange,
    handleWeekChange,
    handleFarmLessonsClick,
    farming } = props

  return ( <Grid container spacing={3} justify='center'>
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
    { farming ? <CircularProgress style={{ marginBottom: '66px' }}/> : <Button
      style={{ marginBottom: '66px' }}
      variant='outlined'
      onClick={handleFarmLessonsClick}
      color='primary'>
      Отримати інформацію
    </Button> }
  </Grid> )
}

export default FarmContainer