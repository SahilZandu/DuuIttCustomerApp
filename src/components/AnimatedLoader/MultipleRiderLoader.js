import React from 'react';
import {View} from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const MultipleRiderLoader = ({}) => {
  const map = ['1'];

  return (
    <View style={{paddingHorizontal: 0}}>
      {map?.map((item, key) => (
        <SkeletonPlaceholder key={key}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <View style={{height: hp('82%'), width: wp('100%')}} />
          </View>
        </SkeletonPlaceholder>
      ))}
    </View>
  );
};

export default MultipleRiderLoader;
