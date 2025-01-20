import {action, computed, observable, runInAction} from 'mobx';
import {agent} from '../api/agent';
import {rootStore} from './rootStore';
import {useToast} from '../halpers/useToast';

export default class FoodDashStore {
  restaurentList = [];
  orderTrackingList = [];

  restaurentAll = async (geoLocation,selectedFilter, limit, handleLoading) => {
  
   // let vegNonVeg='';
   let requestData;
    if(selectedFilter === 'veg' || 
    selectedFilter === 'non-veg' ){
       requestData = {
        near_by: {
          lng: geoLocation.lng,
          lat: geoLocation.lat,
        },
        veg_non_veg: selectedFilter,
         // limit: limit,
      };
    }

    else if(selectedFilter === 'price_low'  ){
       requestData = {
        near_by: {
          lng: geoLocation.lng,
          lat: geoLocation.lat,
        },
        price_low: selectedFilter,
         // limit: limit,
      };
    }
    else{
      requestData = {
        near_by: {
          lng: geoLocation.lng,
          lat: geoLocation.lat,
        },
        
      };
    }
    

    console.log('requestData retaurentsList', requestData, limit);

    try {
      const res = await agent.restaurentAll(requestData);
      console.log('restaurentAll Res : ', res);
      if (res?.statusCode == 200) {
        // useToast(res?.message, 1);
        this.restaurentList = res?.data;
        handleLoading(false);
        return res?.data;
      } else {
        const message = res?.message ? res?.message : res?.data?.message;
        // useToast(message, 0);
        handleLoading(false);
        return [];
      }
    } catch (error) {
      console.log('error parcelsOfUser:', error);
      handleLoading(false);
      const m = error?.data?.message
        ? error?.data?.message
        : 'Something went wrong';
      // useToast(m, 0);
      return [];
    }
  };

  // getOrderHistorybyFilters = async type => {
  //   const orderHistroy = this.orderHistoryList;

  //   if (type == 'All Orders') {
  //     return this.orderHistoryList;
  //   } else if (type == 'Food') {
  //     const filterList = orderHistroy?.filter(element =>
  //       element?.order_type?.includes('food'),
  //     );
  //     return filterList;
  //   } else if (type == 'Ride') {
  //     const filterList = orderHistroy?.filter(element =>
  //       element?.order_type?.includes('ride'),
  //     );
  //     return filterList;
  //   } else if (type == 'Parcel') {
  //     const filterList = orderHistroy?.filter(element =>
  //       element?.order_type?.includes('parcel'),
  //     );
  //     return filterList;
  //   } else {
  //     const filterList = orderHistroy?.filter(element =>
  //       element?.order_type?.includes(type?.toLowerCase()),
  //     );
  //     return filterList;
  //   }
  // };

  // ordersRecentOrder = async (type,handleLoading) => {
  //   handleLoading(true);
  //   let requestData = {
  //     type:type,
  //     sender:'customer'
  //   };

  //   console.log('orders Recent Order User', requestData,);

  //   try {
  //     const res = await agent.ordersRecentOrder(requestData);
  //     console.log('orders Recent Order Res : ', res);
  //     if (res?.statusCode == 200) {
  //       // useToast(res?.message, 1);
  //       handleLoading(false);
  //       return res?.data;
  //     } else {
  //       const message = res?.message ? res?.message : res?.data?.message;
  //       // useToast(message, 0);
  //       handleLoading(false);
  //       return [];
  //     }
  //   } catch (error) {
  //     console.log('error orders Recent Order:', error);
  //     handleLoading(false);
  //     const m = error?.data?.message
  //       ? error?.data?.message
  //       : 'Something went wrong';
  //     // useToast(m, 0);
  //     return [];
  //   }

  // };

  // ordersTrackOrder = async (handleLoading) => {
  //   try {
  //     const res = await agent.ordersTrackOrder();
  //     console.log('orders Track Order Res : ', res);
  //     if (res?.statusCode == 200) {
  //       res?.data?.length > 0 ? this.orderTrackingList = res?.data :this.orderTrackingList =[]
  //       handleLoading(false);
  //       return res?.data;
  //     } else {
  //       this.orderTrackingList =[]
  //       handleLoading(false);
  //       return [];
  //     }
  //   } catch (error) {
  //     console.log('error orders Track Order:', error);
  //     handleLoading(false);
  //     this.orderTrackingList =[]
  //     return [];
  //   }
  // };

  // getPendingForCustomer = async (type) => {
  //   let requestData = {
  //     type:type,
  //     sender:'customer'
  //   };

  //   try {
  //     const res = await agent.pendingForCustomer(requestData);
  //     console.log('pending For Customer Res : ', res);
  //     if (res?.statusCode == 200) {
  //       return res?.data;
  //     } else {
  //       return [];
  //     }
  //   } catch (error) {
  //     console.log('error orders Track Order:', error);
  //     return [];
  //   }
  // };

  // updateOrderStatus = async (parcelId,status,handleDeleteLoading ,onDeleteSuccess,isPopUp) => {
  //   let requestData = {
  //     parcel_id:parcelId,
  //     status:status,
  //   };
  //   console.log('update Order Status request ', requestData,);
  //   try {
  //     const res = await agent.updateOrderStatus(requestData);
  //     console.log('update Order Status Res : ', res);
  //     if (res?.statusCode == 200) {
  //      if(isPopUp){useToast(res?.message, 1)}
  //       onDeleteSuccess()
  //     } else {
  //       const message = res?.message ? res?.message : res?.data?.message;
  //       if(isPopUp){ useToast(message, 0)};
  //     }
  //     handleDeleteLoading(false);
  //   } catch (error) {
  //     console.log('error update Order Status:', error);
  //     handleDeleteLoading(false);
  //     const m = error?.data?.message
  //       ? error?.data?.message
  //       : 'Something went wrong';
  //     if(isPopUp){ useToast(m, 0)};
  //   }

  // };
}
