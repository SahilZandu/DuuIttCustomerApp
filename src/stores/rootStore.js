import {createContext} from 'react';
import CommonStore from './commonStore';
import AuthStore from './authStore';
import MyAddressStore from './myAddressStore';
import ParcelStore from './parcelStore';
import DashboardStore from './dashboardStore';
import OrderStore from './orderStore';
import cartStore from './cartStore';
import CartStore from './cartStore';
import FoodDashStore from './foodDashStore'; 
import ChatStore from './chatStore';
// import FoodDashboardStore from './foodDashBoardStore';

export const rootStore = {
  authStore: new AuthStore(),
  commonStore: new CommonStore(),
  cartStore: new CartStore(),
  myAddressStore:new MyAddressStore(),
  parcelStore :new ParcelStore(),
  dashboardStore :new DashboardStore(),
  orderStore : new OrderStore(),
  foodDashboardStore : new FoodDashStore(),
  chatStore : new ChatStore(),
};
export const RootStoreContext = createContext(rootStore);
