import {colors} from '../theme/colors';

const primaryScreens = ['splash'];

const authScreens = ['login', 'forgotPass', 'setPass', 'verifyOtp','test',];

const DashbordScreens = [
  'home',
  'tab1',
  'tab2',
  'tab3',
  'tab4',
  'tab5',
  'profile',
  'chooseMapLocation',
  'ParcelHome',
  'setLocationHistory',
  'senderReceiverDetails',
  'priceDetails',
  'priceConfirmed',
  'searchingRide',
  'myWebComponent',
  'myAddres',
  'addMyAddress',
  'trackingOrder',
  'pickSuccessfully'
];

export function setBarColor(screen) {
  if (primaryScreens.includes(screen)) {
    return '#28B056';
  } else if (authScreens?.includes(screen)) {
    return '#FFFFFF';
  } else if (DashbordScreens?.includes(screen)) {
    return '#FFFFFF';
  } else {
    return '#FFFFFF';
  }
}

export function setStatusBar(screen) {
  if (primaryScreens.includes(screen)) {
    return 'light-content';
  } else if (authScreens?.includes(screen)) {
    return 'dark-content';
  } else if (DashbordScreens?.includes(screen)) {
    return 'dark-content';
  } else {
    return 'dark-content';
  }
}
