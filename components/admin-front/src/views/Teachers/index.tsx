import React, { useContext, useEffect, useState } from 'react'
import { formatISO } from 'date-fns'
import {
  Container,
  TextField,
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
  const [teachers, setTeachers] = useState<any[]>([])
  const [page, setPage] = useState<number>(0)
  const [query, setQuery] = useState<string>('')


  const onMoreClick: any = () => {
    setPage(page + 1)
  }

  const fetchTeachers = async () => {
    const { result, isSuccess } = await client.getTeachers({ limit: ITEMS_PER_PAGE, page, query })

    if (!isSuccess) { return }

    if (page === 0) {
      setTeachers(result.docs)
    } else {
      setTeachers(old => [...old, ...result.docs])
    }
  }

  const handleQueryChange: any = (event: React.ChangeEvent<{ value: string}>) => {
    setPage(0)
    setQuery(event.target.value)
  }

  useEffect(() => {
    fetchTeachers()
  }, [page, query])

  return (
    <ThemeProvider theme={theme}>
      <Container>
        <Grid container direction='row' justify='space-between' alignItems='baseline'>
          <Typography component="h3" variant="h3" align="left" color="textPrimary">Групи</Typography>
        </Grid>
        <Grid container direction='row' justify='flex-end'>
          <TextField classes={{ root: classes.searchTextField }} variant='outlined' label='Пошук...' onChange={handleQueryChange} />
        </Grid>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Ім’я</TableCell>
              <TableCell>Оновлено</TableCell>
              <TableCell>Розклад пар</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {teachers.map(teacher => {
              return (
                <TableRow key={teacher._id} hover>
                  <TableCell>{teacher.name}</TableCell>
                  <TableCell>{formatISO(new Date(teacher.updatedAt), { representation: 'date' })}</TableCell>
                  <TableCell>{teacher.lessonsScheduleImage ? 'Є' : 'Немає'}</TableCell>
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
