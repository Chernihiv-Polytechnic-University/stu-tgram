import { createMuiTheme } from '@material-ui/core'

const theme = (createMuiTheme as any)({
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
      fontSize: '62px',
      letterSpacing: '0.02em',
      fontWeight: 500,
      fontStyle: 'normal'
    },
    h2: {
      fontSize: '24px',
      fontWeight: 500,
      letterSpacing: '0.05em',
      lineHeight: '28px'
    },
    h3: {
      fontSize: '19px',
      fontWeight: 500,
      lineHeight: '22px',
      fontStyle: 'normal',
      letterSpacing: '0.05em',
    },
    h4: {
      fontSize: '16px',
      fontWeight: 500,
      lineHeight: '150%',
      letterSpacing: '0.05em'
    },
    h5: {
      fontSize: '16px',
      fontWeight: 'normal',
      lineHeight: '150%',
      letterSpacing: '0.05em'
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
      root: {
        padding: '0 32px',
        height: '51px'
      },
      label: {
        fontSize: '16px',
        fontStyle: 'normal',
        fontWeight: 500,
        letterSpacing: '0.05em',
        textTransform: 'none'
      },
      containedPrimary: {
        borderRadius: '10px',
      },
      outlinedPrimary: {
        padding: '0 30px',
        border: '2px solid',
        borderRadius: '10px',
        '&:hover': {
          border: '2px solid'
        }
      }
    },
    MuiTableHead: {
      root: {
        backgroundColor: '#E9DEFF'
      }
    },
    MuiTableCell: {
      root: {
        fontSize: '16px',
        fontWeight: 'normal',
        padding: '9px 16px',
        lineHeight: '19px'
      },
      head: {
        color: '#00146D',
        fontWeight: 500
      }
    },
    MuiTableRow: {
      head: {
        height: '64px'
      },
      root: {
        height: '62px'
      },
      hover: {
        '&:hover': {
          backgroundColor: '#FFFFFF !important',
          boxShadow: '0px 0px 8px rgba(0, 83, 144, 0.3)',
          borderRadius: '10px',
          border: ''
        }
      }
    },
    MuiDialogActions: {
      root: {
        padding: '0px 40px',
        paddingBottom: '24px'
      }
    },
    MuiDialog: {
      paperWidthSm: {
        maxWidth: '769px'
      }
    },
    MuiDialogTitle: {
      root: {
        fontSize: '19px',
        fontStyle: 'normal',
        letterSpacing: '0.05em',
        color: '#005390',
        textAlign: 'center',
        padding: '23px 40px 19px'
      }
    },
    MuiDialogContent: {
      root: {
        padding: '24px 40px'
      }
    },
    MuiOutlinedInput: {
      notchedOutline: {
        border: '2px solid #949494',
        borderRadius: '10px'
      }
    },
    MuiToolbar: {
      root: {
        height: '80px'
      }
    },
    MuiTabs: {
      root: {
        width: '100%'
      },
      indicator: {
        backgroundColor: 'transparent'
      }
    },
    MuiTab: {
      textColorPrimary: {
        color: '#FFFFFF',
        textTransform: 'capitalize',
        fontSize: '16px',
        fontStyle: 'normal',
        fontWeight: 500,
        opacity: 1,
        '&$selected': {
          backgroundColor: '#2282A1',
          borderRadius: '20px',
          color: '#FFFFFF'
        }
      },
      textColorInherit: {
        color: '#005390',
        fontSize: '14px',
        textTransform: 'uppercase',
        opacity: 1,
      }
    },
    MuiPickersToolbar: {
      toolbar: {
        display: 'none'
      }
    }
  }
})

export default theme
