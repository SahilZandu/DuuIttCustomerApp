
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Login from '../screens/Auth/Login/Login';
import VerifyOtp from '../screens/Auth/VerifyOtp.js/VerifyOtp';
import ForgotPass from '../screens/Auth/ForgotPass/ForgotPass';
import SetPass from '../screens/Auth/SetPass/SetPass';
import MyWebComponent from '../screens/Auth/MyWebComponent/MyWebComponent';
import CustomerSupport from '../screens/CommonScreens/CustomerSupport/CustomerSupport';
import PersonalInfo from '../screens/Auth/PersonalInfo/PersonalInfo';



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
       <Stack.Screen name="myWebComponent" component={MyWebComponent} /> 
       <Stack.Screen name="customerSupport" component={CustomerSupport} /> 
        <Stack.Screen name="personalInfo" component={PersonalInfo} />
       
    </Stack.Navigator>
  );
}
