import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { DashboardBottomNavigator } from './BottomTabNavigation';
import Profile from '../screens/Auth/DashboardScreen/Profile/Profile';
import Feedback from '../screens/Auth/DashboardScreen/Feedback/Feedback';
import Help from '../screens/Auth/DashboardScreen/Help/Help';
import GiftCardPurchase from '../screens/Auth/DashboardScreen/GiftScreens/GiftCardPurchase/GiftCardPurchase';
import ClaimGiftCard from '../screens/Auth/DashboardScreen/GiftScreens/ClaimGiftCard/ClaimGiftCard';
import GiftCard from '../screens/Auth/DashboardScreen/GiftScreens/GiftCards/GiftCards';
import ClaimGiftQRCode from '../screens/Auth/DashboardScreen/GiftScreens/ClaimGiftQRCode/ClaimGiftQRCode';
import PaymentMethod from '../screens/Auth/DashboardScreen/PaymentMethod/PaymentMethod';
import Vouchers from '../screens/Auth/DashboardScreen/VouchersScreen/Vouchers/Vouchers';
import VouchersDetails from '../screens/Auth/DashboardScreen/VouchersScreen/VouchersDetails/VouchersDetails';


const Stack = createNativeStackNavigator();

export default function DashboardRoutes(props) {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        headerBackTitleVisible: false,
        gestureEnabled: false,
      }}
      initialRouteName="home"> 
       <Stack.Screen name="home" component={DashboardBottomNavigator} />
       <Stack.Screen name="profile" component={Profile} />
       <Stack.Screen name="feedback" component={Feedback} />
       <Stack.Screen name="help" component={Help} />
       <Stack.Screen name="giftCard" component={GiftCard} />
       <Stack.Screen name="giftCardPurchase" component={GiftCardPurchase} />
       <Stack.Screen name="claimGiftCard" component={ClaimGiftCard} />
       <Stack.Screen name="claimGiftQRCode" component={ClaimGiftQRCode} />
       <Stack.Screen name="paymentMethod" component={PaymentMethod} />
       <Stack.Screen name="vouchers" component={Vouchers} />
       <Stack.Screen name="vouchersDetails" component={VouchersDetails} />
       
       
       
  
    </Stack.Navigator>
  );
}