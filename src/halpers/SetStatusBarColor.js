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
  'parcelHome',
  'setLocationHistory',
  'senderReceiverDetails',
  'priceDetails',
  'priceConfirmed',
  'searchingRide',
  'myWebComponent',
  'myAddres',
  'addMyAddress',
  'trackingOrder',
  'pickSuccessfully',
  'giftCard',
  'giftCardPurchase',
  'claimGiftCard',
  'claimGiftQRCode',
  'paymentMethod',
  'vouchers',
  'vouchersDetails',
  'foodHome',
  'rideHome'
  
];

export function setBarColor(screen) {
  if (primaryScreens.includes(screen)) {
    return  colors.main;;
  } else if (authScreens?.includes(screen)) {
    return colors.appBackground;
  } else if (DashbordScreens?.includes(screen)) {
    return  colors.appBackground;;
  } else {
    return  colors.appBackground;;
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
