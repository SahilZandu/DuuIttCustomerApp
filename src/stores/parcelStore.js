import { action, computed, decorate, observable, runInAction } from 'mobx';
import { agent } from '../api/agent';
import { rootStore } from './rootStore';
import { useToast } from '../halpers/useToast';

export default class ParcelStore {
  addParcelInfo = {};

  addRequestParcelRide = async (value, navigation, handleLoading, handleErrorMsgShow) => {
    const { setSenderAddress, setReceiverAddress } = rootStore.myAddressStore;
    handleLoading(true);
    let requestData = {
      weight: Number(value?.weight),
      order_type: value?.order_type,
      sender_address: value?.sender_address,
      receiver_address: value?.receiver_address,
      billing_detail: value?.billing_detail,
      secure: value?.isSecure,
    };

    console.log('requestData:-', requestData);
    try {
      const res = await agent.parcelsRides(requestData);
      console.log('addRequestParcelRide API Res:', res);
      if (res?.statusCode == 200) {
        handleLoading(false);
        setSenderAddress({});
        setReceiverAddress({});
        this.addParcelInfo = res?.data;
        navigation.navigate('priceConfirmed', { item: res?.data });
        useToast(res.message, 1);
      } else {
        handleLoading(false);
        const message = res?.message ? res?.message : res?.data?.message;
        useToast(message, 0);
        if (res?.statusCode === 400) {
          handleErrorMsgShow(message)
        }
      }
    } catch (error) {
      console.log('error:', error);
      handleLoading(false);
      const m = error?.data?.message
        ? error?.data?.message
        : 'Something went wrong';
      useToast(m, 0);
      if (error?.data?.statusCode === 400) {
        handleErrorMsgShow(m)
      }
    }
  };


  editParcelsRides = async (value, navigation, handleLoading) => {
    handleLoading(true);
    let requestData = {
      weight: Number(value?.weight),
      order_type: value?.order_type,
      sender_address: value?.sender_address,
      receiver_address: value?.receiver_address,
      billing_detail: value?.billing_detail,
      secure: value?.isSecure,
    };
    let orderId = { order_id: value?.order_id };
    console.log('requestData:-editParcelsRides', requestData, orderId);
    try {
      const res = await agent.editParcelsRides(requestData, orderId);
      console.log('editParcelsRides API Res:', res);
      if (res?.statusCode == 200) {
        handleLoading(false);
        this.addParcelInfo = res?.data;
        navigation.navigate('priceConfirmed', { item: res?.data });
        // navigation.goBack();
        useToast(res.message, 1);
      } else {
        handleLoading(false);
        const message = res?.message ? res?.message : res?.data?.message;
        useToast(message, 0);
        if (res?.statusCode === 400) {
          handleErrorMsgShow(message)
        }
      }
    } catch (error) {
      console.log('error:editParcelsRides', error);
      handleLoading(false);
      const m = error?.data?.message
        ? error?.data?.message
        : 'Something went wrong';
      useToast(m, 0);
      if (error?.data?.statusCode === 400) {
        handleErrorMsgShow(m)
      }

    }
  };


  addReOrderRequestParcelRide = async (value, navigation, handleLoading) => {
    const { setSenderAddress, setReceiverAddress } = rootStore.myAddressStore;
    handleLoading(true);
    let requestData = {
      weight: Number(value?.weight),
      order_type: value?.order_type,
      sender_address: value?.sender_address,
      receiver_address: value?.receiver_address,
      billing_detail: value?.billing_detail,
      secure: value?.isSecure,
    };

    console.log('requestData:-', requestData);
    try {
      const res = await agent.parcelsRides(requestData);
      console.log('addRequestParcelRide API Res:', res);
      if (res?.statusCode == 200) {
        setSenderAddress({});
        setReceiverAddress({});
        this.addParcelInfo = res?.data;
        if (value?.order_type == 'ride') {
          navigation.navigate('ride', { screen: 'priceConfirmed', params: { item: res?.data } });
        } else {
          navigation.navigate('parcel', { screen: 'priceConfirmed', params: { item: res?.data } });
        }
        useToast(res.message, 1);
      } else {
        const message = res?.message ? res?.message : res?.data?.message;
        useToast(message, 0);
      }
      handleLoading(false);
    } catch (error) {
      console.log('error:', error);
      handleLoading(false);
      const m = error?.data?.message
        ? error?.data?.message
        : 'Something went wrong';
      useToast(m, 0);
    }
  };

  setAddParcelInfo = async (item) => {
    console.log("item---setAddParcelInfo", item);
    this.addParcelInfo = item;
  };

  parcels_Cancel = async (value, onSuccess, handleLoading) => {
    handleLoading(true);

    let requestData = {
      order_id: value?.orderId,
      user_type: 'customer',
      order_type: 'parcel',
      user_id: value?.customerId,
      reason_of_cancellation: value?.reason,
      // status: 'cancelled',
      // order_cancel_by: 'customer',

    };
    console.log('requestData:-', requestData);
    try {
      const res = await agent.parcels_Cancel(requestData);
      console.log('parcels_Cancel API Res:', res);
      if (res?.statusCode == 200) {
        this.addParcelInfo = {};
        onSuccess();
        useToast(res.message, 1);
      } else {
        const message = res?.message ? res?.message : res?.data?.message;
        useToast(message, 0);
      }
      handleLoading(false);
    } catch (error) {
      console.log('error:', error);
      handleLoading(false);
      const m = error?.data?.message
        ? error?.data?.message
        : 'Something went wrong';
      useToast(m, 0);
    }
  };

  parcelsFindRider = async (value, handleLoading) => {
    handleLoading(true);
    let requestData = {
      parcel_id: value?.parcel_id,
      geo_location: value?.geo_location,
      payment_mode: value?.paymentMode,
      total_amount: value?.total_amount,
    };

    console.log('requestData:-', requestData);
    try {
      const res = await agent.parcels_find_rider(requestData);
      console.log('parcels Find Rider API Res:', res);
      if (res?.statusCode == 200) {
        handleLoading(false);
        this.addParcelInfo = res?.data?.order;
        return res?.data?.riders;
      } else {
        handleLoading(false);
        return [];
      }
    } catch (error) {
      console.log('error parcels Find Rider -:', error);
      handleLoading(false);
      return [];
    }
  };


}
