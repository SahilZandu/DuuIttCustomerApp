import React, { useEffect, useRef, useState } from 'react';
import {StyleSheet, Dimensions,TouchableOpacity,Image,View} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { colors } from '../theme/colors';


const RenderOffer = ({data}) => {

  return (
    <View  
    style={{
    justifyContent:'center',
    alignItems:'center',
    }}>
    {data?.map((item ,i)=>{
   return(
    <TouchableOpacity 
    style={{marginTop:'4%',}}
    key={i}
    activeOpacity={0.8}
    // onPress={onPressOffer}
   >
    <Image resizeMode='stretch' 
    style={{width:wp('90%'),
    height:hp("18%")}} 
    source={item?.image}/>
  </TouchableOpacity>
        )
 })}
  </View>
  );
};

export default RenderOffer;

const styles = StyleSheet.create({
 
});
