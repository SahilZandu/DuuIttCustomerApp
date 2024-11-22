import React, {useEffect, useState} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Platform,
  Image,
  TouchableOpacity,
} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import {SvgXml} from 'react-native-svg';
import {fonts} from '../theme/fonts/fonts';
import {appImages, appImagesSvg} from '../commons/AppImages';
import {colors} from '../theme/colors';
import {Surface} from 'react-native-paper';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

const GiftCardHappiness = ({item}) => {
  return (
    <Surface elevation={3} style={styles.surfaceView}>
      <View style={styles.imageTextView}>
        <Image style={styles.imageBanner} source={item?.image} />
        <View style={styles.greatTextView}>
          <Text style={styles.greatText}>{item?.msgDay}</Text>
        </View>
      </View>
    </Surface>
  );
};

export default GiftCardHappiness;

const styles = StyleSheet.create({
  surfaceView: {
    shadowColor: Platform.OS == 'ios' ? colors.black50 : colors.black, // You can customize shadow color
    backgroundColor: colors.white,
    borderRadius: 10,
    height: hp('36.3%'),
    marginTop: '6%',
  },
  imageTextView: {
    justifyContent: 'center',
    marginTop: '5%',
  },
  imageBanner: {
    height: hp('25%'),
    width: wp('82%'),
    borderRadius: 10,
    alignSelf: 'center',
  },
  greatTextView: {
    justifyContent: 'center',
    backgroundColor: colors.colorD6,
    marginHorizontal: 15,
    marginTop: hp('2%'),
    height: hp('5%'),
    borderRadius: 10,
  },
  greatText: {
    fontSize: RFValue(12),
    fontFamily: fonts.medium,
    color: colors.black,
    marginLeft: '6%',
  },
});
