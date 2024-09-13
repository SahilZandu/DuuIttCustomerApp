import React from 'react';
import {View} from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';


const LocationHistoryLoader = ({}) => {
  const map = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];

  return (
    <View style={{paddingHorizontal:5}}>
      {map?.map((item, key) => (
        <SkeletonPlaceholder key={key}>
          <View style={{flex:0}}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              borderRadius: 8,
              marginTop: hp('2%'),
            }}>
            <View
              style={{height: hp('3%'), width: wp('6%'), borderRadius: 6}}
            />
         
              <View
                style={{height: hp('2%'), width: wp('35%'), borderRadius: 6,marginLeft:'4%'}}
              />
            </View>
            <View
                style={{
                  height: hp('2%'),
                  width: wp('75%'),
                  borderRadius: 6,
                  marginTop: '1%',
                  marginLeft:'10%'
                }}
              />
               <View
                style={{
                  height: hp('0.2%'),
                  width: wp('85%'),
                  borderRadius: 6,
                  marginTop: '5%',
                }}
              />
              </View>
        </SkeletonPlaceholder>
      ))}
    </View>
  );
};

export default LocationHistoryLoader;
