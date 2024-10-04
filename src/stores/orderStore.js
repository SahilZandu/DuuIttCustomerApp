import {action, computed, observable, runInAction} from 'mobx';
import {agent} from '../api/agent';
import {rootStore} from './rootStore';
import {useToast} from '../halpers/useToast';

export default class OrderStore {
  orderHistoryList = [];

  parcelsOfUser = async (order_type, limit, handleLoading) => {
    let requestData = {
      type: 'customer',
      order_type:
        order_type === 'All Orders' ? 'all' : order_type?.toLowerCase(),
      limit: limit,
    };

    console.log('requestData parcels Of User', requestData, limit);

    try {
      const res = await agent.parcelsOfUser(requestData);
      console.log('parcelsOfUser Res : ', res);
      if (res?.statusCode == 200) {
        // useToast(res?.message, 1);
        this.orderHistoryList = res?.data;
        handleLoading(false);
        return res?.data;
      } else {
        const message = res?.message ? res?.message : res?.data?.message;
        useToast(message, 0);
        handleLoading(false);
        return [];
      }
    } catch (error) {
      console.log('error parcelsOfUser:', error);
      handleLoading(false);
      const m = error?.data?.message
        ? error?.data?.message
        : 'Something went wrong';
      useToast(m, 0);
    }
    return [];
  };

  getOrderHistorybyFilters = async type => {
    const orderHistroy = this.orderHistoryList;

    if (type == 'All Orders') {
      return this.orderHistoryList;
    } else if (type == 'Food') {
      const filterList = orderHistroy?.filter(element =>
        element?.order_type?.includes('food'),
      );
      return filterList;
    } else if (type == 'Ride') {
      const filterList = orderHistroy?.filter(element =>
        element?.order_type?.includes('ride'),
      );
      return filterList;
    } else if (type == 'Parcel') {
      const filterList = orderHistroy?.filter(element =>
        element?.order_type?.includes('parcel'),
      );
      return filterList;
    } else {
      const filterList = orderHistroy?.filter(element =>
        element?.order_type?.includes(type?.toLowerCase()),
      );
      return filterList;
    }
  };
}
