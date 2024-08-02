import React, { useEffect, useRef, useState } from 'react';
import {StyleSheet, Dimensions} from 'react-native';
import {OtpInput} from 'react-native-otp-entry';
import {RFValue} from 'react-native-responsive-fontsize';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { colors } from '../theme/colors';


const componentName = ({handleTextChange,clearData}) => {
  let otpInput = useRef(null);
  
 useEffect(()=>{
  otpInput.current.clear();
 },[clearData])
  
  return (
    <OtpInput
       ref={otpInput}
      autoFocus={true}
      numberOfDigits={4}
      focusColor={'#28B056'}
      focusStickBlinkingDuration={500}
      theme={{
        containerStyle: styles.container,
        pinCodeContainerStyle: styles.borderStyleBase,
        pinCodeTextStyle: styles.pinCodeText,
        focusedPinCodeContainerStyle:styles.focusedPinCodeContainer
  

      }}
      onTextChange={handleTextChange}
    />
  );
};

export default componentName;

const styles = StyleSheet.create({
  container: {
    width: wp('85%'),
    height: 80,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent:'space-between',
  },

  borderStyleBase: {
    borderWidth:0,
    borderRadius:0,
    width: 60,
    height: 50,
    borderBottomWidth:2
  },

  borderStyleHighLighted: {
    borderColor: '#B0B4BE',
  },
  pinCodeText: {
    fontSize: RFValue(15),
    fontWeight:'700',
    color:'#000000'
  },
  focusedPinCodeContainer:{
    borderBottomWidth:2,
    width: 60,
    height: 50,
  }
});
