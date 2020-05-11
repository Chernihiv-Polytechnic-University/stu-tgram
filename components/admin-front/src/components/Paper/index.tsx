import React from 'react'
import styles from './styles'
import { Grid, makeStyles, Typography } from '@material-ui/core'

const useStyles = makeStyles(styles)

export type PaperStyles = {
  children: React.ReactNode,
  title: string
}

const Paper: React.FC<PaperStyles> = (props) => {
  const { children, title } = props
  const classes = useStyles()

  return (<Grid item xs={4}>
    <div className={classes.boxStyle}>
      <Typography variant='h4' component='h4' color='textPrimary'>{title}</Typography>
      {children}
    </div>
  </Grid>)
}

export default Paper
