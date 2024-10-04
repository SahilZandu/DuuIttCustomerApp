import {action, computed, decorate, observable, runInAction} from 'mobx';
import {agent} from '../api/agent';
import {rootStore} from './rootStore';
import {useToast} from '../halpers/useToast';

export default class DashboardStore {
  
    updateProfile = async (values, handleLoading ,onSuccess) => {
        handleLoading(true);
        var request = new FormData();
        request.append('name', values?.fullName);
        request.append('email', values?.email);
        request.append('phone',Number(values?.mobile));
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
            onSuccess()
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

}
