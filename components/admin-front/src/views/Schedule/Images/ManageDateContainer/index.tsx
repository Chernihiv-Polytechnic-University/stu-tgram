import React from 'react'
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers'
import DateFnsUtils from '@date-io/date-fns'
import { uk } from 'date-fns/locale'
import Paper from '../../../../components/Paper'
import { Grid } from '@material-ui/core'

type ManageDateContainerProps = {
  firstOddWeekMondayDate: any
  handleDateChange: any
}

const ManageDateContainer: React.FC<ManageDateContainerProps> = (
  { handleDateChange, firstOddWeekMondayDate }
) => {

  return <div>
    <Grid container justify='center'>
      <Paper title={`Встановлена дата: ${firstOddWeekMondayDate}`}>
        <MuiPickersUtilsProvider utils={DateFnsUtils} locale={uk}>
          <DatePicker
            autoOk
            openTo='date'
            orientation="landscape"
            value={firstOddWeekMondayDate}
            onChange={handleDateChange}
            variant='static'/>
        </MuiPickersUtilsProvider>
      </Paper>
    </Grid>
  </div>
}

export default ManageDateContainer
