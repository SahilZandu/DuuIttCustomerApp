import {action, computed, decorate, observable, runInAction} from 'mobx';
import {agent} from '../api/agent';
import {rootStore} from './rootStore';
import {useToast} from '../halpers/useToast';

export default class MyAddressStore {
  getAddress = [];
  senderAddress = {};
  receiverAddress = {};
  currentAddress = {};

  myAddress = async (
    type,
    values,
    title,
    address,
    geoLocation,
    loactionId,
    onSuccess,
    handleLoading,
  ) => {
    handleLoading(true);
    let requestData = {}
    if(type == 'add') {
    requestData = {
        title: title,
      name: values?.name,
      phone: Number(values?.phone),
      address: address,
      address_detail: values?.house,
      geo_location: geoLocation,
      location_id: loactionId,
      landmark: values?.landmark,
      type: type,
    };
  }else{
    requestData = {
      _id: values?.id,
      title: title,
      name: values?.name,
      phone: Number(values?.phone),
      address: address,
      address_detail: values?.house,
      geo_location: geoLocation,
      location_id: loactionId,
      landmark: values?.landmark,
      type: type,
    };
  }

    console.log('requestData:-', requestData);
    try {
      const res = await agent.myAddress(requestData);
      console.log('myAddress API Res:', res);
      if (res?.statusCode == 200) {
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

  getMyAddress = async () => {
    try {
      const res = await agent.getMyAddress();
      console.log('getMyAddressd Res : ', res);
      if (res?.statusCode == 200) {
        res?.data?.addresses
          ? (this.getAddress = res?.data?.addresses)
          : (this.getAddress = []);
        return res?.data?.addresses;
      } else {
        this.getAddress = [];
        const message = res?.message ? res?.message : res?.data?.message;
        useToast(message, 0);
        return [];
      }
    } catch (error) {
      console.log('error:', error);
      return [];
    }
  };

  deleteMyAddress = async (type, data, onSuccess, handleLoading) => {
    let requestData = {
      title: data?.title,
      name: data?.name ? data?.name : 'test',
      phone: data?.phone ? Number(data?.phone) : 9876543210,
      address: data?.address,
      address_detail: data?.address_detail,
      geo_location: data?.geo_location,
      location_id: data?.location_id,
      landmark: data?.landmark,
      type: type,
    };

    console.log('requestData:-', requestData);
    try {
      const res = await agent.myAddress(requestData);
      console.log('deleteMyAddress API Res:', res);
      if (res?.statusCode == 200) {
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

  setSenderAddress = async item => {
    this.senderAddress = item;
  };

  setReceiverAddress = async item => {
    this.receiverAddress = item;
  };

  setCurrentAddress = async data => {
    this.currentAddress = data;
  };
}
