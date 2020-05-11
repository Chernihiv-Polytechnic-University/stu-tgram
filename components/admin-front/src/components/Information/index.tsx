import React from 'react'
import { Container, Grid, Typography, makeStyles } from '@material-ui/core'
import styles from './styles'

export type InformationProps = {
  content: string
}

const useStyles = makeStyles(styles)

const Information: React.FC<InformationProps> = (props) => {
  const { content } = props

  const classes = useStyles()

  return <Container>
    <Grid container justify='center'>
      <Grid item xs={10}>
        <div className={classes.informationPaperStyle}>
          <Typography
            component='h4'
            variant='h4'
            className={classes.titleStyle}
            align='center'
            color='textPrimary'>
            Довідка
          </Typography>
          <Typography
            className={classes.contentStyle}
            align='center'
            color='textPrimary'>
            Основатели харьковской IT-компании Sloboda Studio искали узкую нишу для своего бизнеса
            и решили сконцентрироваться на создании маркетплейсов. Но затея провалилась, а компания
            потеряла на этом эксперименте $40 тысяч и трех крутых программистов.
          </Typography>
        </div>
      </Grid>
    </Grid>
  </Container>
}

export default Information