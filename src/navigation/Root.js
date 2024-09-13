import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Splash from '../screens/Auth/Splash/Splash';
import AuthRoutes from './AuthRoutes';
import ParcelRoutes from './ParcelRoutes';
import FoodRoutes from './FoodRoutes';
import RideRoutes from './RideRoutes';
import DashboardRoutes from './DashboardRoutes';



const Stack = createNativeStackNavigator();

export default function MainNavigator(props) {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        headerBackTitleVisible: false,
        gestureEnabled: false,
      }}
      initialRouteName="splash">
       <Stack.Screen name="splash" component={Splash} />
       <Stack.Screen name="auth" component={AuthRoutes} />
       <Stack.Screen name="dashborad" component={DashboardRoutes} />
       <Stack.Screen name="parcel" component={ParcelRoutes} />
       <Stack.Screen name="food" component={FoodRoutes} />
       <Stack.Screen name="ride" component={RideRoutes} />
  
    </Stack.Navigator>
  );
}




