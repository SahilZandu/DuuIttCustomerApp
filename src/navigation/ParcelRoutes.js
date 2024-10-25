import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { ParcelBottomNavigator } from './BottomTabNavigation';
import Profile from '../screens/Auth/DashboardScreen/Profile/Profile';
import ParcelHome from '../screens/DUParcel/ParcelHome/ParcelHome';
import SetLocationHistory from '../screens/DUParcel/SetLocationHistory/SetLocationHistory';
import ChooseMapLocation from '../screens/DUParcel/ChooseMapLocation/ChooseMapLocation';
import SenderReceiverDetails from '../screens/DUParcel/SenderReceiverDetails.js/SenderReceiverDetails';
import PriceDetails from '../screens/DUParcel/PriceDetails/PriceDetails';
import PriceConfirmed from '../screens/DUParcel/PriceConfirmed/PriceConfirmed';
import SearchingRide from '../screens/DUParcel/SearchingRide/SearchingRide';
import MyAddress from '../screens/DUParcel/MyAddress/MyAddress';
import AddMyAddress from '../screens/DUParcel/AddMyAddress/AddMyAddress';
import Feedback from '../screens/Auth/DashboardScreen/Feedback/Feedback';
import Help from '../screens/Auth/DashboardScreen/Help/Help';
import TrackingOrder from '../screens/DUParcel/TrackingOrder/TrackingOrder';
import PickSuccessfully from '../screens/DUParcel/PickSuccessfully.js/PickSuccessfully';


const Stack = createNativeStackNavigator();

export default function ParcelRoutes(props) {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        headerBackTitleVisible: false,
        gestureEnabled: false,
      }}
      initialRouteName="home"> 
       <Stack.Screen name="home" component={ParcelBottomNavigator} />
       <Stack.Screen name="profile" component={Profile} />
       <Stack.Screen name="ParcelHome" component={ParcelHome} />
       <Stack.Screen name="setLocationHistory" component={SetLocationHistory} />
       <Stack.Screen name="chooseMapLocation" component={ChooseMapLocation} />
       <Stack.Screen name="senderReceiverDetails" component={SenderReceiverDetails} />
       <Stack.Screen name="priceDetails" component={PriceDetails} />
       <Stack.Screen name="priceConfirmed" component={PriceConfirmed} />
       <Stack.Screen name="searchingRide" component={SearchingRide} />
       <Stack.Screen name="myAddress" component={MyAddress} />
       <Stack.Screen name="addMyAddress" component={AddMyAddress} />
       <Stack.Screen name="feedback" component={Feedback} />
       <Stack.Screen name="help" component={Help} />
       <Stack.Screen name="trackingOrder" component={TrackingOrder} />
       <Stack.Screen name="pickSuccessfully" component={PickSuccessfully} />
       
       



       
       
       
  
    </Stack.Navigator>
  );
}