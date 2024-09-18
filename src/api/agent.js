import Url from './Url';
import axios from 'axios';
import { rootStore } from '../stores/rootStore';
import RNRestart from 'react-native-restart';

const Base_Url = Url.Base_Url;

axios.defaults.baseURL = Base_Url;

axios.interceptors.request.use(
  config => {
    config.timeout = 10000;
    const token = rootStore.commonStore.token;
    console.log("token----",token)
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

axios.interceptors.response.use(undefined, error => {
  if (error.message === 'Network Error' && !error.response) {
    throw error;
  }

  if (error.code && error.code === 'ECONNABORTED')
    throw 'Network/Server timeout error';

  const {status} = error.response;
  if (status === 404) {
    throw error.response;
  }

  if (status === 400) {
    console.log(status);
    throw error.response;
  }

  if (status === 401) {
    rootStore.commonStore.setToken(null);
    rootStore.commonStore.setAppUser(null);
    RNRestart.restart();
    throw error.response;
  }

  throw error;
});

const responseBody = response => response.data;

export const agent = {
  login: body => requests.post(Url.login, body),
  verifyOtp: body => requests.post(Url.verifyOtp, body),
  resendOtp: body => requests.post(Url.resendOtp, body),
  forgetPass: body => requests.post(Url.forgetPass, body),
  updatePassword: body => requests.post(Url.updatePassword, body),
  myAddress: body => requests.post(Url.myAddress, body),
  getMyAddress: () => requests.get(Url.getMyAddress),
  parcels: body => requests.post(Url.parcels, body),
  parcels_Cancel: body => requests.post(Url.parcels_Cancel, body),
  parcels_find_rider: body => requests.post(Url.parcels_find_rider, body),
  
  



};

const requests = {
  get: url => axios.get(url).then(responseBody),
  post: (url, body) => axios.post(url, body).then(responseBody),
  // put: (url, body) => axios.put(url, body).then(responseBody),
  // del: (url) => axios.delete(url).then(responseBody),
  postForm: (url, formData) => {
    return axios
      .post(url, formData, {
        headers: {'content-type': 'multipart/form-data'},
      })
      .then(responseBody);
  },
};


