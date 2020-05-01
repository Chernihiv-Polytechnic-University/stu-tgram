import React from 'react'
import {AppBar, Toolbar, Tabs, Tab, ThemeProvider} from '@material-ui/core'
import theme from '../../shared/theme'
import {useLocation} from 'react-router-dom'

const Header: React.FC = () => {
    const location = useLocation()

    if (location.pathname === '/') return null

    return (
        <ThemeProvider theme={theme}>
            <AppBar position='static'>
                <Toolbar>
                    <Tabs value={0} variant='fullWidth'>
                        <Tab label='Користувачі' href='/users'/>
                        <Tab label='Розклад' href='/users'/>
                        <Tab label='Групи' href='/users'/>
                        <Tab label='Повідомлення' href='/users'/>
                        <Tab label='FAQ' href='/faq'/>
                        <Tab label='Статистика' href='/users'/>
                    </Tabs>
                </Toolbar>
            </AppBar>
        </ThemeProvider>

    )
}

export default Header
