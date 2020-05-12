import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { initClient } from 'libs/admin-back-client'
import { AppContext, reducer, initialState, AppError, AppActionType } from '../../shared/reducer'
import { routes } from '../../shared/routes'
import Header from '../../components/Header'

export const RouteWithSubRoutes: React.FC = (route: any) => {
  return <Route path={route.path} render={(props ) => (
    <route.component {...props} routes={route.routes}/>
  )}/>
}

const App: React.FC = () => {
  const [state, dispatch] = React.useReducer(reducer, initialState)

  const client = initClient({ baseURL: process.env.REACT_APP_API_URL as string, apiPath: process.env.REACT_APP_API_PATH as string }, async (error: any) => {
    if (error?.response?.status === 401) {

      dispatch({ type: AppActionType.SET_ERROR, payload: AppError.AUTH_ERROR })

      return true
    }

    return false
  })

  return (
    <AppContext.Provider value={{ reducer: { state, dispatch }, client }}>
      <BrowserRouter>
        <Header/>
        <Switch>
          {routes.map(route => (
            <RouteWithSubRoutes key={route.path} {...route}/>
          ))}
        </Switch>
      </BrowserRouter>
    </AppContext.Provider>
  )
}

export default App
