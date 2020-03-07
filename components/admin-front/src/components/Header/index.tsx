import React from 'react'
import {AppBar, Toolbar, Typography, IconButton} from '@material-ui/core'
import { Menu } from '@material-ui/icons'

const Header: React.FC = () => {
    return (
        <AppBar position="static">
            <Toolbar>
                <IconButton edge="start" color="inherit" aria-label="menu">
                    <Menu />
                </IconButton>
                <Typography variant="h6">
                    Demo
                </Typography>
            </Toolbar>
        </AppBar>
    )
}

export default Header