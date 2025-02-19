import {action, computed, decorate, observable, runInAction} from 'mobx';
import {agent} from '../api/agent';
import {rootStore} from './rootStore';
import {useToast} from '../halpers/useToast';
import {getUniqueId} from 'react-native-device-info';

export default class DashboardStore {

  updateProfile = async (values, handleLoading, onSuccess) => {
    handleLoading(true);
    var request = new FormData();
    request.append('name', values?.name);
    request.append('email', values?.email);
    request.append('phone', Number(values?.mobile));
    request.append('gender', values?.gender);
    request.append('date_of_birth', values?.date_of_birth);
    request.append('profile_pic', {
      uri: values?.image,
      name: 'profile.png',
      type: 'image/png',
    });

    console.log('request Data updateProfile:-', request, values);

    // handleLoading(false);
    // return

    try {
      const res = await agent.updateProfile(request);
      console.log('updateProfile API Res:', res);
      if (res?.statusCode == 200) {
        await rootStore.commonStore.setAppUser(res?.data);
        useToast(res.message, 1);
        onSuccess();
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

  saveFcmToken = async (fcm) => {
    const deviceId = await getUniqueId();

    let requestData = {
      device_id: deviceId,
      fcm_token: fcm,
    };

    console.log('customers Fcm Token', requestData);

    try {
      const res = await agent.customersFcmToken(requestData);
      console.log('customers Fcm Token Res : ', res);
      if (res?.statusCode == 200) {
        await rootStore.commonStore.setAppUser(res?.data);
      }
    } catch (error) {
      console.log('error customers Fcm Token:', error);
    }
  };

  testMessage = async () => {
    let requestData = {};

    console.log('test Message', requestData);

    try {
      const res = await agent.testMessage(requestData);
      console.log('test Message Res : ', res);
    } catch (error) {
      console.log('error test Message:', error);
    }
  };


  addReviews = async (payload, handleLoading) => {
    handleLoading(true);
    let requestData = {
      ...payload,
    };
    console.log('requestData----addReviews', requestData, payload);
    try {
      const res = await agent.addReviews(requestData);
      console.log('addReviews Res : ', res);
      if (res?.statusCode == 200) {
        useToast(res?.message, 1);
        handleLoading(false);
        return res
      } else {
        const message = res?.message ? res?.message : res?.data?.message;
        useToast(message, 0);
        handleLoading(false);
        return []
      }
    } catch (error) {
      console.log('error addReviews:', error);
      handleLoading(false);
      const m = error?.data?.message
        ? error?.data?.message
        : 'Something went wrong';
      useToast(m, 0);
      return []
    }
  };


  
}
