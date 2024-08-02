import {action, computed, decorate, observable, runInAction} from 'mobx';
import {agent} from '../api/agent';
import {rootStore} from './rootStore';
import { useToast } from '../halpers/useToast';

export default class AuthStore {

  login = async (values, type,countryCodeValue, navigation, handleLoading) => {
    handleLoading(true);
    const requestData = {
      phone: type == 'Mobile' ? values?.mobile : values?.email,
      password: type == 'Mobile' ? null : values?.password,
      country_code: type == 'Mobile' ? countryCodeValue :null,
    };

    console.log('requestData:-', requestData);

    try {
      const res = await agent.login(requestData);
      console.log('Login API Res:', res?.data);
      console.log('Login API Res:11', res,res?.data?.token);
      if (res?.status == 'success') {
        const jwt = res?.data.token;
        await rootStore.commonStore.setToken(jwt);
        if(type == 'Mobile'){
          navigation.navigate('otpVerify',{phone:values?.mobile}); 
        }else{
          await rootStore.commonStore.setAppUser(res?.data?.user);
          navigation.navigate('home')
        }
       
        useToast(res.message, 1);
      } else {
        const message = res?.message ? res?.message :res?.data?.message ;
        useToast(message, 0);
      }
      handleLoading(false);
    } catch (error) {
      console.log('eror:', error);
      handleLoading(false);
      const m = error?.data?.message
        ? error?.data?.message
        : 'Something went wrong';
      useToast(m, 0);
    }
  };


  matchLoginOtp = async (mobile,otp, navigation, handleLoading,onResendClear) => {
    handleLoading(true);
    const requestData = {
      phone: mobile,
      otp:otp,
    };
    console.log('requestData:-', requestData);
    try {
      const res = await agent.matchLoginOtp(requestData);
      console.log('matchLoginOtp API Res:', res);
      // console.log('matchLoginOtp API Res:11', res?.data?.user);
      if (res?.status == 'success') {
        await rootStore.commonStore.setAppUser(res?.data?.user);
         useToast(res.message, 1);
        if(res?.data?.user?.email?.length > 0){
          navigation.navigate('home')
        }else{
          navigation.navigate('register',{mobile:mobile});
        }
         onResendClear()
      } else {
        const message = res?.message ? res?.message : res?.data?.message;
        useToast(message, 0);
      }
      handleLoading(false);
    } catch (error) {
      console.log('eror:', error);
      handleLoading(false);
      const m = error?.data?.message
        ? error?.data?.message
        : 'Something went wrong';
      useToast(m, 0);
    }
  };


  register = async(values,navigation,handleLoading) =>{
    handleLoading(true);
    const requestData = {
      name: values?.fullName,
      email: values?.email,
      phone: values?.phone,
      password: values?.password,
      password_confirmation: values?.confirmPass,
    };
    console.log('requestData:-', requestData);
    try {
      const res = await agent.register(requestData);
      console.log('register API Res:', res?.data?.user);
    
      if (res?.status == 'success') {
        await rootStore.commonStore.setAppUser(res?.data?.user);
        navigation.navigate('location');
        useToast(res.message, 1);
      } else {
        const message = res?.message ? res?.message :res?.data?.message ;
        useToast(message, 0);
      }
      handleLoading(false);
    } catch (error) {
      console.log('eror:', error);
      handleLoading(false);
      const m = error?.data?.message
        ? error?.data?.message
        : 'Something went wrong';
      useToast(m, 0);
    }

  }

  locationAddress = async(address,resAddress,resAddress2,latitude,longitude,navigation,handleLoading) =>{
    handleLoading(true);
    const requestData = {
      address: address,
      state: resAddress2[1]?resAddress2[1]:null,
      country:resAddress[resAddress?.length -1],
      zipcode:resAddress2[2] ? resAddress2[2]:null,
      latitude: latitude,
      longitude:longitude,
    };

    console.log('requestData:-', requestData);
    
    // handleLoading(false);
    // return

    try {
      const res = await agent.locationAddress(requestData);
      console.log('locationAddress API Res:', res);
      // console.log('locationAddress API Res:11', res?.data?.user);
    
      if (res?.status == 'success') {
        await rootStore.commonStore.setAppUser(res?.data?.user);
        navigation.navigate('home');
        useToast(res.message, 1);
      } else {
        const message = res?.message ? res?.message :res?.data?.message ;
        useToast(message, 0);
      }
      handleLoading(false);
    } catch (error) {
      console.log('eror:', error);
      handleLoading(false);
      const m = error?.data?.message
        ? error?.data?.message
        : 'Something went wrong';
      useToast(m, 0);
    }

  }

 

  getUser = async () => {
    const {setAppUser} = rootStore.commonStore;
    try {
      const res = await agent.getUser();
      console.log('getUser API Res:', res);
      if (res?.data?.status == 'success') {
        setAppUser(res?.data?.data?.user);
        return res?.data?.data?.user;
      } else {
        setAppUser(null);
        return {};
      }
    } catch (error) {
      console.log('error:', error);
    }
  };

  addDeviceToken = async token => {
    const requestData = {
      device_token: token,
    };

    try {
      const res = await agent.addDeviceToken(requestData);
      console.log('addDeviceToken API Res:', res);
    } catch (error) {
      console.log('error:', error);
    }
  };
}

decorate(AuthStore, {
  login: action,
  matchLoginOtp:action,
  register:action,
  locationAddress:action,
  getUser: action,
  addDeviceToken: action,
});
