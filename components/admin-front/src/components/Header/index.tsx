import React, { useContext } from 'react'
import { Alert } from '@material-ui/lab'
import { AppBar, Snackbar, Tab, Tabs, ThemeProvider, Toolbar } from '@material-ui/core'
import theme from '../../shared/theme'
import { useLocation } from 'react-router-dom'
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

const locationTabMapper: { [k: string]: number } = {
  '/users': 0,
  '/faq': 4,
}

const Header: React.FC = () => {
  const location = useLocation()

  if (location.pathname === '/') return null

  return (
    <ThemeProvider theme={theme}>
      <AppBar position='static'>
        <Toolbar>
          <Tabs value={locationTabMapper[location.pathname]} variant='fullWidth'>
            <Tab label='Користувачі' href='/users'/>
            <Tab disabled label='Розклад' href='/users'/>
            <Tab disabled label='Групи' href='/users'/>
            <Tab disabled label='Повідомлення' href='/users'/>
            <Tab label='FAQ' href='/faq'/>
            <Tab disabled label='Статистика' href='/users'/>
          </Tabs>
        </Toolbar>
        <AuthErrorSnackbar/>
      </AppBar>
    </ThemeProvider>
  )
}

export default Header
