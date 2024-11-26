import React, {useEffect, useState} from 'react';
import {Pressable, Text, TouchableOpacity, View} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import {SvgXml} from 'react-native-svg';
import {appImagesSvg} from '../../commons/AppImages';
import {colors} from '../../theme/colors';
import {fonts} from '../../theme/fonts/fonts';

const Header = ({onPress, title, backArrow, shareIcon, onPressShare}) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        backgroundColor: colors.white,
        alignItems: 'center',
        paddingBottom: '2%',
        marginTop: '3.5%',
      }}>
      {backArrow && (
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={onPress}
          style={{marginLeft: '4%'}}>
          <SvgXml xml={appImagesSvg.backArrow} />
        </TouchableOpacity>
      )}
      <Text
        style={{
          flex: 1,
          fontSize: RFValue(12),
          fontFamily: fonts.semiBold,
          color: colors.black,
          marginLeft: '3%',
        }}>
        {title}
      </Text>
      {shareIcon && (
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={onPressShare}
          style={{marginRight: '5%'}}>
          <SvgXml xml={appImagesSvg.shareIcon} />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default Header;
