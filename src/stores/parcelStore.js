import {action, computed, decorate, observable, runInAction} from 'mobx';
import {agent} from '../api/agent';
import {rootStore} from './rootStore';
import {useToast} from '../halpers/useToast';

export default class ParcelStore {
  addParcelInfo = {};

  addRequestParcel = async (value, navigation, handleLoading) => {
    const {setSenderAddress, setReceiverAddress} = rootStore.myAddressStore;
    handleLoading(true);
    let requestData = {
      weight: Number(value?.weight),
      quantity: value?.quantity,
      type: value?.type?.name,
      sender_address: value?.sender_address,
      receiver_address: value?.receiver_address,
      billing_detail: value?.billing_detail,
    };

    console.log('requestData:-', requestData);
    try {
      const res = await agent.parcels(requestData);
      console.log('addRequestParcel API Res:', res);
      if (res?.statusCode == 200) {
        setSenderAddress({});
        setReceiverAddress({});
        this.addParcelInfo = res?.data;
        navigation.navigate('priceConfirmed', {item: res?.data});
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

  setAddParcelInfo = async item => {
    this.addParcelInfo = item;
  };

  parcels_Cancel = async (value, onSuccess, handleLoading) => {
    handleLoading(true);

    let requestData = {
      parcel_id: value?.parcel_id,
      order_cancel_by: 'customer',
      reason_of_cancellation: value?.reason,
      status: 'cancelled',
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
    };

    console.log('requestData:-', requestData);
    try {
      const res = await agent.parcels_find_rider(requestData);
      console.log('parcels Find Rider API Res:', res);
      if (res?.statusCode == 200) {
        // useToast(res.message, 1);
        handleLoading(false);
        return res?.data;
      } else {
        const message = res?.message ? res?.message : res?.data?.message;
        useToast(message, 0);
        handleLoading(false);
        return [];
      }
    } catch (error) {
      console.log('error:', error);
      handleLoading(false);
      const m = error?.data?.message
        ? error?.data?.message
        : 'Something went wrong';
      useToast(m, 0);
      return [];
    }
  };
}
