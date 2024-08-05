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
    width,
    height,
    labelColor,
    isBottom,
    bottomCheck,
    textTransform,
}) => (
 <TouchableOpacity 
 style={{ backgroundColor: backgroundColor ? backgroundColor : '#28B056',
 width: width ? width : wp('85%'),
 height: height ? height : hp('5.5%'),
 borderRadius: 8,
 justifyContent: 'center',
 opacity: disable ? 0.6 : 1,
 alignSelf: 'center',
 position: isBottom ? 'absolute' : 'relative',
 bottom:bottomCheck?bottomCheck:20,
 borderColor:'#28B056',
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
