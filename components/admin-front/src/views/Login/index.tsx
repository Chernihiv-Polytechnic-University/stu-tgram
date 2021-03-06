import React, { useContext, useState } from 'react'
import { Button, Container, Grid, makeStyles, TextField, ThemeProvider, Typography } from '@material-ui/core'
import { useHistory } from 'react-router-dom'
import { AppActionType, AppContext } from '../../shared/reducer'
import theme from '../../shared/theme'
import logo from '../../assets/logo.svg'
import styles from './styles'
import loginImage from '../../assets/loginImagePNG.png'

const useStyles = makeStyles(styles)

const Login: React.FC = () => {
  const { client, reducer: { dispatch } } = useContext(AppContext)

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
    dispatch({ type: AppActionType.SET_ERROR, payload: null })
    history.push('/users')
  }

  // TODO сделать проверку поддерживает ли браузер webp
  return (
    <ThemeProvider theme={theme}>
      <div style={{ backgroundImage: `url(${loginImage})` }} className={classes.loginBackground}>
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
      </div>
    </ThemeProvider>
  )
}

export default Login
