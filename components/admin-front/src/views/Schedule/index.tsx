import React from 'react'
import { ThemeProvider, Typography, Container } from '@material-ui/core'
import theme from '../../shared/theme'
import ScheduleTabs from '../../components/SchedultTabs'
import { RouteWithSubRoutes } from '../App'
import { Switch } from 'react-router-dom'

const Schedule: React.FC<any> = (props) => {
  const { routes } = props

  return (<ThemeProvider theme={theme}>
    <Container>
      <Typography component="h3" variant="h3" align="left" color="textPrimary">Розклад</Typography>
      <ScheduleTabs/>
      <Switch>
        {routes.map( (route: any) => (<RouteWithSubRoutes key={route.path} {...route}/>))}
      </Switch>
    </Container>
  </ThemeProvider>)
}

export default Schedule