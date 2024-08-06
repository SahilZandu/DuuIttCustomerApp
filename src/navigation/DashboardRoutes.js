import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { DashboardBottomNavigator } from './BottomTabNavigation';
import Profile from '../screens/Auth/DashboardScreen/Profile/Profile';


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
  
    </Stack.Navigator>
  );
}