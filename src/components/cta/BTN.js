import React from 'react';
import {
    Pressable,
    Text,
    TouchableOpacity,
    View,
    ActivityIndicator
  } from 'react-native';
import {colors} from '../../theme/colors';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { RFValue } from 'react-native-responsive-fontsize';
import { fonts } from '../../theme/fonts/fonts';

const BTN = ({
    title,
    onPress,
    loading,
    disable,
    backgroundColor,
    borderColor,
    width,
    height,
    labelColor,
    isBottom,
    bottomCheck,
    textTransform,
    padding
}) => (
 <TouchableOpacity 
 style={{ backgroundColor: backgroundColor ? backgroundColor :colors.main,
 width: width ? width : wp('85%'),
 height: height ? height : hp('5.5%'),
 borderRadius: 50,
 justifyContent: 'center',
 opacity: disable ? 0.6 : 1,
 alignSelf: 'center',
 position: isBottom ? 'absolute' : 'relative',
 bottom:bottomCheck?bottomCheck:10,
 borderColor:borderColor?borderColor:colors.main,
 borderWidth:1
}}
 activeOpacity={0.8}
 disabled={disable}
  onPress={onPress} >
    {loading == true ?
     <View style={{flexDirection:'row', justifyContent:'center',alignItems:'center'}}>
      <ActivityIndicator size="small" color={labelColor ? labelColor : colors.white} />
        <Text style={{color: labelColor ? labelColor : colors.white,
      marginVertical: 0,
      padding:padding?padding: '3%',
      textTransform: textTransform ? textTransform: 'uppercase',
      fontSize:RFValue(12),
      fontFamily:fonts.bold,
      textAlign:'center'}}>
        {'Please wait'}
    </Text>
    </View>:
     <Text style={{
        color: labelColor ? labelColor : colors.white,
      textTransform: textTransform ? textTransform: 'uppercase',
      fontSize:RFValue(12),
      fontFamily:fonts.bold,
      textAlign:'center'}}>
        {title}
    </Text>}

 </TouchableOpacity>
);

export default BTN;
