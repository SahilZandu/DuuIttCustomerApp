import React from 'react';
import {StyleSheet, View, Text, Image} from 'react-native';
import {Surface} from 'react-native-paper';
import {RFValue} from 'react-native-responsive-fontsize';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {SvgXml} from 'react-native-svg';
import {appImages, appImagesSvg} from '../commons/AppImages';
import {currencyFormat} from '../halpers/currencyFormat';
import {colors} from '../theme/colors';
import {fonts} from '../theme/fonts/fonts';

const TextRender = ({title, value, bottomLine}) => {
  return (
    <>
      <View style={styles.container}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.value}>{value}</Text>
      </View>
      {bottomLine && <View style={styles.bottomLine} />}
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
