import RazorpayCheckout from 'react-native-razorpay';
import {useToast} from './useToast';
import {rootStore} from '../stores/rootStore';

export function usePayment(data, onSuccess, onError) {
  const {appUser} = rootStore.commonStore;

  const totalPrice = (data?.topay * 100);

  console.log('app user:-', appUser);
  console.log('Payment data:-', data);
  var options = {
    description: '',
    image: 'https://duuitt.hashsoft.io/public/duuitt/app_icon.png',
    currency: 'INR',
    key: 'rzp_test_xsRy9RU40sgsGW',
    amount: totalPrice.toFixed(0),
    name: 'Duuitt',
    prefill: {
      email: '',
      contact: appUser?.mobile,
      name: appUser?.name,
    },
    theme: {color: '#1D721E'},
  };

  RazorpayCheckout.open(options)
    .then(data => {
      console.log('payment success:-', data);
      onSuccess(data);
    })
    .catch(error => {
      console.log('payment error:-', error);
      onError(error);
    });
}
