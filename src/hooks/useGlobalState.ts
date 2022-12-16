/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext } from 'react';
import { StateContext } from '../store';

export const useGlobalState = <T = any>(
  key: string,
  defaultValue: any,
): [T, (value: any) => ReturnType<typeof updateState>] => {
  const [state, updateState] = useContext(StateContext);
  return [
    (state[key] || defaultValue) as T,
    (value: any) => updateState(key, value, defaultValue),
  ];
};
