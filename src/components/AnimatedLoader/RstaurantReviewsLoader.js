import React from 'react';
import {Text, View, StyleSheet} from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const RestaurantReviewsLoader = ({}) => {
  const map = ['1'];

  return (
    <View style={{paddingHorizontal: 18, marginTop: hp('2%')}}>
      {map?.map((item, key) => (
        <SkeletonPlaceholder key={key}>
          <View style={{flex: 0}}>
            <View
              style={{
                height: hp('20%'),
                width: wp('90%'),
                borderRadius: 10,
                marginTop: hp('1%'),
              }}
            />

            <View
              style={{
                flexDirection: 'row',
                marginTop: '4%',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <View
                style={{
                  height: hp('20%'),
                  width: wp('40%'),
                  borderRadius: 10,
                }}
              />
              <View style={{flexDirection: 'column', marginLeft: '3%'}}>
                <View
                  style={{
                    height: hp('2%'),
                    width: wp('30%'),
                    borderRadius: 10,
                    marginTop: '2%',
                  }}
                />
                <View
                  style={{
                    height: hp('3%'),
                    width: wp('46%'),
                    borderRadius: 10,
                    marginTop: '2%',
                  }}
                />
                <View
                  style={{
                    height: hp('2%'),
                    width: wp('30%'),
                    borderRadius: 10,
                    marginTop: '6%',
                  }}
                />
                <View
                  style={{
                    height: hp('3%'),
                    width: wp('46%'),
                    borderRadius: 10,
                    marginTop: '2%',
                  }}
                />
                <View
                  style={{
                    height: hp('2%'),
                    width: wp('30%'),
                    borderRadius: 10,
                    marginTop: '6%',
                  }}
                />
                <View
                  style={{
                    height: hp('3%'),
                    width: wp('46%'),
                    borderRadius: 10,
                    marginTop: '2%',
                  }}
                />
              </View>
            </View>
            <View
              style={{
                height: hp('2%'),
                width: wp('30%'),
                borderRadius: 10,
                marginTop: hp('3%'),
              }}
            />

            <View style={{flexDirection: 'row', marginTop: '4%'}}>
              <View
                style={{
                  height: hp('10%'),
                  width: wp('30%'),
                  borderRadius: 10,
                }}
              />
              <View
                style={{
                  height: hp('10%'),
                  width: wp('30%'),
                  borderRadius: 10,
                  marginLeft: '4%',
                }}
              />
              <View
                style={{
                  height: hp('10%'),
                  width: wp('30%'),
                  borderRadius: 10,
                  marginLeft: '4%',
                }}
              />
            </View>

            <View
              style={{
                height: hp('2%'),
                width: wp('30%'),
                borderRadius: 10,
                marginTop: hp('3%'),
              }}
            />
            <View
              style={{
                height: hp('20%'),
                width: wp('90%'),
                borderRadius: 10,
                marginTop: hp('2%'),
              }}
            />
          </View>
        </SkeletonPlaceholder>
      ))}
    </View>
  );
};

export default RestaurantReviewsLoader;
