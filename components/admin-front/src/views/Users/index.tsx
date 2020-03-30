import React, {useEffect, useState} from 'react'
import {
    Container,
    Typography,
    ThemeProvider,
    Table,
    TableHead,
    TableCell,
    TableBody, TableRow, Button, TextField, Select, MenuItem
} from '@material-ui/core'
import {client} from '../../client'
import theme from '../../theme'
import {InputWithId} from '../../../../../libs/admin-back-client/dist/shared'
import CustomDialog from '../../components/CustomDialog'
import {CreateUserInput} from '../../../../../libs/admin-back-client/dist/users'

const INITIAL_NEW_USER: CreateUserInput = {
    name: '',
    login: '',
    password: '',
    role: 'm'
}

const Users: React.FC = () => {
    const [users, setUsers] = useState<any[]>([])
    const [isDialogOpen, setDialogOpen] = useState<boolean>(false)
    const [newUser, setUser] = useState<CreateUserInput>(INITIAL_NEW_USER)

    const fetchUsers: any = async () => {
        const { result } = await client.getUsers(null)
        if (result) {
            setUsers(result.docs)
            console.log(result)
        }
    }

    const deleteUserFromState: any = (userId: string) => {
        setUsers(prevState => prevState.filter(({ _id }) => _id !== userId))
    }

    const handleDeleteUser: any = async (id: string) => {
        const inputWithId: InputWithId = {
            id: id
        }
        const { isSuccess } = await client.deleteUser(inputWithId)
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

    const handleInputChange: any = (event: React.ChangeEvent<{ value: string}>, key: string) => {
        setUser({...newUser, [key]: event.target.value})
    }

    const handleCreateUser: any = async () => {
        const { isSuccess } = await client.createUser(newUser)
        if (isSuccess){
            setUsers(prevUsers => prevUsers.concat(newUser))
            setUser(INITIAL_NEW_USER)
        }
        handleDialogClose()
    }

    console.log(newUser)

    useEffect(() => {
        fetchUsers()
    }, [])
    
    const userCreateDialog =
        <CustomDialog
            isOpen={isDialogOpen}
            handleClose={handleDialogClose}
            title={'Користувачі'} buttonName={'Створити'} handleSubmit={handleCreateUser}>
            <TextField
                value={newUser.name}
                onChange={(e) => handleInputChange(e, 'name')}
                variant='outlined'
                label='Введіть прізвище, ім’я, побатькові користувача'
                fullWidth/>
            <TextField
                value={newUser.login}
                onChange={(e) => handleInputChange(e, 'login')}
                variant='outlined'
                label='Введіть електронну пошту користувача'
                type="email" fullWidth/>
            <Select
                value={newUser.role}
                onChange={(e) => handleInputChange(e, 'role')}
                fullWidth variant={'outlined'}>
                <MenuItem value="a">Адміністратор</MenuItem>
                <MenuItem value="m">Менеджер</MenuItem>
            </Select>
            <TextField
                onChange={(e) => handleInputChange(e, 'password')}
                value={newUser.password}
                variant='outlined'
                type='password'
                label='Введіть пароль' fullWidth/>
        </CustomDialog>
    
    return (
        <ThemeProvider theme={theme}>
            <Container>
                <Typography component="h3" variant="h3" align="left" color="textPrimary">Користувачі</Typography>
                <Button onClick={handleDialogOpen}>Додати користувача</Button>
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
                            return (<TableRow key={user._id}>
                                    <TableCell>{user.role}</TableCell>
                                    <TableCell>{user.name}</TableCell>
                                    <TableCell>{user.login}</TableCell>
                                    <TableCell>
                                        <Button onClick={() => handleDeleteUser(user._id)}>Delete</Button>
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