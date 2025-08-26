// import RazorpayCheckout from 'react-native-razorpay';
// import {useToast} from './useToast';
// import {rootStore} from '../stores/rootStore';
// import { colors } from "../theme/colors";

// export function usePayment(data, onSuccess, onError) {
//   const {appUser} = rootStore.commonStore;

//   const totalPrice = (data?.topay * 100);

//   console.log('app user:-', appUser);
//   console.log('Payment data:-', data);
//   var options = {
//     description: '',
//     image: 'https://duuitt.hashsoft.io/public/duuitt/app_icon.png',
//     currency: 'INR',
//     key: 'rzp_test_xsRy9RU40sgsGW',
//     amount: totalPrice.toFixed(0),
//     name: 'Duuitt',
//     prefill: {
//       email: appUser?.email,
//       contact: appUser?.mobile,
//       name: appUser?.name,
//     },
//     theme: {color: colors.main},
//   };

//   RazorpayCheckout.open(options)
//     .then(data => {
//       console.log('payment success:-', data);
//       onSuccess(data);
//     })
//     .catch(error => {
//       console.log('payment error:-', error);
//       onError(error);
//     });
// }




import RazorpayCheckout from "react-native-razorpay";
import { rootStore } from "../stores/rootStore";
import { colors } from "../theme/colors";

export async function usePayment(data, onSuccess, onError) {
  const { appUser } = rootStore.commonStore;
  const { paymentsCreateOrder, paymentsVerify } = rootStore.dashboardStore;
  const totalPriceOrder = data?.topay
  const totalPrice = data?.topay * 100; // Convert to paise


  console.log("App User:", appUser);
  console.log("Payment Data:", data);

  // Step 1: Create Order in Backend
  const resCO = await paymentsCreateOrder(totalPriceOrder)
  console.log("resCO---", resCO);
  let orderId = resCO?.data?.id; // Get Order ID
  if (resCO?.statusCode === 200) {
    var options = {
      description: "",
      image: "https://duuitt.hashsoft.io/public/duuitt/app_icon.png",
      currency: "INR",
      key: "rzp_test_xsRy9RU40sgsGW", // Razorpay Key
      amount: totalPrice?.toFixed(2),
      name: "Duuitt",
      order_id: orderId, // Pass Order ID
      prefill: {
        email: appUser?.email,
        contact: appUser?.phone,
        name: appUser?.name,
      },
      theme: { color: colors.main },
    };
    console.log("options---", options);

    RazorpayCheckout.open(options)
      .then(async data => {
        console.log('payment success:-', data);
        // const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = data;
        // console.log('Payment ID:', razorpay_payment_id);
        // console.log('Order ID:', razorpay_order_id);
        // console.log('Signature:', razorpay_signature);
        // Step 2: Verify Payment in Backend
        const verifyResponse = await paymentsVerify(data)
        console.log('verifyResponse:', verifyResponse);
        if (verifyResponse?.statusCode === 200) {
          console.log('Payment verified successfully');
          onSuccess(data);
        } else {
          console.log('Payment verification failed');
          onError('Verification failed');
        }
      })
      .catch(error => {
        console.log('payment error:-', error);
        onError(error);
      });
  } else {
    console.log("Order creation failed");
    onError("Order creation failed");
    return;
  }


}

