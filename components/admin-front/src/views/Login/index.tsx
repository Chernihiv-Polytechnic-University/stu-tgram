import React, { useContext, useState } from 'react'
import { Button, Container, Grid, makeStyles, TextField, ThemeProvider, Typography } from '@material-ui/core'
import { useHistory } from 'react-router-dom'
import { AppActionType, AppContext } from '../../shared/reducer'
import { client } from '../../shared/client'
import theme from '../../shared/theme'
import logo from '../../assets/logo.svg'
import styles from './styles'

const useStyles = makeStyles(styles)

const Login: React.FC = () => {
  const { reducer: { dispatch } } = useContext(AppContext)

  const [error, setError] = useState(false)
  const [credentials, setCredentials] = useState({ email: '', password: '' })

  const classes = useStyles()
  const history = useHistory()

  const handleFieldChange = (field: 'email' | 'password') => (event: React.ChangeEvent<{ value: string }>) => {
    setCredentials({ ...credentials, [field]: event.target.value })
  }

  const handleSignInClick: any = async (event: React.ChangeEvent<{value: string}>) => {
    event.preventDefault()
    const { isSuccess: isLoginSuccess } = await client.login({ login: credentials.email, password: credentials.password })

    if (!isLoginSuccess) {
      // TODO show error to user with snack bar
      setError(true)
      return
    }

    const { isSuccess: isGetMeSuccess, result: currentUserInfo } = await client.getMe(null)

    if (!isGetMeSuccess) {
      // TODO show error to user with snack bar
      setError(true)
      return
    }

    dispatch({ type: AppActionType.SET_ME, payload: currentUserInfo })
    history.push('/users')
  }

  return (
    <ThemeProvider theme={theme}>
      <Container>
        <Grid container xs={5} direction='column' alignItems='center'>
          <div className={classes.logo}>
            <img src={logo} alt='Logo'/>
          </div>
          <Typography component="h1" variant="h1" color='primary' className={classes.heading}>
                        З поверненням!
          </Typography>
          <form noValidate>
            <TextField
              className={classes.textField}
              error={error}
              variant="outlined"
              required
              fullWidth
              id="email"
              name="email"
              autoComplete="email"
              autoFocus
              label='Email'
              onChange={handleFieldChange('email')}
            />
            <TextField
              className={classes.textField}
              error={error}
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              type="password"
              id="password"
              autoComplete="current-password"
              onChange={handleFieldChange('password')}
              label='Пароль'
            />
            <Button
              className={classes.button}
              fullWidth
              type="submit"
              variant="contained"
              color='primary'
              onClick={handleSignInClick}
            >
              Увійти
            </Button>
          </form>
        </Grid>
      </Container>
    </ThemeProvider>
  )
}

export default Login
