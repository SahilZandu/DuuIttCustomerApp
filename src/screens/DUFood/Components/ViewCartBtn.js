import React from 'react';
import {Pressable, Text,View} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {RFValue} from 'react-native-responsive-fontsize';
import {fonts} from '../../../theme/fonts/fonts';
import {SvgXml} from 'react-native-svg';
// import { View } from 'react-native-reanimated/lib/typescript/Animated';

const textProps = {
  color: 'white',
  fontFamily: fonts.medium,
  fontSize: RFValue(13),
};

const ViewCartBtn = ({viewCart, items,isDash}) => {
  return (
    <Pressable
      onPress={viewCart}
      style={{
        position:isDash ? 'relative' : 'absolute',
        bottom: isDash ?  '3%' : 0,
        height: hp('10%'),
        width:isDash ? '95%' : '100%',
        backgroundColor: '#28B056',
        
        
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        borderBottomLeftRadius : isDash ? 16 : 0,
        borderBottomRightRadius : isDash ? 16 : 0,
        paddingHorizontal: 20,
        
        alignSelf:'center',
        justifyContent:'center'
      }}>
        <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
        }}>

     
      <Text style={{...textProps}}>
        {items} {items > 1 ? 'Items' : 'Item'} added
      </Text>

      <Text style={{marginLeft: 'auto' , ...textProps,fontSize: RFValue(16)}}>319</Text>
      </View>
      <Text style={{ ...textProps}}>Add items worth 100 more to get 150 off</Text>

      {/* <SvgXml xml={righticon} /> */}
    </Pressable>
  );
};

export default ViewCartBtn;

const righticon = `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="30" viewBox="0 0 16 16" fill="none">
<path d="M6 12L10 8L6 4" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;
