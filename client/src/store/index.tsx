import React, { ReactElement } from "react";

const LOCAL_STORAGE_KEY = "store";

export interface RootStore {
  loggedIn: boolean;
}
const initStore = {
  loggedIn: false,
};
export enum RootActionType {
  LOGIN,
  LOGOUT,
}
interface RootAction {
  type: RootActionType;
  payload?: any;
}
export const RootContext = React.createContext<{
  store: RootStore;
  dispatch: React.Dispatch<RootAction>;
}>({ store: initStore, dispatch: () => null });

const RootReducer = (store = initStore, action: RootAction) => {
  switch (action.type) {
    case RootActionType.LOGIN: {
      return { ...store, loggedIn: true };
    }
    case RootActionType.LOGOUT: {
      return initStore;
    }
    default: {
      return store;
    }
  }
};
interface RootProps {
  children: ReactElement;
}
export const RootContextProvider: React.FC<RootProps> = ({ children }) => {
  const [store, dispatch] = React.useReducer(RootReducer, initStore, () => {
    const localState = localStorage.getItem(LOCAL_STORAGE_KEY);
    return localState ? JSON.parse(localState) : initStore;
  });
  React.useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(store));
  }, [store]);
  return (
    <RootContext.Provider value={{ store, dispatch }}>
      {children}
    </RootContext.Provider>
  );
};
