import { action, computed, decorate, observable, runInAction } from 'mobx';
import { agent } from '../api/agent';
import { rootStore } from './rootStore';
import { useToast } from '../halpers/useToast';
import { getUniqueId } from 'react-native-device-info';

export default class AuthStore {

  login = async (values, type, navigation, handleLoading, onDeactiveAccount) => {
    handleLoading(true);
    let requestData = {};
    if (type == 'Mobile') {
      requestData = {
        // mobile: type == 'Mobile' ? values?.mobile : values?.email,
        phone: Number(values?.mobile),
      };
    } else {
      requestData = {
        email: values?.email?.toLowerCase(),
        password: values?.password,
      };
    }

    console.log('requestData:-', requestData);

    try {
      const res = await agent.login(requestData);
      console.log('Login API Res:', res);
      if (res?.statusCode == 200) {
        navigation.navigate('verifyOtp', { value: values, loginType: type });
        useToast(res.message, 1);
      } else {
        const message = res?.message ? res?.message : res?.data?.message;
        if (message == 'Your account is deactivated') {
          onDeactiveAccount();
        }
        useToast(message, 0);
      }
      handleLoading(false);
    } catch (error) {
      console.log('error:', error);
      handleLoading(false);
      if (error?.data?.message == 'Your account is deactivated') {
        onDeactiveAccount();
      }
      const m = error?.data?.message
        ? error?.data?.message
        : 'Something went wrong';
      useToast(m, 0);
    }
  };

