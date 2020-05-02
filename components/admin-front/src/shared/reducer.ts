import { createContext, Dispatch } from 'react'
import { UserAttributes } from 'libs/domain-model'

export enum AppError {
  AUTH_ERROR
}

export type AppState = {
  me: null | UserAttributes
  error: null | AppError
}

export type AppContext = {
  reducer: {
    state: AppState
    dispatch: Dispatch<AppAction>
  }
  client: any
}

export enum AppActionType {
  SET_ME,
  SET_ERROR
}

export type AppAction = {
  type: AppActionType
  payload: any
}

export const initialState: AppState = {
  me: null,
  error: null
}

export const reducer = (state: AppState, action: AppAction) => {
  switch (action.type) {
  case AppActionType.SET_ME: return { ...state, me: action.payload }
  case AppActionType.SET_ERROR: return { ...state, error: action.payload }
  }

  return state
}

export const AppContext = createContext<AppContext>({
  reducer: {
    state: initialState,
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    dispatch: () => {},
  },
  client: {},
})
