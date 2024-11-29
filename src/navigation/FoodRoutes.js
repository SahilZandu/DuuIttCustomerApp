import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { FoodBottomNavigator } from './BottomTabNavigation';
import Profile from '../screens/Auth/DashboardScreen/Profile/Profile';
import FoodHome from '../screens/DUFood/FoodHome/FoodHome';
import MyAddress from '../screens/CommonScreens/MyAddress/MyAddress';
import AddMyAddress from '../screens/CommonScreens/AddMyAddress/AddMyAddress';


const Stack = createNativeStackNavigator();

export default function FoodRoutes(props) {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        headerBackTitleVisible: false,
        gestureEnabled: false,
      }}
      initialRouteName="home"> 
       <Stack.Screen name="home" component={FoodBottomNavigator} />
       <Stack.Screen name="profile" component={Profile} />
       <Stack.Screen name="foodHome" component={FoodHome} />
       <Stack.Screen name="myAddress" component={MyAddress} />
       <Stack.Screen name="addMyAddress" component={AddMyAddress} />
       
  
    </Stack.Navigator>
  );
}