import Toast from 'react-native-toast-message';
import { ifIphoneX } from 'react-native-iphone-x-helper';
import { Platform, StatusBar } from 'react-native';

export function useToast(message, type) {
  const types = ['error', 'success', 'info', 'warn'];

  Toast.show({
    type: types[type],
    position: 'top',
    text1: message,
    visibilityTime: 4000,
    autoHide: true,
    topOffset:
      Platform.OS === 'ios'
        ? ifIphoneX(70, 50) // iPhone X notch vs older iPhones
        : StatusBar.currentHeight
          ? StatusBar.currentHeight + 10 // Android: push below status bar
          : 50,
  });
}


// import Toast from 'react-native-toast-message';
// import { ifIphoneX } from 'react-native-iphone-x-helper';
// import { Platform } from 'react-native';

// export function useToast(message, type) {

//   const types = ['error', 'success', 'info', 'warn']

//   Toast.show({
//     type: types[type],
//     position: 'top',
//     text1: message,
//     // text2:message,
//     visibilityTime: 4000,
//     autoHide: true,
//     ...ifIphoneX(
//       {
//         topOffset: 60,
//       },
//       {
//         topOffset: Platform.OS === 'ios' ? 50 :
//           (Platform.OS === 'android' && Platform.Version >= 35) ? 28 : 25,
//       },
//     ),
//   });

// }




