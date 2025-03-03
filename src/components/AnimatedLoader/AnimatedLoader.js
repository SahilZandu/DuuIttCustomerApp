import React from 'react';
import {View} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import AddMyAddressLoader from './AddMyAddressLoader';
import LocationHistoryLoader from './LocationHistoryLoader';
import MultipleRiderLoader from './MultipleRiderLoader';
import MyAddressLoader from './MyAddressLoader';
import OrderHistoryLoader from './OrderHistoryLoader';
import RecentOrderLoader from './RecentOrderLoader';
import TrackingOrderLoader from './TrackingOderLoader';
import FoodHomeLoader from './FoodHomeLoader';
import RestaurantCartLoader from './RestaurantCartLoader';
import RestaurantItemLoader from './RestaurantItemLoader';
import FavoriteRestaurantLoader from './FavoriteRestaurantLoader';
import RestaurantReviewsLoader from './RstaurantReviewsLoader';
import CoupansListLoader from './CoupansListLoader';

const AnimatedLoader = ({type,absolute}) => {
  return (
    <View style={{position:absolute ? 'absolute' : 'relative', width: wp('100%')}}>
      {type == 'myAddress' && <MyAddressLoader />}
      {type == 'addMyAddress' && <AddMyAddressLoader />}
      {type == 'locationHistory' && <LocationHistoryLoader />}
      {type == 'orderHistoryLoader' && <OrderHistoryLoader />}
      {type == 'recentOrderLoader' && <RecentOrderLoader />}
      {type == 'trackingOrderLoader' && <TrackingOrderLoader/>}
      {type == 'multipleRiderLoader' &&  <MultipleRiderLoader/>}
      {type == 'foodHomeLoader' &&  <FoodHomeLoader/>}
      {type == 'restaurantCartLoader' &&  <RestaurantCartLoader/>}
      {type == 'restaurantItemLoader' && <RestaurantItemLoader/>}
      {type == 'favoriteRestaurantLoader' && <FavoriteRestaurantLoader/>}
      {type == 'restaurantReviewsLoader' && <RestaurantReviewsLoader/>}
      {type == 'coupansListLoader' && <CoupansListLoader/>}
      
      
      
 
      
      
    
    </View>
  );
};


export default AnimatedLoader;
