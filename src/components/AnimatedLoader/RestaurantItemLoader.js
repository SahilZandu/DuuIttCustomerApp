import React from 'react';
import {Text, View, StyleSheet} from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const RestaurantItemLoader = ({}) => {
  const map = ['1'];

  return (
    <View style={{paddingHorizontal: 16, marginTop: hp('2%')}}>
      {map?.map((item, key) => (
        <SkeletonPlaceholder key={key}>
          <View
            style={{
              height: hp('22%'),
              width: wp('91%'),
              borderRadius: 10,
              marginTop: hp('0%'),
            }}
          />
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'center',
              marginTop: hp('4%'),
            }}>
            <View
              style={{
                height: hp('3%'),
                width: wp('17%'),
                borderRadius: 10,
              }}
            />
            <View
              style={{
                marginLeft: hp('2%'),
                height: hp('3%'),
                width: wp('17%'),
                borderRadius: 10,
              }}
            />
             <View
              style={{
                marginLeft: hp('2%'),
                height: hp('3%'),
                width: wp('17%'),
                borderRadius: 10,
              }}
            />
             <View
              style={{
                marginLeft: hp('2%'),
                height: hp('3%'),
                width: wp('17%'),
                borderRadius: 10,
              }}
            />
          </View>
          <View
            style={{
              height: hp('1.5%'),
              width: wp('60%'),
              borderRadius: 6,
              marginTop: hp('4%'),
            }}
          />

          <View
            style={{
              height: hp('20%'),
              width: wp('91%'),
              borderRadius: 10,
              marginTop: hp('1%'),
            }}
          />

          <View
            style={{
              height: hp('20%'),
              width: wp('91%'),
              borderRadius: 10,
              marginTop: hp('1%'),
            }}
          />

          <View
            style={{
              height: hp('20%'),
              width: wp('91%'),
              borderRadius: 10,
              marginTop: hp('1%'),
            }}
          />

         
        </SkeletonPlaceholder>
      ))}
    </View>
  );
};

export default RestaurantItemLoader;
