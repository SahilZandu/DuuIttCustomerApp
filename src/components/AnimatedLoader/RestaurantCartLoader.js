import React from 'react';
import {Text, View, StyleSheet} from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const RestaurantCartLoader = ({}) => {
  const map = ['1'];

  return (
    <View
      style={{paddingHorizontal: 20, marginTop: hp('2%'), alignSelf: 'center'}}>
      {map?.map((item, key) => (
        <SkeletonPlaceholder key={key}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'center',
            }}>
            <View
              style={{
                height: hp('4%'),
                width: wp('18%'),
                borderRadius: 50,
              }}
            />
            <View
              style={{
                marginLeft: hp('2%'),
                height: hp('4%'),
                width: wp('18%'),
                borderRadius: 50,
              }}
            />
            <View
              style={{
                marginLeft: hp('2%'),
                height: hp('4%'),
                width: wp('18%'),
                borderRadius: 50,
              }}
            />
            <View
              style={{
                marginLeft: hp('2%'),
                height: hp('4%'),
                width: wp('18%'),
                borderRadius: 50,
              }}
            />
          </View>

          <View
            style={{
              height: hp('28%'),
              width: wp('91%'),
              borderRadius: 10,
              marginTop: hp('3%'),
            }}
          />

          <View
            style={{
              height: hp('28%'),
              width: wp('91%'),
              borderRadius: 10,
              marginTop: hp('2%'),
            }}
          />
          <View
            style={{
              height: hp('28%'),
              width: wp('91%'),
              borderRadius: 10,
              marginTop: hp('2%'),
            }}
          />
          <View
            style={{
              height: hp('28%'),
              width: wp('91%'),
              borderRadius: 10,
              marginTop: hp('2%'),
            }}
          />
        </SkeletonPlaceholder>
      ))}
    </View>
  );
};

export default RestaurantCartLoader;
