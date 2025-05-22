import React, {useEffect, useRef, useState} from 'react';
import {StyleSheet, Dimensions, TouchableOpacity,View, Text} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {SvgXml} from 'react-native-svg';
import { appImagesSvg } from '../commons/AppImages';
import {colors} from '../theme/colors';
import {fonts} from '../theme/fonts/fonts';

const RiderNotAvailableComp = ({onRefershFindRiders, onBackToHome,onCancelOrder}) => {

  return (
    <View style={styles.container}>
      <Text style={styles.noRidersText}>
        No riders available, Try again...{' '}
      </Text>
      <TouchableOpacity
        onPress={onRefershFindRiders}
        activeOpacity={0.8}
        style={styles.btnTouch}>
        <SvgXml height={50} width={50} xml={appImagesSvg.refershIcon} />
      </TouchableOpacity>
      <View style={{justifyContent:"space-between",
        flexDirection:'row',alignItems:'center',marginHorizontal:wp('10%')}}>
      <TouchableOpacity
        onPress={onCancelOrder}
        activeOpacity={0.8}
        style={styles.cancelOrderTouch}>
        <Text style={styles.cancelText}>Cancel Order</Text>
        <View style={[styles.bottomLine,{backgroundColor:colors.red}]} />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={onBackToHome}
        activeOpacity={0.8}
        style={styles.backHomeTouch}>
        <Text style={styles.backHomeText}>Back to home</Text>
        <View style={styles.bottomLine} />
      </TouchableOpacity>
      </View>
    </View>
  );
};

export default RiderNotAvailableComp;

const styles = StyleSheet.create({
  container: {
    width: wp('100%'),
    justifyContent: 'center',
  },
  noRidersText: {
    fontSize: RFValue(18),
    fontFamily: fonts.medium,
    color: colors.black,
    textAlign: 'center',
    marginTop: '5%',
  },
  btnTouch: {
    backgroundColor: '#F2F2F2',
    marginTop: hp('2.5%'),
    alignSelf: 'center',
    borderRadius: 100,
  },
  cancelOrderTouch: {
    marginTop: hp('2%'),
    alignSelf: 'center',
    alignItems: 'center',
    borderRadius: 100,
  },
  backHomeTouch: {
    marginTop: hp('2%'),
    alignSelf: 'center',
    alignItems: 'center',
    borderRadius: 100,
  },
  cancelText: {
    fontSize: RFValue(14),
    fontFamily: fonts.medium,
    color: colors.red,
  },
  backHomeText: {
    fontSize: RFValue(14),
    fontFamily: fonts.medium,
    color: colors.black85,
  },
  bottomLine: {
    height: 1,
    width: wp('28%'),
    backgroundColor: colors.black50,
  },
});
