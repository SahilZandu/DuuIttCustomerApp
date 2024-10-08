import React from 'react';
import {View} from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';


const RecentOrderLoader = ({}) => {
  const map = ['1'];

  return (
    <View style={{paddingHorizontal: 0}}>
      {map?.map((item, key) => (
        <SkeletonPlaceholder key={key}>
            <View>
          <View style={{height:hp('14%'),width:wp('90%'),marginTop:'6%',borderRadius:8}} />
              <View style={{height:hp('2.5%'),width:wp('85%'),marginTop:'4%',borderRadius:8}}/>
              <View style={{height:hp('2.5%'),width:wp('85%'),marginTop:'3%',borderRadius:8}}/>
              <View style={{height:hp('2.5%'),width:wp('50%'),marginTop:'3%',borderRadius:8}}/>
             </View> 
        </SkeletonPlaceholder>
      ))}
    </View>
  );
};

export default RecentOrderLoader;
