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
  makeStyles, IconButton
} from '@material-ui/core'
import { AppContext } from '../../shared/reducer'
import theme from '../../shared/theme'
import GroupInfo from './GroupInfo'
import styles from './styles'
import { ITEMS_PER_PAGE } from './constants'
import changeIcon from '../../assets/changeIcon.svg'

const useStyles = makeStyles(styles as any)

const Groups: React.FC = () => {
  const classes = useStyles()
  const { client } = useContext(AppContext)
  const [groups, setGroups] = useState<any[]>([])
  const [page, setPage] = useState<number>(0)
  const [query, setQuery] = useState<string>('')
  const [groupId, setGroupId] = useState<string | null>(null)

  const hideGroupInfo = () => {
    setGroupId(null)
  }

  const showGroupInfo = (id: string) => () => {
    setGroupId(id)
  }

  const onMoreClick: any = () => {
    setPage(page + 1)
  }

  const fetchGroups = async () => {
    const { result, isSuccess } = await client.getGroups({ limit: ITEMS_PER_PAGE, page, query })

    if (!isSuccess) { return }

    if (page === 0) {
      setGroups(result.docs)
    } else {
      setGroups(old => [...old, ...result.docs])
    }
  }

  const handleQueryChange: any = (event: React.ChangeEvent<{ value: string}>) => {
    setPage(0)
    setQuery(event.target.value)
  }

  useEffect(() => {
    fetchGroups()
  }, [page, query])

  return (
    <ThemeProvider theme={theme}>
      <Container>
        <GroupInfo groupId={groupId} onClose={hideGroupInfo} />
        <Grid container direction='row' justify='space-between' alignItems='baseline'>
          <Typography component="h3" variant="h3" align="left" color="textPrimary">Групи</Typography>
        </Grid>
        <Grid container direction='row' justify='flex-end'>
          <TextField classes={{ root: classes.searchTextField }} variant='outlined' label='Пошук...' onChange={handleQueryChange} />
        </Grid>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Код</TableCell>
              <TableCell>Номер підгрупи</TableCell>
              <TableCell>Оновлено</TableCell>
              <TableCell>Графік учбового процесу</TableCell>
              <TableCell>Розклад пар</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {groups.map(group => {
              return (
                <TableRow key={group._id} hover>
                  <TableCell>{group.name}</TableCell>
                  <TableCell>{group.subgroupNumber}</TableCell>
                  <TableCell>{formatISO(new Date(group.updatedAt), { representation: 'date' })}</TableCell>
                  <TableCell>{group.educationScheduleImage ? 'Є' : 'Немає'}</TableCell>
                  <TableCell>{group.lessonsScheduleImage ? 'Є' : 'Немає'}</TableCell>
                  <TableCell>
                    <IconButton aria-label='' onClick={showGroupInfo(group._id)}>
                      <img src={changeIcon} alt='Показати'/>
                    </IconButton>
                  </TableCell>
                </TableRow>)
            })}
          </TableBody>
        </Table>
        <Button classes={{ root: classes.moreButton }} onClick={onMoreClick}>... Показати більше</Button>
      </Container>
    </ThemeProvider>
  )
}

export default Groups
