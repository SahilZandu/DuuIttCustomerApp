import React from 'react';
import {Text, View, StyleSheet} from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const RestaurantItemLoader = ({}) => {
  const map = ['1', '2', '3', '4', '5'];

  return (
    <View style={{paddingHorizontal: 18, marginTop: hp('2%')}}>
      {map?.map((item, key) => (
        <SkeletonPlaceholder key={key}>
          <View style={{flex: 0}}>
            <View
              style={{
                height: hp('4%'),
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
              <View style={{flexDirection: 'column'}}>
                <View style={{flexDirection: 'row'}}>
                  <View
                    style={{height: hp('3%'), width: wp('6%'), borderRadius: 8}}
                  />
                  <View
                    style={{
                      height: hp('3%'),
                      width: wp('30%'),
                      borderRadius: 20,
                      marginLeft: '3%',
                    }}
                  />
                </View>
                <View
                  style={{
                    height: hp('3%'),
                    width: wp('40%'),
                    borderRadius: 10,
                    marginTop: '5%',
                  }}
                />
                <View
                  style={{
                    height: hp('3%'),
                    width: wp('20%'),
                    borderRadius: 10,
                    marginTop: '5%',
                  }}
                />
                <View
                  style={{
                    height: hp('3%'),
                    width: wp('50%'),
                    borderRadius: 10,
                    marginTop: '5%',
                  }}
                />
              </View>
              <View
                style={{height: hp('15%'), width: wp('32%'), borderRadius: 10}}
              />
            </View>
          </View>
        </SkeletonPlaceholder>
      ))}
    </View>
  );
};

export default RestaurantItemLoader;
