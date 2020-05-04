import React, { useContext, useEffect, useState } from 'react'
import { UserAttributes, UserRole } from 'libs/domain-model'
import {
  Button,
  Container,
  Grid,
  Icon,
  IconButton,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  ThemeProvider,
  Typography,
  makeStyles,
} from '@material-ui/core'
import theme from '../../shared/theme'
import CustomDialog from '../../components/CustomDialog'
import deleteIcon from '../../assets/deleteIcon.svg'
import managerIcon from '../../assets/managerIcon.svg'
import adminIcon from '../../assets/adminIcon.svg'
import { AppContext } from '../../shared/reducer'
import { INITIAL_ERROR, INITIAL_NEW_USER, MAPPER, ITEMS_PER_PAGE } from './constants'
import styles from './styles'

const useStyles = makeStyles(styles)

const Users: React.FC = () => {
  const { reducer: { state }, client } = useContext(AppContext)

  const [users, setUsers] = useState<(UserAttributes & { _id?: string })[]>([])
  const [isDialogOpen, setDialogOpen] = useState<boolean>(false)
  const [isDialogDeleteOpen, setDialogDeleteOpen] = useState<boolean>(false)
  const [deletingUserId, setDeletingUserId] = useState<string>('')
  const [newUser, setUser] = useState<UserAttributes>(INITIAL_NEW_USER)
  const [error, setError] = useState<any>(INITIAL_ERROR)
  const [page, setPage] = useState<number>(0)

  const classes = useStyles()

  const onMoreClick: any = () => {
    setPage(page + 1)
  }

  const fetchUsers: any = async () => {
    const { result, isSuccess } = await client.getUsers({ limit: ITEMS_PER_PAGE, page })
    if (!isSuccess) { return }
    if (page === 0) {
      setUsers(result.docs)
      return
    }
    setUsers([...users, ...result?.docs as []])
  }

  const refresh: any = () => {
    if (page !== 0) {
      setPage(0)
    } else {
      fetchUsers()
    }
  }

  const handleDeleteDialogOpen: any = (id: string) => () => {
    setDialogDeleteOpen(true)
    setDeletingUserId(id)
  }

  const handleDeleteDialogClose: any = () => {
    setDialogDeleteOpen(false)
    setDeletingUserId('')
  }

  const handleDeleteUser: any = async () => {
    const { isSuccess } = await client.deleteUser({ id: deletingUserId })
    if (!isSuccess) { return }

    handleDeleteDialogClose()
    refresh()
  }

  const handleDialogClose: any = () => {
    setDialogOpen(false)
    setUser(INITIAL_NEW_USER)
  }

  const handleDialogOpen: any = () => {
    setDialogOpen(true)
  }

  const validateInput: any = (key: 'login' | 'password' | 'name', value: string) => {
    if (!['login', 'password', 'name'].includes(key)) { return }
    setError({ ...error, [key]: !MAPPER[key].test(value) })
  }

  const handleFieldChange: any = (field: 'login' | 'password' | 'name') => (event: React.ChangeEvent<{ value: string}>) => {
    setUser({ ...newUser, [field]: event.target.value })
    validateInput(field, event.target.value)
  }

  const handleCreateUser: any = async () => {
    const { isSuccess } = await client.createUser(newUser)
    if (isSuccess){
      setUsers(prevUsers => prevUsers.concat(newUser))
      setUser(INITIAL_NEW_USER)
    }
    handleDialogClose()
  }

  useEffect(() => {
    fetchUsers()
  }, [page])

  const deleteDialog = (
    <CustomDialog
      isOpen={isDialogDeleteOpen}
      handleClose={handleDeleteDialogClose}
      title='Видалити користувача?'
      buttonName='Так, видалити користувача'
      handleSubmit={handleDeleteUser}
      disable={false}>
      <Typography>Ви впевнені, що хочете видалити користувача?</Typography>
    </CustomDialog>
  )

  const userCreateDialog =
        <CustomDialog
          isOpen={isDialogOpen}
          handleClose={handleDialogClose}
          disable={!(!error.name && !error.password && !error.login)}
          title={'Створити нового користувача'} buttonName={'Створити'} handleSubmit={handleCreateUser}>
          <TextField
            className={classes.formInput}
            error={error.name}
            value={newUser.name}
            onChange={handleFieldChange('name')}
            variant='outlined'
            label='Введіть прізвище, ім’я, побатькові користувача'
            fullWidth/>
          <TextField
            className={classes.formInput}
            error={error.login}
            value={newUser.login}
            onChange={handleFieldChange('login')}
            variant='outlined'
            label='Введіть електронну пошту користувача'
            type="email" fullWidth/>
          <div className={classes.formInput}>
            <Select
              value={newUser.role}
              onChange={handleFieldChange('role')}
              fullWidth variant={'outlined'}>
              <MenuItem value="a">Адміністратор</MenuItem>
              <MenuItem value="m">Менеджер</MenuItem>
            </Select>
          </div>
          <TextField
            className={classes.formInput}
            error={error.password}
            onChange={handleFieldChange('password')}
            value={newUser.password}
            variant='outlined'
            type='password'
            label='Введіть пароль' fullWidth/>
        </CustomDialog>

  return (
    <ThemeProvider theme={theme}>
      <Container>
        <Grid container direction='row' justify='space-between' alignItems='baseline'>
          <Typography component="h3" variant="h3" align="left" color="textPrimary">Користувачі</Typography>
          {state.me?.role === UserRole.admin ? <Button onClick={handleDialogOpen}
            variant='outlined'
            color='primary'>Додати користувача
          </Button> : null}
        </Grid>
        {userCreateDialog}
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Роль</TableCell>
              <TableCell>Ім’я</TableCell>
              <TableCell>Email</TableCell>
              <TableCell/>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map(user => {
              return (<TableRow key={user._id} hover>
                <TableCell>
                  <Icon>
                    <img src={user.role === 'm' ? managerIcon : adminIcon}
                      alt={user.role === 'm' ? 'Менеджер' : 'Адміністратор'}/>
                  </Icon>
                </TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.login}</TableCell>
                <TableCell>
                  {state.me?.role === UserRole.admin ? <IconButton aria-label='' onClick={handleDeleteDialogOpen(user._id)}>
                    <img src={deleteIcon} alt='Видалити'/>
                  </IconButton> : null}
                </TableCell>
              </TableRow>)
            })}
          </TableBody>
        </Table>
        <Button classes={{ root: classes.moreButton }} onClick={onMoreClick}>... Показати більше</Button>
        {deleteDialog}
      </Container>
    </ThemeProvider>
  )
}

export default Users
