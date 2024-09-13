import React from 'react';
import {View} from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';


const AddMyAddressLoader = ({}) => {
  const map = ['1',];

  return (
    <View style={{paddingHorizontal: 18}}>
      {map?.map((item, key) => (
        <SkeletonPlaceholder key={key}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              borderRadius: 8,
              marginTop: hp('2.5%'),
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
                  height: hp('5.5%'),
                  width: wp('75%'),
                  borderRadius: 6,
                  marginTop: '8%',
                  marginLeft:'10%'
                }}
              />

        </SkeletonPlaceholder>
      ))}
    </View>
  );
};

export default AddMyAddressLoader;
