import React from 'react';
import {View} from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const TransactionHistoryLoader = ({}) => {
  const map = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];

  return (
    <View style={{paddingHorizontal: 20}}>
      {map?.map((item, key) => (
        <SkeletonPlaceholder key={key}>
          <View>
            {key == 0 && (
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: '2%',
                }}>
                <View
                  style={{height: hp('5%'), width: wp('20%'), borderRadius: 20}}
                />
                <View
                  style={{height: hp('5%'), width: wp('20%'), borderRadius: 20}}
                />
                <View
                  style={{height: hp('5%'), width: wp('20%'), borderRadius: 20}}
                />
                <View
                  style={{height: hp('5%'), width: wp('20%'), borderRadius: 20}}
                />
              </View>
            )}
            <View
              style={{
                height: hp('10%'),
                width: wp('90%'),
                marginTop: '6%',
                borderRadius: 8,
              }}
            />
          </View>
        </SkeletonPlaceholder>
      ))}
    </View>
  );
};

export default TransactionHistoryLoader;
