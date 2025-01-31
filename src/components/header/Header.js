import React, {useEffect, useState} from 'react';
import {Pressable, Text, TouchableOpacity, View} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import {SvgXml} from 'react-native-svg';
import {appImagesSvg} from '../../commons/AppImages';
import {colors} from '../../theme/colors';
import {fonts} from '../../theme/fonts/fonts';

const Header = ({shareSVG,bgColor,onPress, title, backArrow, shareIcon, onPressShare,onPressPhone}) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        backgroundColor:bgColor?bgColor:colors.appBackground,
        alignItems: 'center',
        paddingBottom: '3%',
        marginTop: '4%',
        // borderBottomColor:colors.colorD9,
        // borderBottomWidth:1
      }}>
      {backArrow && (
        <TouchableOpacity
          activeOpacity={0.9}
          hitSlop={{top:20,bottom:20,left:20,right:20}}
          onPress={onPress}
          style={{marginLeft: '4%'}}>
          <SvgXml xml={appImagesSvg.backArrow} />
        </TouchableOpacity>
      )}
      <Text
      numberOfLines={1}
        style={{
          flex: 1,
          fontSize: RFValue(15),
          fontFamily: fonts.semiBold,
          color: colors.black,
          marginLeft: backArrow ? '3%' :'6%',
          marginRight:'2%'
        }}>
        {title}
      </Text>
      {shareIcon && (
        <TouchableOpacity
        hitSlop={{top:10,bottom:10,left:20,right:20}}
          activeOpacity={0.9}
          onPress={onPressShare}
          style={{marginRight: '5%'}}>
          <SvgXml xml={shareSVG ? shareSVG : 
            appImagesSvg.shareIcon} />
        </TouchableOpacity>
      )}
       {onPressPhone && (
        <TouchableOpacity
        hitSlop={{top:10,bottom:10,left:20,right:20}}
          activeOpacity={0.9}
          onPress={onPressPhone}
          style={{marginRight: '5%'}}>
          <SvgXml xml={appImagesSvg.phoneChatIcon} />
        </TouchableOpacity>
      )}


    </View>
  );
};

export default Header;
