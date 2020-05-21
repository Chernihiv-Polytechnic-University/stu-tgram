import React from 'react'
import { buildStyles, CircularProgressbarWithChildren } from 'react-circular-progressbar'
import { Grid, Typography } from '@material-ui/core'
import 'react-circular-progressbar/dist/styles.css'

type GeneratingProgressBarProps = {
  done: number
  all: number
}

const GeneratingProgressBar: React.FC<GeneratingProgressBarProps> = ({ done, all }) => {
  return <Grid container justify='center' direction='row'>
    <div style={{ marginTop: '39px', marginBottom: '120px' }}>
      <CircularProgressbarWithChildren
        styles={buildStyles({
          pathColor: '#005390',
          trailColor: '#C4C4C4'
        })}
        value={done}
        minValue={0}
        maxValue={all === 0 ? 100 : all}
        strokeWidth={2}>
        {/* Put any JSX content in here that you'd like. It'll be vertically and horizonally centered. */}
        <Typography style={{ fontSize: '36px', fontWeight: 500, letterSpacing: '0.05em' }} color='primary'>{done}/{all}</Typography>
        <Typography variant='h5' color='textPrimary'>Зачекайте завершення <br/> генерування зображень</Typography>
      </CircularProgressbarWithChildren>
    </div>
  </Grid>
}

export default GeneratingProgressBar