import {createContext} from 'react';
import CommonStore from './commonStore';
import AuthStore from './authStore';

export const rootStore = {
  authStore: new AuthStore(),
  commonStore: new CommonStore(),

  
};
export const RootStoreContext = createContext(rootStore);
