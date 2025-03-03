import React from 'react';
import {Text, View, StyleSheet} from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const CoupansListLoader = ({}) => {
  const map = ['1', '2', '3', '4', '5','6','7','8'];

  return (
    <View style={{paddingHorizontal: 18, marginTop: hp('2%')}}>
      {map?.map((item, key) => (
        <SkeletonPlaceholder key={key}>
          <View style={{flex: 0}}>
            <View
              style={{
                height: hp('17%'),
                width: wp('90%'),
                borderRadius: 10,
                marginTop: hp('3%'),
              }}
            />
          </View>
        </SkeletonPlaceholder>
      ))}
    </View>
  );
};

export default CoupansListLoader;
