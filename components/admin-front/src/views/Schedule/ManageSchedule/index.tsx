import React, { useState } from 'react'
import {
  ThemeProvider,
  Grid,
  Button,
  RadioGroup,
  FormControl,
  FormControlLabel,
  Radio,
  makeStyles
} from '@material-ui/core'
import Information from '../../../components/Information'
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers'
import DateFnsUtils from '@date-io/date-fns'
import theme from '../../../shared/theme'
import Paper from '../../../components/Paper'

const ManageSchedule: React.FC = () => {
  const [value, setValue] = useState('female')
  const [date, changeDate] = useState<Date | null>(new Date())

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue((event.target as HTMLInputElement).value)
  }

  const handleDateChange = (date: Date | null) => {
    changeDate(date)
  }

  return (<ThemeProvider theme={theme}>
    <Information content='Content'/>
    <Grid container spacing={3} justify='center'>
      <Paper title='Оберіть тиждень:'>
        <FormControl component="fieldset">
          <RadioGroup aria-label="gender" name="gender1" value={value} onChange={handleChange}>
            <FormControlLabel value="female" control={<Radio />} label="Female" />
            <FormControlLabel value="male" control={<Radio />} label="Male" />
          </RadioGroup>
        </FormControl>
      </Paper>
      <Paper title='Оберіть початок тижня:'>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <DatePicker
            autoOk
            openTo='date'
            orientation="landscape"
            value={date}
            onChange={handleDateChange}
            variant='static'/>
        </MuiPickersUtilsProvider>
      </Paper>
      <Paper title='Оберіть акторів:'>
        <FormControl component="fieldset">
          <RadioGroup aria-label="gender" name="gender1" value={value} onChange={handleChange}>
            <FormControlLabel value="female" control={<Radio />} label="Female" />
            <FormControlLabel value="male" control={<Radio />} label="Male" />
          </RadioGroup>
        </FormControl>
      </Paper>
      <Button variant='outlined' color='primary'>Отримати інформацію</Button>
    </Grid>
  </ThemeProvider>)
}

export default  ManageSchedule