import React from 'react'
import { BrowserRouter, Route } from 'react-router-dom'
import { AppContext, reducer, initialState } from '../../shared/reducer'
import { routes } from '../../shared/routes'
import Header from '../../components/Header'

const App: React.FC = () => {
  const [state, dispatch] = React.useReducer(reducer, initialState)

  return (
    <AppContext.Provider value={{ reducer: { state, dispatch } }}>
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
    </AppContext.Provider>
  )
}

export default App
