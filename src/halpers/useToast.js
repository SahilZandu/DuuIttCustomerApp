// import {Notifier, NotifierComponents} from 'react-native-notifier';

// export function useToast(message, type) {

//       const types = ['error','success','info','warn']

//   Notifier.showNotification({
//     title: '',
//     description: message,
//     Component: NotifierComponents.Alert,
//     componentProps: {
//       alertType: types[type] ,
//     },
//   });
// }



import Toast from 'react-native-toast-message';
import { ifIphoneX } from 'react-native-iphone-x-helper';
import { Platform } from 'react-native';

export function useToast(message, type) {

  const types = ['error', 'success', 'info', 'warn']

  Toast.show({
    type: types[type],
    position: 'top',
    text1: message,
    // text2:message,
    visibilityTime: 4000,
    autoHide: true,
    ...ifIphoneX(
      {
        topOffset: 60,
      },
      {
        topOffset: Platform.OS === 'ios' ? 50 : 25,
      },
    ),
  });

}
