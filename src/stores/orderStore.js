import { action, computed, observable, runInAction } from 'mobx';
import { agent } from '../api/agent';
import { rootStore } from './rootStore';
import { useToast } from '../halpers/useToast';

export default class OrderStore {
  orderHistoryList = [];
  orderTrackingList = [];
  parcelOrderInProgress = [];
  rideOrderInProgress = [];
  h3PolyData = []


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
        this.orderHistoryList = res?.data;
        handleLoading(false);
        return res?.data;
      } else {
        handleLoading(false);
        return [];
      }
    } catch (error) {
      console.log('error parcelsOfUser:', error);
      handleLoading(false);
      return [];
    }
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

  ordersRecentOrder = async (type, handleLoading) => {
    handleLoading(true);
    let requestData = {
      type: type,
      sender: 'customer',
    };

    console.log('orders Recent Order User', requestData);

    try {
      const res = await agent.ordersRecentOrder(requestData);
      console.log('orders Recent Order Res : ', res);
      if (res?.statusCode == 200) {
        handleLoading(false);
        return res?.data;
      } else {
        handleLoading(false);
        return [];
      }
    } catch (error) {
      console.log('error orders Recent Order:', error);
      handleLoading(false);
      return [];
    }
  };

  ordersTrackOrder = async handleLoading => {
    try {
      const res = await agent.ordersTrackOrder();
      console.log('orders Track Order Res : ', res);
      if (res?.statusCode == 200) {
        res?.data?.length > 0
          ? (this.orderTrackingList = res?.data)
          : (this.orderTrackingList = []);
        handleLoading(false);
        // return res?.data;
        return res;
      } else {
        this.orderTrackingList = [];
        handleLoading(false);
        return [];
      }
    } catch (error) {
      console.log('error orders Track Order:', error);
      handleLoading(false);
      this.orderTrackingList = [];
      return [];
    }
  };

  getPendingForCustomer = async type => {
    let requestData = {
      type: type,
      sender: 'customer',
    };

    try {
      const res = await agent.pendingForCustomer(requestData);
      console.log('pending For Customer Res : ', res);
      if (res?.statusCode == 200) {
        const resFilter = res?.data?.filter((item) =>
          item?.order_type?.toLowerCase() === type?.toLowerCase()
        );
        return resFilter ?? [];
      } else {
        return [];
      }
    } catch (error) {
      console.log('error orders getPendingForCustomer:', error);
      // return [];
    }
  };

  updateOrderStatus = async (
    parcelId,
    status,
    handleDeleteLoading,
    onDeleteSuccess,
    isPopUp,
  ) => {
    let requestData = {
      parcel_id: parcelId,
      status: status,
    };
    console.log('update Order Status request ', requestData);
    try {
      const res = await agent.updateOrderStatus(requestData);
      console.log('update Order Status Res : ', res);
      if (res?.statusCode == 200) {
        if (isPopUp) {
          useToast(res?.message, 1);
        }
        onDeleteSuccess();
      } else {
        const message = res?.message ? res?.message : res?.data?.message;
        if (isPopUp) {
          useToast(message, 0);
        }
      }
      handleDeleteLoading(false);
    } catch (error) {
      console.log('error update Order Status:', error);
      handleDeleteLoading(false);
      const m = error?.data?.message
        ? error?.data?.message
        : 'Something went wrong';
      if (isPopUp) {
        useToast(m, 0);
      }
    }
  };


  foodOrdersInvoice = async (
    data, handleLoading
  ) => {
    handleLoading(true);
    let requestData = {
      orderId: data?._id,
    };
    console.log('foodOrdersInvoice request ', requestData);
    try {
      const res = await agent.foodOrdersInvoice(requestData);
      console.log('foodOrdersInvoice Res : ', res);
      if (res?.statusCode == 200) {
        useToast(res?.message, 1);
        handleLoading(false);
        return res;
      } else {
        const message = res?.message ? res?.message : res?.data?.message;
        useToast(message, 0);
        handleLoading(false);
        return res;
      }

    } catch (error) {
      console.log('foodOrdersInvoice error:', error);
      handleLoading(false);
      const m = error?.data?.message
        ? error?.data?.message
        : 'Something went wrong';
      useToast(m, 0);
      return []
    }
  };


  setParcelTrackingOrder = async (data) => {
    this.orderTrackingList = data
  }

  setParcelOrderInProgress = async (data) => {
    this.parcelOrderInProgress = data
  }

  setRideOrderInProgress = async (data) => {
    this.rideOrderInProgress = data
  }





  geth3Polygons = async () => {
    try {
      const res = await agent.geth3Polygons();
      console.log('geth3Polygons Res : ', res);
      if (res?.statusCode == 200) {
        res?.data?.length > 0 ? this.h3PolyData = res?.data : this.h3PolyData = []
        return res?.data;
      } else {
        this.h3PolyData = []
        return [];
      }
    } catch (error) {
      console.log('error geth3Polygons:', error);
      this.h3PolyData = []
      return [];
    }
  };

}
