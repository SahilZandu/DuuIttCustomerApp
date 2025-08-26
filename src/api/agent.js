import Url from './Url';
import axios from 'axios';
import { rootStore } from '../stores/rootStore';
import RNRestart from 'react-native-restart';
import { InteractionManager } from 'react-native';

const Base_Url = Url.Base_Url;

axios.defaults.baseURL = Base_Url;

axios.interceptors.request.use(
  config => {
    config.timeout = 10000;
    const token = rootStore.commonStore.token;
    console.log('token----', token);
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  error => {
    return Promise.reject(error);
  },
);


axios.interceptors.response.use(
  response => {
    const statusCode = response?.data?.statusCode;

    console.log('✅ Axios Response:', response, statusCode);

    if (statusCode === 404 || statusCode === 400) {
      return Promise.reject(response); // treat it as an error
    }

    if (statusCode === 401) {

   InteractionManager.runAfterInteractions(() => {
  rootStore.dashboardStore.saveFcmToken(null)
  rootStore.commonStore.setToken(null);
  rootStore.commonStore.setAppUser(null);
  RNRestart.restart();
  });
 return Promise.reject(response);
    }

    return response;
  },
  error => {
    console.log('❌ Axios Error:', error);

    if (error.message === 'Network Error' && !error.response) {
      return Promise.reject(error);
    }

    if (error.code === 'ECONNABORTED') {
      return Promise.reject(new Error('Network/Server timeout error'));
    }

    const status = error?.response?.status || error?.statusCode;

    if (status === 404 || status === 400) {
      return Promise.reject(error.response || error);
    }

    if (status === 401) {
      InteractionManager.runAfterInteractions(() => {
        rootStore.dashboardStore.saveFcmToken(null)
        rootStore.commonStore.setToken(null);
        rootStore.commonStore.setAppUser(null);
        RNRestart.restart();
        });
      // rootStore.dashboardStore.saveFcmToken(null);
      // rootStore.commonStore.setToken(null);
      // rootStore.commonStore.setAppUser(null);
      // RNRestart.restart();
      return Promise.reject(error.response || error);
    }

    return Promise.reject(error);
  },
);

// axios.interceptors.response.use(undefined, error => {
//   // console.log("error===axios",error);
//   if (error.message === 'Network Error' && !error.response) {
//     throw error;
//   }

//   if (error.code && error.code === 'ECONNABORTED')
//     throw 'Network/Server timeout error';

//   const {status} = error.response;
//   if (status === 404) {
//     throw error.response;
//   }

//   if (status === 400) {
//     console.log(status);
//     RNRestart.restart();
//     throw error.response;
//   }

//   if (status === 401) {
//     rootStore.commonStore.setToken(null);
//     rootStore.commonStore.setAppUser(null);
//     RNRestart.restart();
//     throw error.response;
//   }

//   throw error;
// });

const responseBody = response => response.data;

export const agent = {
  login: body => requests.post(Url.login, body),
  verifyOtp: body => requests.post(Url.verifyOtp, body),
  resendOtp: body => requests.post(Url.resendOtp, body),
  forgetPass: body => requests.post(Url.forgetPass, body),
  updatePassword: body => requests.post(Url.updatePassword, body),
  myAddress: body => requests.post(Url.myAddress, body),
  getMyAddress: () => requests.get(Url.getMyAddress),
  getAppUser: () => requests.get(Url.getAppUser),
  parcelsRides: body => requests.post(Url.parcelsRides, body),
  foodReorder : body => requests.post(Url.foodReorder, body),
  editParcelsRides: (body, orderId) => requests.post(`${Url.editParcelsRides}/${orderId?.order_id}`, body),
  parcels_Cancel: body => requests.post(Url.parcels_Cancel, body),
  parcels_find_rider: body => requests.post(Url.parcels_find_rider, body),
  updateProfile: body => requests.postForm(Url.updateProfile, body),
  parcelsOfUser: body => requests.post(Url.parcelsOfUser, body),
  restaurentAll: body => requests.post(Url.restaurentAll, body),
  ordersRecentOrder: body => requests.post(Url.ordersRecentOrder, body),
  ordersTrackOrder: () => requests.get(Url.ordersTrackOrder),
  pendingForCustomer: body => requests.post(Url.pendingForCustomer, body),
  customersFcmToken: body => requests.post(Url.customersFcmToken, body),
  testMessage: body => requests.post(Url.testMessage, body),
  updateOrderStatus: body => requests.post(Url.updateOrderStatus, body),
  allDishCategory: () => requests.get(Url.allDishCategory),
  restaurantListAccordingCategory: body =>
    requests.post(Url.restaurantListaccordingCategory, body),
  restaurantUnderMenuGroup: body =>
    requests.post(Url.restaurantUnderMenuGroup, body),
  restaurantListForDishCategory: body =>
    requests.post(Url.restaurantListForDishCategory, body),

  restaurantCustomerLikeDislike: body =>
    requests.post(Url.restaurantCustomerLikeDislike, body),
  restaurantLikedByCustomer: body =>
    requests.get(Url.restaurantLikedByCustomer),

  // cart
  setCart: body => requests.post(Url.setCart, body),
  updateCart: body => requests.post(Url.updateCart, body),
  getCart: body => requests.post(Url.getCart, body),
  deleteCart: body => requests.post(Url.deleteCart, body),

  foodOrder: body => requests.post(Url.foodOrder, body),
  getRepeatedOrderList: body => requests.post(Url.repeatedOrderList, body),
  getRecomendedItems: body => requests.post(Url.recomendedItems, body),
  getFoodOrderTracking: () => requests.get(Url.getFoodOrderTracking),

  addReviews: body => requests.post(Url.addReviews, body),
  foodOrderReviews : body => requests.post(Url.foodOrderReviews, body),
  restaurantReview: body => requests.post(Url.restaurantReview, body),
  completeMealItems: body => requests.post(Url.completeMealItems, body),
  restaurantOffers: body => requests.post(Url.restaurantOffers, body),
  applyCoupon: body => requests.post(Url.applyCoupon, body),
  removeCoupan: body => requests.post(Url.removeCoupan, body),
  calculateDeliveryFee: body => requests.post(Url.calculateDeliveryFee, body),
  appFeedback: body => requests.post(Url.appFeedback, body),
  restaurantOffersData: () =>  requests.get(Url.restaurantOffersData),
  wallet: body => requests.get(`${Url.wallet}/${body?.userId}`),
  walletUpdateBalance: body => requests.patch(Url.walletUpdateBalance, body),
  transactionHistory: body =>
    requests.get(
      `${Url.wallet}/${body?.userId}?transaction_history=${body?.transaction}&page=${body?.page}&limit=${body?.limit}&range=${body?.range}&status=${body?.status}`,
    ),

  paymentsCreateOrder: body => requests.post(Url.paymentsCreateOrder, body),
  paymentsVerify: body => requests.post(Url.paymentsVerify, body),
  deleteAccount: body =>
    requests.delete(`${Url.deleteAccount}/${body?.userId}`),
  adminInfo: () => requests.get(Url.adminInfo),
  supportInfo: () => requests.get(Url.supportInfo),
  updateCustomerInfo: body => requests.post(Url.updateCustomerInfo, body),
  checkDeviceId: body => requests.post(Url.checkDeviceId, body),
  sendMessage: body => requests.post(Url.sendMessage, body),
  markSeen: body => requests.post(Url.markSeen, body),
  chatOrderId: body => requests.get(`${Url.chatOrderId}/${body?.orderId}`),
  unseenMessages: body => requests.post(Url.unseenMessages, body),
  updateOrderArrivedTime: body => requests.post(Url.updateOrderArrivedTime, body),
  userLogout: body => requests.post(Url.userLogout, body),
  getRestaurantFoodReviews: body => requests.post(Url.getRestaurantFoodReviews, body),
  reorderCart: body => requests.post(Url.reorderCart, body),
  getRestaurantBanners:body => requests.get(Url.getRestaurantBanners),
  cancelFoodOrderByCustomer: body => requests.post(Url.cancelFoodOrderByCustomer, body),
  
};

const requests = {
  get: url => axios.get(url).then(responseBody),
  post: (url, body) => axios.post(url, body).then(responseBody),
  patch: (url, body) => axios.patch(url, body).then(responseBody),
  delete: url => axios.delete(url).then(responseBody),
  // put: (url, body) => axios.put(url, body).then(responseBody),
  postForm: (url, formData) => {
    return axios
      .post(url, formData, {
        headers: { 'content-type': 'multipart/form-data' },
      })
      .then(responseBody);
  },
};
