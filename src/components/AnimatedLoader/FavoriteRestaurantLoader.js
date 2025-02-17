import React from 'react';
import {View} from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';


const FavoriteRestaurantLoader = ({}) => {
  const map = ['1','2','3','4','5','6'];

  return (
    <View style={{paddingHorizontal: 20}}>
      {map?.map((item, key) => (
        <SkeletonPlaceholder key={key}>
           <View style={{height:hp('16%'),width:wp('90%'),marginTop:'5%',borderRadius:10}} />
        </SkeletonPlaceholder>
      ))}
    </View>
  );
};

export default FavoriteRestaurantLoader;
