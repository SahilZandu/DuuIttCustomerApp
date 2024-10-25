import React from 'react';
import {View} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import AddMyAddressLoader from './AddMyAddressLoader';
import LocationHistoryLoader from './LocationHistoryLoader';
import MyAddressLoader from './MyAddressLoader';
import OrderHistoryLoader from './OrderHistoryLoader';
import RecentOrderLoader from './RecentOrderLoader';
import TrackingOrderLoader from './TrackingOderLoader';


const AnimatedLoader = ({type,absolute}) => {
  return (
    <View style={{position:absolute ? 'absolute' : 'relative', width: wp('100%')}}>
      {type == 'myAddress' && <MyAddressLoader />}
      {type == 'addMyAddress' && <AddMyAddressLoader />}
      {type == 'locationHistory' && <LocationHistoryLoader />}
      {type == 'orderHistoryLoader' && <OrderHistoryLoader />}
      {type == 'recentOrderLoader' && <RecentOrderLoader />}
      {type == 'trackingOrderLoader' && <TrackingOrderLoader/>}
      
      
      
    
    </View>
  );
};


export default AnimatedLoader;
