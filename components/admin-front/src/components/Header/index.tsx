import React, {useContext, useState} from 'react'
import { Alert } from '@material-ui/lab'
import { AppBar, Container, Snackbar, Tab, Tabs, ThemeProvider, Toolbar } from '@material-ui/core'
import theme from '../../shared/theme'
import { useHistory } from 'react-router-dom'
import { AppActionType, AppContext, AppError } from '../../shared/reducer'
import UserAccountHeader from '../UserAccountHeader'

const normalizePathname = (path: string) => {
  if (path.startsWith('/schedule')) {
    return '/schedule'
  }
  return path
}


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
        Помилка аутентифікації. Схоже що час сесії вичерпано. Будь ласка <a href='/'>ввійдіть знову</a>.
      </Alert>
    </Snackbar>
  )
}

const Header: React.FC = () => {
  const { reducer: { dispatch, state }, client } = useContext(AppContext)
  const history = useHistory()

  if (history.location.pathname === '/') return null

  const handleTabChange: any = (_: any, value: string) => {
    history.push(value)
  }

  if (!state.me) {
    client.getMe()
      .then((result: any) => {
        if (result.isSuccess)
          dispatch({ type: AppActionType.SET_ME, payload: result.result })
      })
  }

  return (
    <ThemeProvider theme={theme}>
      <UserAccountHeader/>
      <AppBar position='static'>
        <Container>
          <Toolbar>
            <Tabs
              value={normalizePathname(history.location.pathname)}
              variant='fullWidth'
              textColor='primary'
              onChange={handleTabChange}
            >
              <Tab label='Користувачі' value='/users'/>
              <Tab label='Розклад' value='/schedule'/>
              <Tab disabled label='Групи' href='/users'/>
              <Tab disabled label='Повідомлення' href='/users'/>
              <Tab label='FAQ' value='/faq'/>
              <Tab disabled label='Статистика' href='/users'/>
            </Tabs>
          </Toolbar>
        </Container>
        <AuthErrorSnackbar/>
      </AppBar>
    </ThemeProvider>
  )
}

export default Header
