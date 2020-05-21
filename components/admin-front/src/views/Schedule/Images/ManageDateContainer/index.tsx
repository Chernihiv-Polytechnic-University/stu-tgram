import React from 'react'
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers'
import DateFnsUtils from '@date-io/date-fns'
import { uk } from 'date-fns/locale'
import Paper from '../../../../components/Paper'
import { Button, Grid, Typography } from '@material-ui/core'

type ManageDateContainerProps = {
  firstOddWeekMondayDate: Date
  handleDateChange: any
  handleSetDateClick: any
}

const ManageDateContainer: React.FC<ManageDateContainerProps> = (
  { handleDateChange, firstOddWeekMondayDate, handleSetDateClick }) => {
  
  return <div>
    <Grid container justify='center'>
      <Paper title='Встановлена дата:'>
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
    {/*<Grid container justify='center' direction='row'>*/}
    {/*  <Button*/}
    {/*    style={{ marginBottom: '66px' }}*/}
    {/*    variant='outlined'*/}
    {/*    onClick={handleSetDateClick}*/}
    {/*    color='primary'>*/}
    {/*    Встановити*/}
    {/*  </Button>*/}
    {/*</Grid>*/}
  </div>
}

export default ManageDateContainer