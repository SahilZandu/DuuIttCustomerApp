import React from 'react';
import {View} from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const ChatLoader = ({height}) => {
  const map = ['1','2','3','4','5','6','7','8','9','10'];

  return (
    <View style={{paddingHorizontal:10}}>
      {map?.map((item, key) => (
        <SkeletonPlaceholder key={key}>
          <View style={{height:hp('7%'), width: wp('80%'),marginTop:'5%',borderRadius:10}}></View>
          <View style={{height:hp('7%'), width: wp('80%'),
            alignSelf:'flex-end',justifyContent:'flex-end',marginTop:'5%',borderRadius:10}}></View>
        </SkeletonPlaceholder>
      ))}
    </View>
  );
};

export default ChatLoader;
