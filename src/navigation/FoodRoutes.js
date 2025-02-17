import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { FoodBottomNavigator } from './BottomTabNavigation';
import Profile from '../screens/Auth/DashboardScreen/Profile/Profile';
import FoodHome from '../screens/DUFood/FoodHome/FoodHome';
import MyAddress from '../screens/CommonScreens/MyAddress/MyAddress';
import AddMyAddress from '../screens/CommonScreens/AddMyAddress/AddMyAddress';

import CategoryViseFoodListing from '../screens/DUFood/FoodHome/CategoryViseFoodListing';
import ResturantProducts from '../screens/DUFood/Restaurent/ResturantMenuProducts';
import RestaurantDetail from '../screens/DUFood/Restaurent/RestaurantDetail';
import OrderPlaced from '../screens/DUFood/Tracking/OrderPlaced';
import TrackOrderPreparing from '../screens/DUFood/Tracking/TrackOrderPreparing';
import Cart from '../screens/DUFood/Cart/Cart';
import CouponsList from '../screens/DUFood/Cart/CouponsList';
import TrackingFoodOrderList from '../screens/DUFood/TrackingFoodOrderList/TrackingFoodOrderList';
// import CouponDetail from '../screens/DUFood/Components/CouponDetail';

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
       <Stack.Screen name="resturantProducts" component={ResturantProducts} />
       <Stack.Screen name="restaurantDetail" component={RestaurantDetail} />
       <Stack.Screen name="orderPlaced" component={OrderPlaced} />
       <Stack.Screen name="trackOrderPreparing" component={TrackOrderPreparing} />
       <Stack.Screen name="cart" component={Cart} />
       <Stack.Screen name="couponsList" component={CouponsList} />
       {/* <Stack.Screen name="couponDetail" component={CouponDetail} /> */}
       <Stack.Screen name="categoryViseFoodListing" component={CategoryViseFoodListing} />
       <Stack.Screen name="myAddress" component={MyAddress} />
       <Stack.Screen name="addMyAddress" component={AddMyAddress} />
       <Stack.Screen name="trackingFoodOrderList" component={TrackingFoodOrderList} />

       
       
  
    </Stack.Navigator>
  );
}