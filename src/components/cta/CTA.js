import React from 'react';
import {Button} from 'react-native-paper';
import {colors} from '../../theme/colors';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { RFValue } from 'react-native-responsive-fontsize';

const CTA = ({
  title,
  onPress,
  loading,
  disable,
  backgroundColor,
  width,
  height,
  labelColor,
  isBottom,
  bottomCheck,
  textTransform,
}) => (
  <Button
    disabled={loading || disable}
    loading={loading}
    style={{
      backgroundColor: backgroundColor ? backgroundColor : '#28B056',
      width: width ? width : wp('85%'),
      height: height ? height : hp('5.8%'),
      borderRadius: 50,
      justifyContent: 'center',
      opacity: disable ? 0.6 : 1,
      alignSelf: 'center',
      position: isBottom ? 'absolute' : 'relative',
      bottom:bottomCheck?bottomCheck:10,
      borderColor:'#28B056',
      borderWidth:1
    }}
    rippleColor={colors.ripleColor}
    labelStyle={{
      color: labelColor ? labelColor : colors.white,
      marginVertical: 0,
      padding:'3%',
      textTransform: textTransform ? textTransform: 'uppercase',
      fontSize:RFValue(12),
      fontWeight:'700',
      textAlign:'center'
    }} 
    mode="contained"
    onPress={onPress}>
    {loading ? 'Please wait' : title}
  </Button>
);

export default CTA;
