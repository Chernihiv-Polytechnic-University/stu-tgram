import React from 'react'
import Header from '../../components/Header'
import Login from '../Login'
import Groups from '../Groups'
import {BrowserRouter, Route} from 'react-router-dom'

const routes = [
    {
        path: '/groups',
        component: Groups
    },
    {
        path: '/',
        component: Login
    }
]

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Header/>
        {routes.map(route => (
            <Route
                key={route.path}
                path={route.path}
                exact
                component={route.component}/>
        ))}
    </BrowserRouter>
  )
}

export default App
