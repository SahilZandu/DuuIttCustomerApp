// import {createNativeStackNavigator} from '@react-navigation/native-stack';
// import Splash from '../screens/Auth/Splash/Splash';
// import Login from '../screens/Auth/Login/Login';
// import VerifyOtp from '../screens/Auth/VerifyOtp.js/VerifyOtp';
// import BottomNavigator from './BottomTabNavigation';
// import Profile from '../screens/Auth/DashboardScreen/Profile/Profile';
// import ForgotPass from '../screens/Auth/ForgotPass/ForgotPass';
// import SetPass from '../screens/Auth/SetPass/SetPass';
// import Test from '../screens/Auth/Test/Test';


// const Stack = createNativeStackNavigator();

// export default function PublicRoutes(props) {
//   return (
//     <Stack.Navigator
//       screenOptions={{
//         headerShown: false,
//         headerBackTitleVisible: false,
//         gestureEnabled: false,
//       }}
//       initialRouteName="splash">
//       <Stack.Screen name="splash" component={Splash} />
//       {/* <Stack.Screen name="test" component={Test} /> */}
//        <Stack.Screen name="login" component={Login} />
//        <Stack.Screen name="forgotPass" component={ForgotPass} />
//        <Stack.Screen name="setPass" component={SetPass} />
//        <Stack.Screen name="verifyOtp" component={VerifyOtp} />  
//        <Stack.Screen name="home" component={BottomNavigator} />
//        <Stack.Screen name="profile" component={Profile} />
  
//     </Stack.Navigator>
//   );
// }



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
