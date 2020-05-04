import React, { useContext } from 'react'
import CustomDialog from '../../CustomDialog'
import { MenuItem, Select, TextField, ThemeProvider, makeStyles } from '@material-ui/core'
import theme from '../../../shared/theme'
import { AppActionType, AppContext } from '../../../shared/reducer'
import styles from '../../../views/Users/styles'
import { UserAttributes } from 'libs/domain-model'
import { INITIAL_NEW_USER } from '../../../views/Users/constants'
import { INITIAL_ERROR, MAPPER } from './constants'
import { useHistory } from 'react-router-dom'
import ErrorSnackbar from '../../ErrorShackBar'

export type UpdateAccountDialogProps = {
  isDialogOpen: boolean
  handleClose: Function
}

const useStyles = makeStyles(styles)

const UpdateAccountDialog: React.FC<UpdateAccountDialogProps> = (props) => {
  const { isDialogOpen, handleClose } = props

  const { reducer: { state, dispatch } , client } = useContext(AppContext)
  const [updatedMe, setUpdatedMe] = React.useState<UserAttributes>(INITIAL_NEW_USER)
  const [updating, setUpdating] = React.useState<boolean>(false)
  const [newPassword, setNewPassword] = React.useState<string>('')
  const [confirmedNewPassword, setConfirmedNewPassword] = React.useState<string>('')
  const [error, setError] = React.useState<any>(INITIAL_ERROR)
  const [isUpdateSuccess, setUpdateSuccess] = React.useState<boolean>(true)

  const history = useHistory()

  const classes = useStyles()

  if(!updating) {
    setUpdating(true)
    setUpdatedMe({ ...state.me, password: '' } as UserAttributes)
    return null
  }

  const validateInput: any = (key: 'login' | 'newPassword' | 'confirmedNewPassword' | 'name', value: string) => {
    if (!['login', 'newPassword', 'confirmedNewPassword', 'name'].includes(key)) { return }
    setError({ ...error, [key]: !MAPPER[key].test(value) })
  }

  const handleFieldChange: any = (field: 'login' | 'name') => (event: React.ChangeEvent<{ value: string }>) => {
    setUpdatedMe({ ...updatedMe, [field]: event.target.value })
    validateInput(field, event.target.value)
  }

  const handlePasswordFieldChange: any = (key: 'newPassword' | 'confirmedNewPassword') => (event: React.ChangeEvent<{value: string}>) => {
    if (key === 'newPassword') {
      setNewPassword(event.target.value)
      if (event.target.value === '') {
        setError({ ...error, [key]: false })
        return
      }
      validateInput(key, event.target.value)
      return
    }
    setConfirmedNewPassword(event.target.value)
    if (event.target.value === '') {
      setError({ ...error, [key]: false })
      return
    }
    validateInput(key, event.target.value)
  }

  const handleDialogClose: any = () => {
    handleClose()
    setNewPassword('')
    setConfirmedNewPassword('')
    setUpdating(false)
    setError(INITIAL_ERROR)
    setUpdatedMe(INITIAL_NEW_USER)
  }

  const handleUpdateAccount: any = async () => {
    console.log({ newPassword, confirmedNewPassword, boo: newPassword === confirmedNewPassword })
    let password
    if (newPassword && confirmedNewPassword && newPassword === confirmedNewPassword) {
      password = newPassword
    }
    const result = await client.updateMe({ ...updatedMe, password })
    if (!result.isSuccess) {
      setUpdateSuccess(false)
    }
    if (password !== undefined) {
      history.push('/')
    } else {
      dispatch({ type: AppActionType.SET_ME, payload: { ...updatedMe } })
    }
    handleDialogClose()
  }

  const handleErrorSnackbarClose: any = () => {
    setUpdateSuccess(true)
  }

  return (<ThemeProvider theme={theme}>
    <ErrorSnackbar title={'Не вдалося змінити профіль'} handleClose={handleErrorSnackbarClose} error={!isUpdateSuccess}/>
    <CustomDialog
      isOpen={isDialogOpen}
      handleClose={handleDialogClose}
      title={'Змінити профіль'}
      buttonName={'Так, змінити'}
      handleSubmit={handleUpdateAccount}
      disable={!(!error.name && !error.newPassword && !error.confirmedNewPassword && !error.login)}
    >
      <TextField
        className={classes.formInput}
        value={updatedMe?.name}
        error={error.name}
        onChange={handleFieldChange('name')}
        variant='outlined'
        label='Введіть прізвище, ім’я, побатькові користувача'
        fullWidth/>
      <TextField
        className={classes.formInput}
        value={updatedMe?.login}
        error={error.login}
        onChange={handleFieldChange('login')}
        variant='outlined'
        label='Введіть електронну пошту користувача'
        type="email" fullWidth/>
      <TextField
        className={classes.formInput}
        error={error.newPassword}
        onChange={handlePasswordFieldChange('newPassword')}
        value={newPassword}
        variant='outlined'
        type='password'
        label='Введіть новий пароль' fullWidth/>
      <TextField
        className={classes.formInput}
        error={error.confirmedNewPassword}
        onChange={handlePasswordFieldChange('confirmedNewPassword')}
        value={confirmedNewPassword}
        variant='outlined'
        type='password'
        label='Повторіть ввод нового пароля' fullWidth/>
    </CustomDialog>

  </ThemeProvider>)
}

export default UpdateAccountDialog