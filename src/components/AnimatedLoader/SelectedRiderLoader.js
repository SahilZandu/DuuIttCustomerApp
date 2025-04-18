import React from 'react';
import {View} from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';


const SelectedRiderLoader = ({}) => {
  const map = ['1',];

  return (
    <View style={{paddingHorizontal: 20}}>
      {map?.map((item, key) => (
        <SkeletonPlaceholder key={key}>
            <View>
            <View style={{height:hp('30%'),width:wp('90%'),marginTop:'3%',borderRadius:10}} />
             </View> 
        </SkeletonPlaceholder>
      ))}
    </View>
  );
};

export default SelectedRiderLoader;
