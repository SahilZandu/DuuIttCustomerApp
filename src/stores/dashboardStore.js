import { action, computed, decorate, observable, runInAction } from 'mobx';
import { agent } from '../api/agent';
import { rootStore } from './rootStore';
import { useToast } from '../halpers/useToast';
import { getUniqueId } from 'react-native-device-info';

export default class DashboardStore {
  restaurentOfferCoupan = [];
  welletBalance = {}
  transactionList = []


  updateProfile = async (values, handleLoading, onSuccess) => {
    handleLoading(true);
    var request = new FormData();
    request.append('name', values?.name);
    if (values?.email?.length > 0) {
      request.append('email', values?.email?.toLowerCase());
    }
    request.append('phone', Number(values?.mobile));
    request.append('gender', values?.gender);
    if (values?.date_of_birth?.length > 0) {
      request.append('date_of_birth', values?.date_of_birth);
    }
    if (values?.image?.length > 0) {
      request.append('profile_pic', {
        uri: values?.image,
        name: 'profile.png',
        type: 'image/png',
      });
    }

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

  appFeedback = async (values, handleLoading, navigation) => {
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


  getWallet = async (appUser, handleLoading) => {
    const requestData = {
      userId: appUser?._id,
    };
    try {
      const res = await agent.wallet(requestData);
      console.log('get wallet Res : ', res);
      if (res?.statusCode == 200) {
        res?.data
          ? (this.welletBalance = res?.data)
          : (this.welletBalance = []);
        handleLoading(false);
        return res?.data;
        // useToast(res.message, 1);
        // return res?.data;
      } else {
        this.welletBalance = [];
        const message = res?.message ? res?.message : res?.data?.message;
        useToast(message, 0);
        handleLoading(false);
        return [];
      }
    } catch (error) {
      handleLoading(false);
      console.log('error get wallet List:', error);
      return [];
    }
  };

  getTransactionHistory = async (appUser, limit, range, handleLoading) => {
    const requestData = {
      userId: appUser?._id,
      transaction: true,
      page: 1,
      limit: limit,
      range: range?.toLowerCase() ?? 'all',
      status: 'all',
    };
    console.log("requestData--=", requestData);
    try {
      const res = await agent.transactionHistory(requestData);
      console.log('get getTransactionHistory Res : ', res);
      if (res?.statusCode == 200) {
        res?.data?.transactions?.length > 0
          ? (this.transactionList = res?.data?.transactions)
          : (this.transactionList = []);
        handleLoading(false);
        return res?.data?.transactions;
        // useToast(res.message, 1);
        // return res?.data;
      } else {
        this.transactionList = [];
        const message = res?.message ? res?.message : res?.data?.message;
        useToast(message, 0);
        handleLoading(false);
        return [];
      }
    } catch (error) {
      handleLoading(false);
      console.log('error get TransactionHistory List:', error);
      return [];
    }
  };


  addWalletBalance = async (
    appUser,
    amount,
    paymentId,
    status,
    handleLoading,
    onHandleScuuess,
  ) => {
    const requestData = {
      created_by: appUser?._id,
      user_type: "customer",
      amount: Number(amount),
      payment_id: paymentId,
      type: 'credit',
      status: status, // -----for customer---- > deposits or duuitt_credits
      reason: 'Recharge',
    };

    console.log("requestData addWalletBalance--", requestData);
    try {
      const res = await agent.walletUpdateBalance(requestData);
      console.log('add walletUpdateBalance Res : ', res);
      if (res?.statusCode == 200) {
        handleLoading(false);
        useToast(res.message, 1);
        onHandleScuuess();
      } else {
        const message = res?.message ? res?.message : res?.data?.message;
        useToast(message, 0);
        handleLoading(false);
      }
    } catch (error) {
      handleLoading(false);
      console.log('error add walletUpdateBalance List:', error);
      const m = error?.data?.message
        ? error?.data?.message
        : 'Something went wrong';
      useToast(m, 0);
    }
  };



  paymentsCreateOrder = async (amount) => {
    // handleLoading(true);
    let requestData = {
      amount: Number(amount),
      currency: "INR",
      status: true
    };

    console.log('paymentsCreateOrder', requestData);

    try {
      const res = await agent.paymentsCreateOrder(requestData);
      console.log('paymentsCreateOrder Res : ', res);
      if (res?.statusCode == 200) {
        useToast(res?.message, 1);
        // handleLoading(false);
        return res
      } else {
        const message = res?.message ? res?.message : res?.data?.message;
        useToast(message, 0);
        // handleLoading(false);
        return res
      }

    } catch (error) {
      // handleLoading(false);
      const m = error?.data?.message
        ? error?.data?.message
        : 'Something went wrong';
      useToast(m, 0);
      console.log('error paymentsCreateOrder:', error);
      return []
    }
  };


  paymentsVerify = async (data) => {
    let requestData = {
      order_id: data?.razorpay_order_id,
      razorpay_payment_id: data?.razorpay_payment_id,
      razorpay_signature: data?.razorpay_signature,
    };

    console.log('paymentsVerify requestData', requestData);

    try {
      const res = await agent.paymentsVerify(requestData);
      console.log('paymentsVerify Res : ', res);
      if (res?.statusCode == 200) {
        // useToast(res?.message, 1);
        return res
      } else {
        const message = res?.message ? res?.message : res?.data?.message;
        // useToast(message, 0);
        return res
      }
    } catch (error) {
      const m = error?.data?.message
        ? error?.data?.message
        : 'Something went wrong';
      // useToast(m, 0);
      console.log('error paymentsVerify:', error);
      return []
    }
  };


  deleteAccount = async (appUser, handleLoading) => {
    let requestData = {
      userId: appUser?._id
    };

    console.log('deleteAccount requestData', requestData);

    try {
      const res = await agent.deleteAccount(requestData);
      console.log('deleteAccount Res :', res);
      if (res?.statusCode == 200) {
        useToast(res?.message, 1);
        handleLoading();
        return res
      } else {
        const message = res?.message ? res?.message : res?.data?.message;
        useToast(message, 0);
        handleLoading();
        return res
      }
    } catch (error) {
      console.log('error paymentsVerify:', error);
      handleLoading();
      const m = error?.data?.message
        ? error?.data?.message
        : 'Something went wrong';
      useToast(m, 0);

      return []
    }
  };

  getCheckDeviceId = async () => {
    const deviceId = await getUniqueId();
    let requestData = {
      device_id: deviceId,
    };

    console.log('checkDeviceId requestData', requestData);

    try {
      const res = await agent.checkDeviceId(requestData);
      console.log('checkDeviceId Res :', res);
      if (res?.statusCode == 200) {
        // useToast(res?.message, 1);
      } else {
        const message = res?.message ? res?.message : res?.data?.message;
        useToast(message, 0);
      }
    } catch (error) {
      console.log('error checkDeviceId:', error);
      const m = error?.data?.message
        ? error?.data?.message
        : 'Something went wrong';
      // useToast(m, 0);
    }
  };



}
