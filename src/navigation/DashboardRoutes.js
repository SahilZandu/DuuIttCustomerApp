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
import Rewards from '../screens/Auth/DashboardScreen/RewardsScreen/Rewards/Rewards';
import RewardQRCode from '../screens/Auth/DashboardScreen/RewardsScreen/RewardQRCode/RewardQRCode';
import ClaimRewardCard from '../screens/Auth/DashboardScreen/RewardsScreen/ClaimRewardCard/ClaimRewardCard';
import FavoriteRestaurant from '../screens/Auth/DashboardScreen/FavoriteRestaurant/FavoriteRestuarant';
import Wallet from '../screens/Auth/DashboardScreen/WalletScreen/Wallet/Wallet';
import DuuIttCredit from '../screens/Auth/DashboardScreen/WalletScreen/DuuIttCredit/DuuIttCredit';
import ClaimGiftCardList from '../screens/Auth/DashboardScreen/WalletScreen/ClaimGiftCardList/ClaimGiftCardList';
import GiftCardPurcahseList from '../screens/Auth/DashboardScreen/WalletScreen/GiftCardPurchaseList/GiftCardPurchaseList';
import RewardsStars from '../screens/Auth/DashboardScreen/WalletScreen/RewardsStars/RewardsStars';
import MyAddress from '../screens/CommonScreens/MyAddress/MyAddress';
import AddMyAddress from '../screens/CommonScreens/AddMyAddress/AddMyAddress';
import Settings from '../screens/Auth/DashboardScreen/Settings/Settings';
import OrderDetails from '../screens/Auth/DashboardScreen/OrderDetails/OrderDetails';
import TransactionHistory from '../screens/Auth/DashboardScreen/TransationHistory/TransationHistory';
import SetUpdatePass from '../screens/Auth/DashboardScreen/SetUpdatePassword/SetUpdatePassword';
import CustomerSupport from '../screens/CommonScreens/CustomerSupport/CustomerSupport';
import Chat from '../screens/Auth/DashboardScreen/Chat/Chat';
import MyWebComponent from '../screens/Auth/MyWebComponent/MyWebComponent';


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
       <Stack.Screen name="rewards" component={Rewards} />
       <Stack.Screen name="rewardQRCode" component={RewardQRCode} />
       <Stack.Screen name="claimRewardCard" component={ClaimRewardCard} />
       <Stack.Screen name="favoriteRestaurant" component={FavoriteRestaurant} />
       <Stack.Screen name="wallet" component={Wallet} />
       <Stack.Screen name="duuIttCredit" component={DuuIttCredit} />
       <Stack.Screen name="claimGiftCardList" component={ClaimGiftCardList} />
       <Stack.Screen name="giftCardPurcahseList" component={GiftCardPurcahseList} />
       <Stack.Screen name="rewardsStars" component={RewardsStars} />
       <Stack.Screen name="myAddress" component={MyAddress} />
       <Stack.Screen name="addMyAddress" component={AddMyAddress} />
       <Stack.Screen name="settings" component={Settings} />
       <Stack.Screen name="orderDetails" component={OrderDetails} />  
       <Stack.Screen name="transactionHistory" component={TransactionHistory} />
       <Stack.Screen name="setUpdatePass" component={SetUpdatePass} />
       <Stack.Screen name="customerSupport" component={CustomerSupport} /> 
       <Stack.Screen name="chat" component={Chat} /> 
        <Stack.Screen name="myWebComponent" component={MyWebComponent} /> 
       
       
       
  
    </Stack.Navigator>
  );
}