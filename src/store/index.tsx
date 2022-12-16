/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ReactNode, createContext, useState } from 'react';

export interface GlobalStateProps {
  children: ReactNode;
}

export const StateContext = createContext<
  [Record<string, any>, (key: string, newValue: any, defaultValue: any) => void]
>([{}, () => {}]);

export const GlobalState = ({ children }: GlobalStateProps) => {
  const [globalState, setGlobalState] = useState([]);

  const updateState = (key: string, newValue: any, defaultValue: any) => {
    setGlobalState((oldState) => {
      if (!oldState) {
        oldState = defaultValue;
      }
      if (oldState[key] !== newValue) {
        const newState = { ...oldState };
        newState[key] = newValue;
        return newState;
      } else {
        return oldState;
      }
    });
  };

  return (
    <StateContext.Provider value={[globalState, updateState]}>
      {children}
    </StateContext.Provider>
  );
};
