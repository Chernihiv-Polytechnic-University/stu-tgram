import React from 'react'
import { Grid, Typography } from '@material-ui/core'

type GeneratingResultContainerProps = {
  isGeneratingSuccess: boolean
}

const GeneratingResultContainer: React.FC<GeneratingResultContainerProps> = ({ isGeneratingSuccess }) => {
  if (isGeneratingSuccess) {
    return <Grid container justify='center' alignItems='center' direction='column'>
      <Typography style={{ paddingBottom: '24px', marginTop: '122px' }} variant='h3' color='primary'>Зображення успішно згенеровані</Typography>
      <Typography style={{ marginBottom: '200px' }} variant='h5' color='textPrimary'>Ви можете перевірити коректність даних у Telegram боті</Typography>
    </Grid>
  }

  return <Grid container justify='center' alignItems='center' direction='column'>
    <Typography style={{ paddingBottom: '24px' }} variant='h3' color='secondary'>Сталася помилка!</Typography>
    <Typography variant='h5' color='textPrimary'>Спробуйте виконати генерацію зображень ще раз</Typography>
  </Grid>
}

export default GeneratingResultContainer