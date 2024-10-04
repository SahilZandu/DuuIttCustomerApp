import React, {useEffect, useState} from 'react';
import {Text, View, Pressable, StyleSheet} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import {SvgXml} from 'react-native-svg';
import {fonts} from '../theme/fonts/fonts';
import {appImagesSvg} from '../commons/AppImages';
import {colors} from '../theme/colors';
import TrackingOrderCard from './TrackingOrderCard';

const DotTextComp = ({title, index,data}) => {
  return (
    <View key={index} style={[styles.main(index,data)]}>
      <View style={styles.dotView} />
      <Text style={styles.text}>{title}</Text>
    </View>
  );
};

export default DotTextComp;

const styles = StyleSheet.create({
  main: (index,data) => ({
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: index == 0 ? '4%' : '2%',
    marginHorizontal: '3%',
    marginBottom:(index == data?.length - 1) ? '4%' : '2%',
  }),
  dotView: {
    height: 8,
    width: 8,
    borderRadius: 10,
    backgroundColor: colors.color53,
  },
  text: {
    fontSize: RFValue(12),
    fontFamily: fonts.medium,
    color: colors.color53,
    marginLeft: '2%',
  },
});
