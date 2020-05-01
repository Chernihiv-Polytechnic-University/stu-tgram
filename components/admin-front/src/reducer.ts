import {createContext, Dispatch} from 'react'
import { UserAttributes } from 'libs/domain-model'

export type AppState = {
  me: null | UserAttributes;
}

export type AppContext = {
  reducer: {
    state: AppState;
    dispatch: Dispatch<AppAction>;
  };
}

export enum AppActionType {
  SET_ME
}

export type AppAction = {
  type: AppActionType;
  payload: any;
}

export const initialState: AppState = {
  me: null,
}

export const reducer = (state: AppState, action: AppAction) => {
  switch (action.type) {
    case AppActionType.SET_ME:
      return {
        ...state,
        me: action.payload,
      }
  }

  return state
}

export const AppContext = createContext<AppContext>({
  reducer: {
    state: initialState,
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    dispatch: () => {}
  }
})


