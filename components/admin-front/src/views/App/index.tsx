import React from 'react'
import Header from '../../components/Header'
import {BrowserRouter, Route} from 'react-router-dom'
import {routes} from '../../routes'

const App: React.FC = () => {
  return (
    <BrowserRouter>
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
