import React from 'react'
import { Grid, Typography } from '@material-ui/core'

type FarmingResultComponentProps = {
  type: 'success' | 'failed'
}

const FarmingResultComponent: React.FC<FarmingResultComponentProps> = (props) => {
  const { type } = props

  if (type === 'success') {
    return (<Grid container direction='column'>
      <div style={{ marginTop: '68px', marginBottom: '36px' }}>
        <Typography variant='h2' component='h2' align='center' color='primary'>Успіх!</Typography>
      </div>
      <Typography variant='h5' component='h5' align='center' color='textPrimary'>Цей етап даних зібрано успішно!</Typography>
      <div >
        <Typography variant='h5' component='h5' align='center' color='textPrimary'>Виконайте наступий етап збору даних</Typography>
      </div>
    </Grid>)
  }
  return (<Grid container direction='column'>
    <div style={{ marginTop: '68px', marginBottom: '36px' }}>
      <Typography variant='h2' component='h2' align='center' color='secondary'>Помилка!</Typography>
    </div>
    <Typography variant='h5' component='h5' align='center' color='textPrimary'>Сталася помилка при зборі даних цього етапу!</Typography>
    <div style={{ marginBottom: '48px' }}>
      <Typography variant='h5' component='h5' align='center' color='textPrimary'>Спробуйте виконати збір даних ще раз</Typography>
    </div>
  </Grid>)
}

export default FarmingResultComponent