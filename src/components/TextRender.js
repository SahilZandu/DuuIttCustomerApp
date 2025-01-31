import React from 'react';
import {StyleSheet, View, Text, Image} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import {colors} from '../theme/colors';
import {fonts} from '../theme/fonts/fonts';

const TextRender = ({title, value, bottomLine,titleStyle,valueStyle,lineStyle}) => {
  return (
    <>
      <View style={styles.container}>
        <Text numberOfLines={1} style={[styles.title,titleStyle]}>{title}</Text>
        <Text style={[styles.value,valueStyle]}>{value}</Text>
      </View>
      {bottomLine && <View style={[styles.bottomLine,lineStyle]} />}
    </>
  );
};

export default TextRender;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginTop: '6%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    flex: 1,
    fontSize: RFValue(12),
    fontFamily: fonts.regular,
    color: colors.black,
    marginRight:'9%'
  },
  value: {
    fontSize: RFValue(13),
    fontFamily: fonts.semiBold,
    color: colors.black,
  },
  bottomLine: {
    height: 1,
    backgroundColor: colors.colorD9,
    marginTop: '6%',
    marginHorizontal: -20,
  },
});
