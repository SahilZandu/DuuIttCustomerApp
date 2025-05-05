import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { RideBottomNavigator } from './BottomTabNavigation';
import Profile from '../screens/Auth/DashboardScreen/Profile/Profile';
import RideHome from '../screens/DURide/RideHome/RideHome';
import SenderReceiverDetails from '../screens/DUParcel/SenderReceiverDetails.js/SenderReceiverDetails';
import SetLocationHistory from '../screens/DURide/SetLocationHistory/SetLocationHistory';
import ChooseMapLocation from '../screens/DURide/ChooseMapLocation/ChooseMapLocation';
import PriceDetails from '../screens/DURide/PriceDetails/PriceDetails';
import PriceConfirmed from '../screens/DURide/PriceConfirmed/PriceConfirmed';
import SearchingRide from '../screens/DURide/SearchingRide/SearchingRide';
import Feedback from '../screens/Auth/DashboardScreen/Feedback/Feedback';
import Help from '../screens/Auth/DashboardScreen/Help/Help';
import MyAddress from '../screens/CommonScreens/MyAddress/MyAddress';
import AddMyAddress from '../screens/CommonScreens/AddMyAddress/AddMyAddress';
import EditOrderLocation from '../screens/DURide/EditOrderLocation/EditOrderLocation';




const Stack = createNativeStackNavigator();

export default function RideRoutes(props) {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        headerBackTitleVisible: false,
        gestureEnabled: false,
      }}
      initialRouteName="home"> 
       <Stack.Screen name="home" component={RideBottomNavigator} />
       <Stack.Screen name="profile" component={Profile} />
       <Stack.Screen name="rideHome" component={RideHome} />
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
       <Stack.Screen name="editOrderLocation" component={EditOrderLocation} />
       
  
    </Stack.Navigator>
  );
}