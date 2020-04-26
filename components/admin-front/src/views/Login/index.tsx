import React, {useState} from 'react'
import {
    TextField,
    Container,
    Typography,
    Button,
    ThemeProvider, Grid, makeStyles
} from '@material-ui/core'
import { client } from '../../client'
import theme from '../../theme'
import {useHistory} from 'react-router-dom'
import logo from '../../assets/logo.svg'

const useStyles = makeStyles({
    logo: {
        marginTop: '111px',
        marginBottom: '72px'
    },
    heading: {
        marginBottom: '72px'
    },
    textField: {
        height: '64px',
        margin: '0 0 32px 0'
    },
    button: {
        height: '64px'
    }
})

const Login: React.FC = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState(false)
    const history = useHistory()

    const classes = useStyles()

    const handleEmailChange: any = (event: React.ChangeEvent<{ value: string }>) => {
        setEmail(event.target.value)
    }

    const handlePasswordChange: any = (event: React.ChangeEvent<{ value: string }>) => {
        setPassword(event.target.value)
    }

    const handleSignInClick: any = (event: React.ChangeEvent<{value: string}>) => {
        event.preventDefault()
        client.login({ login: email, password })
            .then((result: any) => {
                //console.log(result)
                if (result.isSuccess) {
                    history.push('/users')
                    setError(false)
                } else setError(true)
            })
            .then(() => client.getMe(null))
            .then((result: any) => {
                //console.log(result)
            })
        console.log(email, password)

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
                            onChange={handleEmailChange}
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
                            onChange={handlePasswordChange}
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