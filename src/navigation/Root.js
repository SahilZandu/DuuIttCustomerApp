import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Splash from '../screens/Auth/Splash/Splash';
import Login from '../screens/Auth/Login/Login';
import VerifyOtp from '../screens/Auth/VerifyOtp.js/VerifyOtp';
import BottomNavigator from './BottomTabNavigation';


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
       <Stack.Screen name="login" component={Login} />
       <Stack.Screen name="verifyOtp" component={VerifyOtp} />  
       <Stack.Screen name="home" component={BottomNavigator} />
    

      
      
    </Stack.Navigator>
  );
}
