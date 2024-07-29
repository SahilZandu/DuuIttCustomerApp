import React from 'react';
import {Button} from 'react-native-paper';
import {colors} from '../../theme/colors';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

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
  bottomCheck
}) => (
  <Button
    disabled={loading || disable}
    loading={loading}
    style={{
      backgroundColor: backgroundColor ? backgroundColor : '#28B056',
      width: width ? width : wp('85%'),
      height: height ? height : hp('5.8%'),
      borderRadius: 8,
      justifyContent: 'center',
      opacity: disable ? 0.6 : 1,
      alignSelf: 'center',
      position: isBottom ? 'absolute' : 'relative',
      bottom:bottomCheck?bottomCheck:20,
    }}
    rippleColor={colors.ripleColor}
    labelStyle={{
      color: labelColor ? labelColor : colors.white,
      marginVertical: 0,
      padding: '3%',
      textTransform:'uppercase',
      fontSize:15,
      fontWeight:'700'
    }}
    mode="contained"
    onPress={onPress}>
    {loading ? 'Please wait' : title}
  </Button>
);

export default CTA;
