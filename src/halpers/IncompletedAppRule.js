import React, {useEffect, useState} from 'react';
import {Pressable, Text, View} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {RFValue} from 'react-native-responsive-fontsize';
import {fonts} from '../theme/fonts/fonts';
import {colors} from '../theme/colors';
import {currencyFormat} from './currencyFormat';
import Svg, {SvgXml} from 'react-native-svg';
import {appImagesSvg} from '../commons/AppImages';

const textProps = {
  color: colors.white,
  fontFamily: fonts.medium,
  fontSize: RFValue(14),
};

const IncompletedAppRule = ({onHanlde,title,message, isDash}) => {
  console.log('onHanlde items', onHanlde, isDash);
  return (
    <Pressable
      onPress={() => {
        onHanlde();
      }}
      style={{
        position: isDash ? 'relative' : 'absolute',
        bottom: isDash ? '3%' : 0,
        height: hp('8.5%'),
        width: isDash ? '95%' : '100%',
        backgroundColor: colors.main,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        borderBottomLeftRadius: isDash ? 16 : 0,
        borderBottomRightRadius: isDash ? 16 : 0,
        paddingHorizontal: 20,
        alignSelf: 'center',
        justifyContent: 'center',
      }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Text style={{...textProps, flex: 1}}>{title}</Text>
        <SvgXml
          style={{marginTop: '3%'}}
          width={18}
          height={18}
          xml={appImagesSvg?.rightWhiteArrow}
        />
      </View>
      <Text style={{...textProps, fontSize: RFValue(12)}}>
      {message}
      </Text>
    </Pressable>
  );
};

export default IncompletedAppRule;
