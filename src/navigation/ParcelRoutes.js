import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { ParcelBottomNavigator } from './BottomTabNavigation';
import Profile from '../screens/Auth/DashboardScreen/Profile/Profile';


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
  
    </Stack.Navigator>
  );
}