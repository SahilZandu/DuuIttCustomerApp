
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Login from '../screens/Auth/Login/Login';
import VerifyOtp from '../screens/Auth/VerifyOtp.js/VerifyOtp';
import ForgotPass from '../screens/Auth/ForgotPass/ForgotPass';
import SetPass from '../screens/Auth/SetPass/SetPass';



const Stack = createNativeStackNavigator();

export default function AuthRoutes(props) {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        headerBackTitleVisible: false,
        gestureEnabled: false,
      }}
      initialRouteName="login">
       <Stack.Screen name="login" component={Login} />
       <Stack.Screen name="forgotPass" component={ForgotPass} />
       <Stack.Screen name="setPass" component={SetPass} />
       <Stack.Screen name="verifyOtp" component={VerifyOtp} />  
  
    </Stack.Navigator>
  );
}
