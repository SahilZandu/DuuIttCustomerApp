import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { DashboardBottomNavigator } from './BottomTabNavigation';
import Profile from '../screens/Auth/DashboardScreen/Profile/Profile';
import Feedback from '../screens/Auth/DashboardScreen/Feedback/Feedback';
import Help from '../screens/Auth/DashboardScreen/Help/Help';


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

  
    </Stack.Navigator>
  );
}