import {action, computed, decorate, observable, runInAction} from 'mobx';
import {agent} from '../api/agent';
import {rootStore} from './rootStore';
import {useToast} from '../halpers/useToast';

export default class ParcelStore {

    addRequestParcel = async (value, navigation,handleLoading) => {
    const {setSenderAddress ,setReceiverAddress} = rootStore.myAddressStore;
        handleLoading(true);
        let requestData ={
          weight:Number(value?.weight),
          quantity:value?.quantity,
          type:value?.type?.name,
          sender_address:value?.sender_address,
          receiver_address:value?.receiver_address,
        }
    
        console.log('requestData:-', requestData);
        try {
          const res = await agent.parcels(requestData);
          console.log('addRequestParcel API Res:', res);
          if (res?.statusCode == 200) {
            setSenderAddress({})
            setReceiverAddress({})
            // navigation.navigate('priceConfirmed',{item:{price:60}});
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

 
}
