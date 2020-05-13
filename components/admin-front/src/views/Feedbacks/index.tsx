import React, { useContext, useEffect, useState } from 'react'
import { formatISO } from 'date-fns'
import {
  Container,
  Grid,
  Typography,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  ThemeProvider,
  makeStyles
} from '@material-ui/core'
import { AppContext } from '../../shared/reducer'
import theme from '../../shared/theme'
import styles from './styles'
import { ITEMS_PER_PAGE } from './constants'

const useStyles = makeStyles(styles as any)

const Teachers: React.FC = () => {
  const classes = useStyles()
  const { client } = useContext(AppContext)
  const [feedbacks, setFeedbacks] = useState<any[]>([])
  const [page, setPage] = useState<number>(0)


  const onMoreClick: any = () => {
    setPage(page + 1)
  }

  const fetchFeedbacks = async () => {
    const { result, isSuccess } = await client.getFeedbacks({ limit: ITEMS_PER_PAGE, page })

    if (!isSuccess) { return }

    if (page === 0) {
      setFeedbacks(result.docs)
    } else {
      setFeedbacks(old => [...old, ...result.docs])
    }
  }

  useEffect(() => {
    fetchFeedbacks()
  }, [page])

  return (
    <ThemeProvider theme={theme}>
      <Container>
        <Grid container direction='row' justify='space-between' alignItems='baseline'>
          <Typography component="h3" variant="h3" align="left" color="textPrimary">Відгуки</Typography>
        </Grid>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Відгук</TableCell>
              <TableCell>Телеграм id</TableCell>
              <TableCell>Телеграм ім’я</TableCell>
              <TableCell>Група</TableCell>
              <TableCell>Створено</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {feedbacks.map(feedback => {
              return (
                <TableRow key={feedback._id} hover>
                  <TableCell>{feedback?.text}</TableCell>
                  <TableCell>{feedback?.author?.username}</TableCell>
                  <TableCell>{feedback?.author?.name}</TableCell>
                  <TableCell>{feedback?.group?.name || 'Не встановлено'}</TableCell>
                  <TableCell>{formatISO(new Date(feedback.createdAt), { representation: 'date' })}</TableCell>
                </TableRow>)
            })}
          </TableBody>
        </Table>
        <Button classes={{ root: classes.moreButton }} onClick={onMoreClick}>... Показати більше</Button>
      </Container>
    </ThemeProvider>
  )
}

export default Teachers
