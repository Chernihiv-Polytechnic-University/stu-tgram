import React, { useState } from 'react'
import { Button, Grid, CircularProgress } from '@material-ui/core'
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers'
import DateFnsUtils from '@date-io/date-fns'
import { uk } from 'date-fns/locale'
import Paper from '../../../components/Paper'
import Information from '../../../components/Information'

const Images: React.FC = () => {
  const [value, setValue] = useState(new Date())

  const handleDateChange = (date: Date | null) => {
    if (date === null) return
    setValue(date)
  }

  return (<div>
    <Information>Content</Information>
    <Grid container justify='center'>
      <Paper title='Оберіть початок непарного тижня:'>
        <MuiPickersUtilsProvider utils={DateFnsUtils} locale={uk}>
          <DatePicker
            autoOk
            openTo='date'
            orientation="landscape"
            value={value}
            onChange={handleDateChange}
            variant='static'/>
        </MuiPickersUtilsProvider>
      </Paper>
    </Grid>
    <Grid container justify='center'>
      <Button
        style={{ marginBottom: '66px' }}
        variant='outlined'
        color='primary'>
        Генерувати зображення
      </Button>
    </Grid>
  </div>)
}

export default  Images