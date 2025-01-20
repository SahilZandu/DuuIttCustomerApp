import React from 'react';
import {Text, TouchableOpacity, Dimensions, Pressable} from 'react-native';
import {fonts} from '../theme/fonts/fonts';
// import {authStyles} from '../auth/authStyles/AuthStyles';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {RFValue} from 'react-native-responsive-fontsize';
import { colors } from '../theme/colors';


export default function Action(props) {
  const {title, onPress, height, width, background, activiOpacity, disabled} =
    props;
  return (
    <Pressable
      disabled={disabled}
      onPress={() => onPress()}
      activeOpacity={activiOpacity}
      style={[
        // authStyles.buttonstyle,
        {
          opacity: disabled == true ? 0.7 : 1,
          height: height ? height : hp('6.5%'),
          width: width ? width : wp('70%'),
          borderRadius:22,
          alignContent:'center',
         justifyContent:'center',
          backgroundColor: background ? background : '#28B056',
        },
      ]}>
      <Text
        style={{
          fontSize: RFValue(14),
          color: '#FFFFFF',
         alignSelf:'center',
          fontFamily: fonts.regular,
         
         
        }}>
        {title}
      </Text>
    </Pressable>
  );
}
