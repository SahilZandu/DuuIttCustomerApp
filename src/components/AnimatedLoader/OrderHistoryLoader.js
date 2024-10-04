import React from 'react';
import {View} from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';


const OrderHistoryLoader = ({}) => {
  const map = ['1', '2', '3', '4'];

  return (
    <View style={{paddingHorizontal: 18}}>
      {map?.map((item, key) => (
        <SkeletonPlaceholder key={key}>
            <View>
          <View style={{height:hp('14%'),width:wp('91%'),marginTop:'6%',borderRadius:8}} />
              <View style={{height:hp('2.5%'),width:wp('75%'),marginTop:'4%',borderRadius:8}}/>
              <View style={{height:hp('2.5%'),width:wp('75%'),marginTop:'3%',borderRadius:8}}/>
               <View style={{flexDirection:'row',marginTop:'4%',justifyContent:'space-between'}}>
                <View style={{height:hp('5.5%'),width:wp('43%') ,borderRadius:50}} />
                <View style={{height:hp('5.5%'),width:wp('43%') ,borderRadius:50}}/>
             </View>
             </View> 
        </SkeletonPlaceholder>
      ))}
    </View>
  );
};

export default OrderHistoryLoader;
