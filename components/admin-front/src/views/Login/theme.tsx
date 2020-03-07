import {createMuiTheme} from '@material-ui/core'

const theme = createMuiTheme({
    typography: {
        h3: {
            fontSize: '48px',
            letterSpacing: '0.02em',
            textTransform: 'uppercase',
            fontWeight: 'normal'
        }
    },
    overrides: {
        MuiButton: {
            contained: {
                backgroundColor: '#2767C6',
                borderRadius: '25px',
                border: 0,
                color: '#ffffff',
                height: 50,
                padding: '0 30px',
                '&:hover': {
                    backgroundColor: '#2767C6'
                }
            }
        }
    }
})

export default theme