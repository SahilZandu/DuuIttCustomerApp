import React, {useEffect, useState} from 'react';
import {
  Text,
  View,
  StyleSheet,
} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import {SvgXml} from 'react-native-svg';
import {colors} from '../theme/colors';
import {fonts} from '../theme/fonts/fonts';
import {Strings} from '../translates/strings';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { appImagesSvg } from '../commons/AppImages';



const AuthScreenContent= ({title ,subTitle,marginTop}) => {
  return (
    <View
    style={styles.main(marginTop)}>
    <SvgXml xml={appImagesSvg.logoIcon} />
    <Text
      style={styles.titleText}>
      {title}
    </Text>
    <Text
      style={styles.subTitleText}>
     {subTitle}
    </Text>
  </View>
  );
};

export default AuthScreenContent;


const styles = StyleSheet.create({
    main:(marginTop)=>( {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop:marginTop ? marginTop : '20%',
        marginHorizontal:22
      }),
      titleText: {
        fontSize: RFValue(21),
        fontFamily: fonts.semiBold,
        color: colors.main,
        marginTop: '2.5%',
        textAlign:'center'
      },
      subTitleText: {
        fontSize: RFValue(13),
        fontFamily: fonts.medium,
        color: colors.color80,
        marginTop: '2.5%',
        textAlign:'center'
      },
})
