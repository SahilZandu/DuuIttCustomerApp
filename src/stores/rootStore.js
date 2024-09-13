import {createContext} from 'react';
import CommonStore from './commonStore';
import AuthStore from './authStore';
import MyAddressStore from './myAddressStore';

export const rootStore = {
  authStore: new AuthStore(),
  commonStore: new CommonStore(),
  myAddressStore:new MyAddressStore(),

  
};
export const RootStoreContext = createContext(rootStore);
