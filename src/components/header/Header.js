import React, {useEffect, useState} from 'react';
import {Pressable, Text,TouchableOpacity,View} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import { SvgXml } from 'react-native-svg';
import { appImagesSvg } from '../../commons/AppImages';
import { colors } from '../../theme/colors';
import { fonts } from '../../theme/fonts/fonts';


const Header = ({onPress,title,backArrow}) => {
 

  return (
    <View style={{flexDirection:'row', 
    backgroundColor:colors.white,
    alignItems:'center',paddingBottom:'1%' }}>
      {backArrow && <TouchableOpacity 
        activeOpacity={0.9}
        onPress={onPress} 
        style={{marginLeft:'3%',padding:5,marginTop:'4%'}}>
        <SvgXml 
           xml={appImagesSvg.backArrow}/>
        </TouchableOpacity> }
        <Text style={{fontSize:RFValue(15),fontFamily:fonts.semiBold,
            color:colors.black,marginLeft:'3%',marginTop:'3%'}}>{title}</Text>
     
      </View>

  );
};

export default Header;
