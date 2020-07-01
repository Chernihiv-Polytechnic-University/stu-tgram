import React, {useCallback, useContext, useEffect, useState} from 'react'
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
import GroupInfo from './GroupInfo'
import styles from './styles'
import { ITEMS_PER_PAGE } from './constants'
import threeDottIcon from '../../assets/threeDottIcon.svg'
import redCircle from '../../assets/redCircle.svg'
import greenCircle from '../../assets/greenCircle.svg'

const useStyles = makeStyles(styles as any)

const Groups: React.FC = () => {
  const classes = useStyles()
  const { client } = useContext(AppContext)
  const [groups, setGroups] = useState<any[]>([])
  const [page, setPage] = useState<number>(0)
  const [query, setQuery] = useState<string>('')
  const [groupId, setGroupId] = useState<string | null>(null)
  const [count, setCount] = useState<number>(0)

  const hideGroupInfo = () => {
    setGroupId(null)
  }

  const showGroupInfo = (group: any) => () => {
    if (!group.educationScheduleImage || !group.lessonsScheduleImage) return
    setGroupId(group._id)
  }

  const onMoreClick: any = () => {
    setPage(page + 1)
  }

  const fetchGroups = useCallback(async () => {
    const { result, isSuccess } = await client.getGroups({ limit: ITEMS_PER_PAGE, page, query })

    if (!isSuccess) { return }

    setCount(result.count)
    if (page === 0) {
      setGroups(result.docs)
    } else {
      setGroups(old => [...old, ...result.docs])
    }
  }, [page, query, client])

  const handleQueryChange: any = (event: React.ChangeEvent<{ value: string}>) => {
    setPage(0)
    setQuery(event.target.value)
  }

  useEffect(() => {
    fetchGroups()
  }, [fetchGroups])

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
        <GroupInfo groupId={groupId} onClose={hideGroupInfo} />
        <Grid container direction='row' justify='space-between' alignItems='baseline'>
          <Typography component="h3" variant="h3" align="left" color="textPrimary">Групи</Typography>
          <TextField
            classes={{ root: classes.searchTextField }}
            variant='outlined'
            label='Пошук...'
            onChange={handleQueryChange} />
        </Grid>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell className={classes.groupHeaderStyle}>Група</TableCell>
              <TableCell className={classes.subGroupHeaderStyle}>Підгрупа</TableCell>
              <TableCell style={{ paddingLeft: '66px' }}>Графік навчального процесу</TableCell>
              <TableCell>Розклад занять</TableCell>
              <TableCell>Оновлено</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {groups.map(group => {
              return (
                <TableRow key={group._id} hover onClick={showGroupInfo(group)}>
                  <TableCell className={classes.groupStyle}>{group.name}</TableCell>
                  <TableCell className={classes.subGroupStyle}>{group.subgroupNumber}</TableCell>
                  <TableCell style={{ paddingLeft: '66px', width: '300px' }}>{group.educationScheduleImage ? exist : doesNotExist}</TableCell>
                  <TableCell style={{ width: '200px' }}>{group.lessonsScheduleImage ? exist : doesNotExist}</TableCell>
                  <TableCell>{formatISO(new Date(group.updatedAt), { representation: 'date' })}</TableCell>
                </TableRow>)
            })}
          </TableBody>
        </Table>
        {groups.length < count ? <Button classes={{ root: classes.moreButton }} onClick={onMoreClick}>
          <img className={classes.dottStyle} src={threeDottIcon} alt='Three dott'/>
          Показати більше
        </Button> : <div style={{ paddingBottom: '50px' }}/>}
      </Container>
    </ThemeProvider>
  )
}

export default Groups
