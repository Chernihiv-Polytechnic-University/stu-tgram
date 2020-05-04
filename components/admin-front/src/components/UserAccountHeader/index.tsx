import React, { useContext } from 'react'
import { Grid, ThemeProvider, Typography, makeStyles , IconButton, Container, Menu, MenuItem } from '@material-ui/core'
import theme from '../../shared/theme'
import logo from '../../assets/logo.svg'
import downIcon from '../../assets/downIcon.svg'
import styles from './styles'
import { AppContext } from '../../shared/reducer'
import UpdateAccountDialog from './UpdateAccountDialog'
import { useHistory } from 'react-router-dom'

const useStyles = makeStyles(styles)

const UserAccountHeader: React.FC = () => {
  const { reducer: { state }, client } = useContext(AppContext)
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const [isUpdateDialogOpen, setUpdateDialogOpen] = React.useState<boolean>(false)

  const history = useHistory()

  const classes = useStyles()

  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleUpdateAccountClick: any = () => {
    setUpdateDialogOpen(true)
    setAnchorEl(null)
  }

  const handleLogoutClick: any = async () => {
    const result = await client.logout({})

    if (result.isSuccess) {
      history.push('/')
    }
    setAnchorEl(null)
  }

  const handleUpdateDialogClose: any = () => {
    setUpdateDialogOpen(false)
  }

  return (<ThemeProvider theme={theme}>
    <Container>
      <Grid className={classes.gridStyle} container direction='row' justify='space-between' alignItems='center'>
        <img className={classes.imageStyle} src={logo} alt='logo'/>
        <Grid item>
          <Grid container direction='row' justify='space-between' alignItems='center'>
            <Typography>Вітаємо, {state.me?.name}</Typography>
            <IconButton aria-haspopup="true" onClick={handleMenuClick}>
              <img src={downIcon} alt='Down'/>
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem onClick={handleUpdateAccountClick}>Змінити профіль</MenuItem>
              <MenuItem onClick={handleLogoutClick}>Вийти</MenuItem>
            </Menu>
          </Grid>
        </Grid>
      </Grid>
      {isUpdateDialogOpen ? (
        <UpdateAccountDialog
          handleClose={handleUpdateDialogClose}/>
      ) : null}
    </Container>
  </ThemeProvider>)
}

export default UserAccountHeader
