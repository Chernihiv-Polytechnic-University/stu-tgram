import React, {useState} from 'react'
import {
    TextField,
    Container,
    Typography,
    Button,
    ThemeProvider
} from '@material-ui/core'
import { client } from '../../client'
import theme from '../../theme'
import {useHistory} from 'react-router-dom'

const Login: React.FC = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState(false)
    const history = useHistory()

    const handleEmailChange: any = (event: React.ChangeEvent<{ value: string }>) => {
        setEmail(event.target.value)
    }

    const handlePasswordChange: any = (event: React.ChangeEvent<{ value: string }>) => {
        setPassword(event.target.value)
    }

    const handleSignInClick: any = (event: React.ChangeEvent<{value: string}>) => {
        event.preventDefault()
        client.login({ login: email, password })
            .then((result) => {
                //console.log(result)
                if (result.isSuccess) {
                    history.push('/users')
                    setError(false)
                } else setError(true)
            })
            .then(() => client.getMe(null))
            .then((result) => {
                //console.log(result)
            })
        console.log(email, password)

    }

    return (
        <ThemeProvider theme={theme}>
            <Container maxWidth="xs">
                <div>
                    <Typography component="h1" variant="h1" align="center">
                        Sign in
                    </Typography>
                    <form noValidate>
                        <Typography component="p" align="left">Email:</Typography>
                        <TextField
                            error={error}
                            style={{marginBottom: '25px'}}
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            onChange={handleEmailChange}
                        />
                        <Typography component="p" align="left">Password:</Typography>
                        <TextField
                            error={error}
                            style={{marginBottom: '36px'}}
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            onChange={handlePasswordChange}
                        />
                        <Button
                            fullWidth
                            type="submit"
                            variant="contained"
                            onClick={handleSignInClick}
                        >
                            Sign In
                        </Button>
                    </form>
                </div>
            </Container>
        </ThemeProvider>
    )
}

export default Login