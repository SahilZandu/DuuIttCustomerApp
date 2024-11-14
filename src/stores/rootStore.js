import {createContext} from 'react';
import CommonStore from './commonStore';
import AuthStore from './authStore';
import MyAddressStore from './myAddressStore';
import ParcelStore from './parcelStore';
import DashboardStore from './dashboardStore';
import OrderStore from './orderStore';


export const rootStore = {
  authStore: new AuthStore(),
  commonStore: new CommonStore(),
  myAddressStore:new MyAddressStore(),
  parcelStore :new ParcelStore(),
  dashboardStore :new DashboardStore(),
  orderStore : new OrderStore(),
};
export const RootStoreContext = createContext(rootStore);
