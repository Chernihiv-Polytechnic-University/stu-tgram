import React from 'react'
import {BrowserRouter, Route} from 'react-router-dom'
import { AppContext, reducer, initialState } from '../../reducer'
import {routes} from '../../routes'
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



// import React, {useReducer} from 'react'
// import {ContextApp, initialState, testReducer} from "./reducer.js";
// import {IndexComponent} from "./IndexComponent.js"
//
// export const App = () => {
//   // Инициализируем reducer и получаем state + dispatch для записи
//   const [state, dispatch] = useReducer(testReducer, initialState);
//
//   return (
//     // Для того, чтобы мы могли использовать reducer в компонентах
//     // Воспользуемся ContextApp и передадим (dispatch и state)
//     // в компоненты ниже по иерархии
//     <ContextApp.Provider value={{dispatch, state}}>
//       <IndexComponent/>
//     </ContextApp.Provider>
//   )
// };
