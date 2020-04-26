import React from 'react'
import {BrowserRouter, Route} from 'react-router-dom'
import {routes} from '../../routes'
import Header from '../../components/Header'

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
