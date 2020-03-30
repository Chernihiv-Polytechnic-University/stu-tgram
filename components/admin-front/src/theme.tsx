import {createMuiTheme} from '@material-ui/core'

const theme = createMuiTheme({
    palette: {
        text: {
            primary: '#544E4E'
        },
        primary: {
            main: '#005390',
            light: '#005390',
            dark: '#00146D'
        }
    },
    typography: {
        h1: {
            fontSize: '48px',
            letterSpacing: '0.02em',
            textTransform: 'uppercase',
            fontWeight: 'normal'
        },
        h3: {
            fontSize: '19px',
            fontWeight: 500,
            lineHeight: '22px',
            fontStyle: 'normal',
            letterSpacing: '0.05em',
        }
    },
    overrides: {
        MuiTypography: {
            h3: {
                paddingTop: '56px',
                paddingBottom: '40px'
            }
        },
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