import React from 'react';
import {View} from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';


const TrackingOrderLoader = ({}) => {
  const map = ['1','2','3','4','5','6','7','8','9','10'];

  return (
    <View style={{paddingHorizontal: 20}}>
      {map?.map((item, key) => (
        <SkeletonPlaceholder key={key}>
            <View>
            <View style={{height:hp('10%'),width:wp('90%'),marginTop:'6%',borderRadius:8}} />
             </View> 
        </SkeletonPlaceholder>
      ))}
    </View>
  );
};

export default TrackingOrderLoader;
