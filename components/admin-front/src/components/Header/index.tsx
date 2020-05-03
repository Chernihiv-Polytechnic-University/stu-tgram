import React, { useContext } from 'react'
import { Alert } from '@material-ui/lab'
import { AppBar, Snackbar, Tab, Tabs, ThemeProvider, Toolbar } from '@material-ui/core'
import theme from '../../shared/theme'
import { useHistory } from 'react-router-dom'
import { AppActionType, AppContext, AppError } from '../../shared/reducer'

const AuthErrorSnackbar: React.FC = () => {
  const { reducer: { state, dispatch } } = useContext(AppContext)

  const handleClose = (): void => {
    dispatch({ type: AppActionType.SET_ERROR, payload: null })
  }

  return (
    <Snackbar
      open={state.error === AppError.AUTH_ERROR}
      onClose={handleClose}
    >
      <Alert onClose={handleClose} elevation={6} variant="filled" severity="error">
        Помилка аутентифікації. Схоже що час сесії вичерпано. Будь ласка <a href='/'>перелогінтесь</a>.
      </Alert>
    </Snackbar>
  )
}

const Header: React.FC = () => {
  const history = useHistory()

  if (history.location.pathname === '/') return null

  const handleTabChange: any = (_: any, value: string) => {
    history.push(value)
  }


  return (
    <ThemeProvider theme={theme}>
      <AppBar position='static'>
        <Toolbar>
          <Tabs value={history.location.pathname} variant='fullWidth' onChange={handleTabChange}>
            <Tab label='Користувачі' value='/users'/>
            <Tab disabled label='Розклад' href='/users'/>
            <Tab disabled label='Групи' href='/users'/>
            <Tab disabled label='Повідомлення' href='/users'/>
            <Tab label='FAQ' value='/faq'/>
            <Tab disabled label='Статистика' href='/users'/>
          </Tabs>
        </Toolbar>
        <AuthErrorSnackbar/>
      </AppBar>
    </ThemeProvider>
  )
}

export default Header
