import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  Pressable,
} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {SvgXml} from 'react-native-svg';
import {appImages, appImagesSvg} from '../commons/AppImages';
import {colors} from '../theme/colors';
import {fonts} from '../theme/fonts/fonts';

const Rating = ({rating}) => {
  return (
    <View style={styles.main}>
      <SvgXml style={styles.image} xml={appImagesSvg.whiteStar} />
      <Text style={styles.rate}>{Number(rating ?? 0)?.toFixed(1)}</Text>
    </View>
  );
};

export default Rating;

const styles = StyleSheet.create({
  main: {
    flexDirection: 'row',
    height: hp('2.5%'),
    width: wp('14%'),
    backgroundColor:colors.colorFA,
    borderRadius: 5,
    alignItems: 'center',
    marginHorizontal: 5,
    justifyContent: 'center',
  },
  image: {
    alignSelf: 'center',
    right:2
  },
  rate: {
    fontSize: RFValue(12),
    fontFamily: fonts.medium,
    color: colors.white,
    textAlign: 'center',
  },
});
