import React from 'react';
import {View} from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';


const WalletLoader = ({}) => {
  const map = ['1'];

  return (
    <View style={{paddingHorizontal: 20}}>
      {map?.map((item, key) => (
        <SkeletonPlaceholder key={key}>
            <View>
            <View style={{height:hp('50%'),width:wp('90%'),marginTop:'3%',borderRadius:8}} />
            <View style={{height:hp('25%'),width:wp('90%'),marginTop:'3%',borderRadius:8}} />
            <View style={{height:hp('15%'),width:wp('90%'),marginTop:'3%',borderRadius:8}} />
             </View> 
        </SkeletonPlaceholder>
      ))}
    </View>
  );
};

export default WalletLoader;
