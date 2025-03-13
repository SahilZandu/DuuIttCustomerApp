import {action, computed, decorate, observable, runInAction} from 'mobx';
import {agent} from '../api/agent';
import {rootStore} from './rootStore';
import {useToast} from '../halpers/useToast';
import {getUniqueId} from 'react-native-device-info';

export default class DashboardStore {
  restaurentOfferCoupan = [];

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

  saveFcmToken = async fcm => {
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
        return res;
      } else {
        const message = res?.message ? res?.message : res?.data?.message;
        useToast(message, 0);
        handleLoading(false);
        return [];
      }
    } catch (error) {
      console.log('error addReviews:', error);
      handleLoading(false);
      const m = error?.data?.message
        ? error?.data?.message
        : 'Something went wrong';
      useToast(m, 0);
      return [];
    }
  };

  getRestaurantReview = async (restaurant, perPage, handleLoading) => {
    handleLoading(true);
    let requestData = {
      restaurant_id: restaurant?._id,
      limit: perPage,
    };
    console.log('requestData----restaurantReview', requestData);
    try {
      const res = await agent.restaurantReview(requestData);
      console.log('restaurantReview Res : ', res);
      if (res?.statusCode == 200) {
        // useToast(res?.message, 1);
        handleLoading(false);
        return res?.data;
      } else {
        const message = res?.message ? res?.message : res?.data?.message;
        // useToast(message, 0);
        handleLoading(false);
        return [];
      }
    } catch (error) {
      console.log('error restaurantReview:', error);
      handleLoading(false);
      const m = error?.data?.message
        ? error?.data?.message
        : 'Something went wrong';
      // useToast(m, 0);
      return [];
    }
  };

  getRestaurantOffers = async (restaurant, handleLoading) => {
    handleLoading(true);
    let requestData = {
      restaurant_id: restaurant?._id,
    };
    console.log('requestData----restaurantOffers', requestData);
    try {
      const res = await agent.restaurantOffers(requestData);
      console.log('restaurantOffers Res : ', res);
      if (res?.statusCode == 200) {
        // useToast(res?.message, 1);
        handleLoading(false);
        this.restaurentOfferCoupan = res?.data;
        return res?.data;
      } else {
        const message = res?.message ? res?.message : res?.data?.message;
        // useToast(message, 0);
        handleLoading(false);
        this.restaurentOfferCoupan = [];
        return [];
      }
    } catch (error) {
      console.log('error restaurantOffers:', error);
      handleLoading(false);
      const m = error?.data?.message
        ? error?.data?.message
        : 'Something went wrong';
      // useToast(m, 0);
      return [];
    }
  };

  applyCoupon = async (cart, coupan, handleLoading, onSucces) => {
    handleLoading(true);
    let requestData = {
      cart_id: cart?._id,
      offer_id: coupan ? coupan?._id : '',
    };
    console.log('requestData----applyCoupon', cart, coupan, requestData);
    try {
      const res = await agent.applyCoupon(requestData);
      console.log('applyCoupon Res : ', res);
      if (res?.statusCode == 200) {
        useToast(res?.message, 1);
        handleLoading(false);
        onSucces();
        return res?.data;
      } else {
        const message = res?.message ? res?.message : res?.data?.message;
        useToast(message, 0);
        handleLoading(false);
        return [];
      }
    } catch (error) {
      console.log('error applyCoupon:', error);
      handleLoading(false);
      const m = error?.data?.message
        ? error?.data?.message
        : 'Something went wrong';
      useToast(m, 0);
      return [];
    }
  };

  appFeedback = async (values,handleLoading,navigation) => {
    handleLoading(true);
    let requestData = {
      feedback: values?.feedback,
      type: 'customer',
    };

    console.log('appFeedback', requestData);

    try {
      const res = await agent.appFeedback(requestData);
      console.log('appFeedback Res : ', res);
      if (res?.statusCode == 200) {
        useToast(res?.message, 1);
        navigation.goBack();
      } else {
        const message = res?.message ? res?.message : res?.data?.message;
        useToast(message, 0);
      }
      handleLoading(false);
    } catch (error) {
      handleLoading(false);
      const m = error?.data?.message
        ? error?.data?.message
        : 'Something went wrong';
      useToast(m, 0);
      console.log('error appFeedback:', error);
    }
  };

}
