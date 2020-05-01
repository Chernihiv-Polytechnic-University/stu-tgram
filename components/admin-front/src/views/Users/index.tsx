import React, {useContext, useEffect, useState} from 'react'
import {
    Button,
    Container,
    Grid,
    Icon,
    IconButton, makeStyles,
    MenuItem,
    Select,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TextField,
    ThemeProvider,
    Typography
} from '@material-ui/core'
import {client} from '../../client'
import theme from '../../theme'
import CustomDialog from '../../components/CustomDialog'
import deleteIcon from '../../assets/deleteIcon.svg'
import managerIcon from '../../assets/managerIcon.svg'
import adminIcon from '../../assets/adminIcon.svg'
import {UserAttributes, UserRole} from 'libs/domain-model'
import {AppContext} from '../../reducer'

const useStyles = makeStyles({
    formInput: {
        paddingBottom: '24px'
    }
})

const INITIAL_NEW_USER: UserAttributes = {
    name: '',
    login: '',
    password: '',
    role: UserRole.manager
}

const INITIAL_ERROR: any = {
    name: false,
    login: false,
    password: false
}

const MAPPER = {
    login: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
    password: /^\w{6,14}$/,
    name: /^[a-zA-Z ]+$/
}

const Users: React.FC = () => {
    const { reducer: { state } } = useContext(AppContext)

    const [users, setUsers] = useState<any[]>([])
    const [isDialogOpen, setDialogOpen] = useState<boolean>(false)
    const [newUser, setUser] = useState<UserAttributes>(INITIAL_NEW_USER)
    const [error, setError] = useState<any>(INITIAL_ERROR)

    const classes = useStyles()

    const fetchUsers: any = async () => {
        const { result } = await client.getUsers({})
        if (result) {
            setUsers(result.docs)
        }
    }

    const deleteUserFromState: any = (userId: string) => {
        setUsers(prevState => prevState.filter(({ _id }) => _id !== userId))
    }

    const handleDeleteUser: any = async (id: string) => {
        const { isSuccess } = await client.deleteUser({ id })
        if (isSuccess) {
            deleteUserFromState(id)
        }
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
        setError({...error, [key]: !MAPPER[key].test(value)})
    }

    const handleInputChange: any = (event: React.ChangeEvent<{ value: string}>, key: string) => {
        setUser({...newUser, [key]: event.target.value})
        validateInput(key, event.target.value)
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
    }, [])

    console.log(error)

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
                onChange={(e) => handleInputChange(e, 'name')}
                variant='outlined'
                label='Введіть прізвище, ім’я, побатькові користувача'
                fullWidth/>
            <TextField
                className={classes.formInput}
                error={error.login}
                value={newUser.login}
                onChange={(e) => handleInputChange(e, 'login')}
                variant='outlined'
                label='Введіть електронну пошту користувача'
                type="email" fullWidth/>
            <div className={classes.formInput}>
                <Select
                    value={newUser.role}
                    onChange={(e) => handleInputChange(e, 'role')}
                    fullWidth variant={'outlined'}>
                    <MenuItem value="a">Адміністратор</MenuItem>
                    <MenuItem value="m">Менеджер</MenuItem>
                </Select>
            </div>
            <TextField
                className={classes.formInput}
                error={error.password}
                onChange={(e) => handleInputChange(e, 'password')}
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
                                            {state.me?.role === UserRole.admin ? <IconButton aria-label='' onClick={() => handleDeleteUser(user._id)}>
                                                <img src={deleteIcon} alt='Видалити'/>
                                            </IconButton> : null}
                                        </TableCell>
                                </TableRow>)
                        })}
                    </TableBody>
                </Table>
            </Container>
        </ThemeProvider>
    )
}

export default Users
