import {createContext} from 'react';
import CommonStore from './commonStore';
import AuthStore from './authStore';
import MyAddressStore from './myAddressStore';
import ParcelStore from './parcelStore';

export const rootStore = {
  authStore: new AuthStore(),
  commonStore: new CommonStore(),
  myAddressStore:new MyAddressStore(),
  parcelStore :new ParcelStore(),

  
};
export const RootStoreContext = createContext(rootStore);
