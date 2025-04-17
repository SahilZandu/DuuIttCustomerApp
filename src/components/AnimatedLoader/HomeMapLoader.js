import React from 'react';
import {View} from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const HomeMapLoader = ({height}) => {
  const map = ['1'];

  return (
    <View style={{paddingHorizontal: 5}}>
      {map?.map((item, key) => (
        <SkeletonPlaceholder key={key}>
          <View style={{height:height?height:hp('30%'), width: wp('100%')}}></View>
        </SkeletonPlaceholder>
      ))}
    </View>
  );
};

export default HomeMapLoader;
