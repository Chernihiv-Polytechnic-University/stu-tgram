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
  IconButton,
  makeStyles,
} from '@material-ui/core'
import TeacherInfo from './TeacherInfo'
import { AppContext } from '../../shared/reducer'
import theme from '../../shared/theme'
import styles from './styles'
import { ITEMS_PER_PAGE } from './constants'
import changeIcon from '../../assets/changeIcon.svg'
import threeDottIcon from '../../assets/threeDottIcon.svg'
import redCircle from '../../assets/redCircle.svg'
import greenCircle from '../../assets/greenCircle.svg'

const useStyles = makeStyles(styles as any)

const Teachers: React.FC = () => {
  const classes = useStyles()
  const { client } = useContext(AppContext)
  const [teachers, setTeachers] = useState<any[]>([])
  const [page, setPage] = useState<number>(0)
  const [query, setQuery] = useState<string>('')
  const [teacherId, setTeacherId] = useState<string | null>(null)


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

  const hideTeacherInfo = () => {
    setTeacherId(null)
  }

  const showTeacherInfo = (id: string) => () => {
    setTeacherId(id)
  }

  const exist = <div style={{ display: 'flex' }}>
    <img style={{ paddingRight: '16px' }} src={greenCircle} alt='Exist'/>
    <div>Існує</div>
  </div>

  const doesNotExist = <div style={{ display: 'flex' }}>
    <img style={{ paddingRight: '16px' }} src={redCircle} alt='Does not exist'/>
    <div>Не існує</div>
  </div>

  return (
    <ThemeProvider theme={theme}>
      <Container>
        <TeacherInfo teacherId={teacherId} onClose={hideTeacherInfo} />
        <Grid container direction='row' justify='space-between' alignItems='baseline'>
          <Typography component="h3" variant="h3" align="left" color="textPrimary">Викладачі</Typography>
          <TextField
            classes={{ root: classes.searchTextField }}
            variant='outlined'
            label='Пошук...'
            onChange={handleQueryChange} />
        </Grid>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell style={{ paddingLeft: '24px' }}>Прізвище І.П.</TableCell>
              <TableCell>Розклад пар</TableCell>
              <TableCell>Оновлено</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {teachers.map(teacher => {
              return (
                <TableRow key={teacher._id} hover>
                  <TableCell style={{ paddingLeft: '24px' }}>{teacher.name}</TableCell>
                  <TableCell>{teacher.lessonsScheduleImage ? exist : doesNotExist}</TableCell>
                  <TableCell>{formatISO(new Date(teacher.updatedAt), { representation: 'date' })}</TableCell>
                  <TableCell style={{ width: '50px' }}>
                    <IconButton aria-label='' onClick={showTeacherInfo(teacher._id)}>
                      <img src={changeIcon} alt='Показати'/>
                    </IconButton>
                  </TableCell>
                </TableRow>)
            })}
          </TableBody>
        </Table>
        <Button classes={{ root: classes.moreButton }} onClick={onMoreClick}>
          <img className={classes.dottStyle} src={threeDottIcon} alt='Three dott'/>
          Показати більше
        </Button>
      </Container>
    </ThemeProvider>
  )
}

export default Teachers