  verifyOtp = async (
    value,
    loginType,
    otp,
    navigation,
    handleLoading,
    onResendClear,
  ) => {
    const deviceId = await getUniqueId();
    handleLoading(true);
    let requestData = {};
    if (loginType == 'Mobile') {
      requestData = {
        username: value?.mobile,
        password: value?.mobile,
        phone: value?.mobile,
        otp: Number(otp),
        type: 'customer',
        device_id: deviceId,
      };
    } else if (loginType == 'Email') {
      requestData = {
        username: value?.email,
        password: value?.password ? value?.password : value?.email,
        email: value?.email?.toLowerCase(),
        otp: Number(otp),
        type: 'customer',
        device_id: deviceId,
      };
    } else {
      requestData = {
        username: value?.email,
        password: value?.password ? value?.password : value?.email,
        email: value?.email?.toLowerCase(),
        otp: Number(otp),
        type: 'customer',
        api_type: "update_password",
      };
    }

    console.log('request Data verifyOtp:-', requestData);
    // handleLoading(false);
    // return
    try {
      const res = await agent.verifyOtp(requestData);
      console.log('verifyOtp API Res:', res);

      if (res?.statusCode == 200) {
        useToast(res.message, 1);
        if (loginType == 'forgot') {
          navigation.navigate('setPass', { data: value });
        } else {
          if (res?.data?.name && res?.data?.name?.length > 0) {
            const jwt = res?.data?.access_token;
            await rootStore.commonStore.setToken(jwt);
            await rootStore.commonStore.setAppUser(res?.data);
            navigation.navigate('dashborad', { screen: 'home' });
          } else {
            const jwt = res?.data?.access_token;
            await rootStore.commonStore.setToken(jwt);
            await rootStore.commonStore.setAppUser(res?.data);
            navigation.navigate('personalInfo', { loginType: loginType });
          }
        }
        onResendClear();
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

  resendOtp = async (value, loginType, handleTimer, handleLoading) => {
    handleLoading(true)
    let requestData = {};
    if (loginType == 'Mobile') {
      requestData = {
        phone: value?.mobile,
      };
    } else {
      requestData = {
        email: value?.email?.toLowerCase(),
      };
    }

    console.log('request Data resendOtp:-', requestData);
    // return
    try {
      const res = await agent.resendOtp(requestData);
      console.log('resendOtp API Res:', res);
      if (res?.statusCode == 200) {
        useToast(res.message, 1);
      } else {
        const message = res?.message ? res?.message : res?.data?.message;
        useToast(message, 0);
      }
      handleTimer();
      handleLoading(false)
    } catch (error) {
      console.log('error:', error);
      handleLoading(false)
      const m = error?.data?.message
        ? error?.data?.message
        : 'Something went wrong';
      useToast(m, 0);
    }
  };

  forgotPass = async (value, navigation, handleLoading) => {
    handleLoading(true);
    let requestData = {
      email: value?.email?.toLowerCase(),
    };

    console.log('request Data forgotPass:-', requestData);
    // handleLoading(false);
    // return
    try {
      const res = await agent.forgetPass(requestData);
      console.log('forgotPass API Res:', res);
      if (res?.statusCode == 200) {
        useToast(res.message, 1);
        navigation.navigate('verifyOtp', { value: value, loginType: 'forgot' });
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

  updatePassword = async (data, values, navigation, handleLoading) => {
    handleLoading(true)
    let requestData = {
      confirmPassword: values?.confirm,
      newPassword: values?.password,
      email: data?.email?.toLowerCase(),
    };
    console.log('request Data updatePassword:-', requestData);
    // handleLoading(false)
    // return
    try {
      const res = await agent.updatePassword(requestData);
      console.log('updatePassword API Res:', res);
      if (res?.statusCode == 200) {
        useToast(res.message, 1);
        navigation.navigate('login');
      } else {
        const message = res?.message ? res?.message : res?.data?.message;
        useToast(message, 0);
      }
      handleLoading(false)
    } catch (error) {
      console.log('error:', error);
      handleLoading(false)
      const m = error?.data?.message
        ? error?.data?.message
        : 'Something went wrong';
      useToast(m, 0);
    }
  };

  // locationAddress = async(address,resAddress,resAddress2,latitude,longitude,navigation,handleLoading) =>{
  //   handleLoading(true);
  //   const requestData = {
  //     address: address,
  //     state: resAddress2[1]?resAddress2[1]:null,
  //     country:resAddress[resAddress?.length -1],
  //     zipcode:resAddress2[2] ? resAddress2[2]:null,
  //     latitude: latitude,
  //     longitude:longitude,
  //   };

  //   console.log('requestData:-', requestData);

  //   // handleLoading(false);
  //   // return

  //   try {
  //     const res = await agent.locationAddress(requestData);
  //     console.log('locationAddress API Res:', res);
  //     // console.log('locationAddress API Res:11', res?.data?.user);

  //     if (res?.status == 'success') {
  //       await rootStore.commonStore.setAppUser(res?.data?.user);
  //       navigation.navigate('home');
  //       useToast(res.message, 1);
  //     } else {
  //       const message = res?.message ? res?.message :res?.data?.message ;
  //       useToast(message, 0);
  //     }
  //     handleLoading(false);
  //   } catch (error) {
  //     console.log('eror:', error);
  //     handleLoading(false);
  //     const m = error?.data?.message
  //       ? error?.data?.message
  //       : 'Something went wrong';
  //     useToast(m, 0);
  //   }

  // }

  getAppUser = async () => {
    const { setAppUser } = rootStore.commonStore;
    try {
      const res = await agent.getAppUser();
      console.log('getUser API Res:', res);
      if (res?.statusCode == 200) {
        setAppUser(res?.data);
        return res?.data;
      } else {
        // setAppUser(null);
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

  getAdminInfo = async handleLoading => {
    try {
      const res = await agent.adminInfo();
      console.log('getAdminInfo API Res:', res);
      if (res?.statusCode == 200) {
        handleLoading(false);
        return res?.data;
      } else {
        handleLoading(false);
        return [];
      }
    } catch (error) {
      console.log('error:getAdminInfo', error);
      handleLoading(false);
      return [];
    }
  };


  getSupportInfo = async handleLoading => {
    try {
      const res = await agent.supportInfo();
      console.log('getSupportInfo API Res:', res);
      if (res?.statusCode == 200) {
        handleLoading(false);
        return res?.data;
      } else {
        handleLoading(false);
        return [];
      }
    } catch (error) {
      console.log('error:getAdminInfo', error);
      handleLoading(false);
      return [];
    }
  };


  updateCustomerInfo = async (values, navigation, handleLoading) => {
    handleLoading(true)
    let requestData = {
      name: values?.name,
      phone: Number(values?.mobile),
      gender: ""
    };

    if (values?.email?.length > 0) {
      requestData.email = values?.email?.toLowerCase();
    }

    if (values?.date_of_birth?.length > 0) {
      requestData.date_of_birth = values?.date_of_birth;
    }


    console.log('request Data updateCustomerInfo:-', requestData);
    // return
    try {
      const res = await agent.updateCustomerInfo(requestData);
      console.log('updateCustomerInfo API Res:', res);
      if (res?.statusCode == 200) {
        useToast(res.message, 1);
        await rootStore.commonStore.setAppUser(res?.data);
        navigation.navigate('dashborad', { screen: 'home' });
      } else {
        const message = res?.message ? res?.message : res?.data?.message;
        useToast(message, 0);
      }
      handleLoading(false)
    } catch (error) {
      console.log('error:updateCustomerInfo', error);
      handleLoading(false)
      const m = error?.data?.message
        ? error?.data?.message
        : 'Something went wrong';
      useToast(m, 0);
    }
  };


  userSetUpdatePassword = async (values, type, navigation, handleLoading) => {
    handleLoading(true);
    let requestData = {}
    if (type == "update") {
      requestData = {
        old_password: values?.oldPassword,
        confirmPassword: values?.confirmPassword,
        newPassword: values?.newPassword,
        email: values?.email?.toLowerCase(),
      }
    } else {
      requestData = {
        confirmPassword: values?.confirm,
        newPassword: values?.password,
        email: values?.email?.toLowerCase(),
      }
    }

    console.log('request Data userSetUpdatePassword:-', requestData);
    // handleLoading(false)
    // return
    try {
      const res = await agent.updatePassword(requestData);
      console.log('userSetUpdatePassword API Res:', res);
      if (res?.statusCode == 200) {
        useToast(res.message, 1);
        await rootStore.commonStore.setAppUser(res?.data);
        navigation.goBack();
      } else {
        const message = res?.message ? res?.message : res?.data?.message;
        useToast(message, 0);
      }
      handleLoading(false)
    } catch (error) {
      console.log('error:userSetUpdatePassword', error);
      handleLoading(false)
      const m = error?.data?.message
        ? error?.data?.message
        : 'Something went wrong';
      useToast(m, 0);
    }
  };

}
