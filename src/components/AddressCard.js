import React, {useEffect, useState} from 'react';
import {
  Pressable,
  Text,
  TouchableOpacity,
  View,
  Image,
  FlatList,
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
import {appImagesSvg} from '../commons/AppImages';

const AddressCard = ({item, index, onPress, onPressDot}) => {
  const setIcon = item => {
    switch (item) {
      case 'Home':
        return appImagesSvg.homeIcom;
      case 'Work':
        return appImagesSvg.workAddresIcon;
      case 'Hotel':
        return appImagesSvg.hotelIcon;
      default:
        return appImagesSvg.addressIcon;
    }
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      style={styles.container}
      activeOpacity={0.8}>
      <View style={styles.main} key={index}>
        <View style={styles.imageTextView}>
          <SvgXml xml={setIcon(item?.title)} />
          <Text style={styles.title}>{item?.title}</Text>
          <TouchableOpacity
            onPress={onPressDot}
            hitSlop={{left: 15, right: 15, top: 15, bottom: 15}}
            activeOpacity={0.8}>
            <SvgXml xml={appImagesSvg.dotedImageIcon} />
          </TouchableOpacity>
        </View>
        <Text style={styles.addressText}>{item?.address}</Text>
        <View
          style={styles.bottonLineView}
        />
      </View>
    </TouchableOpacity>
  );
};

export default AddressCard;

const styles = StyleSheet.create({
  container: {
    marginTop: '5%',
    justifyContent: 'center',
  },
  main: {
    marginHorizontal: 20,
    justifyContent: 'center',
  },
  imageTextView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    flex: 1,
    fontSize: RFValue(15),
    fontFamily: fonts.semiBold,
    color: colors.black,
    marginLeft: '3%',
  },
  addressText: {
    fontSize: RFValue(12),
    fontFamily: fonts.medium,
    color: colors.color64,
    marginLeft: '8%',
    marginTop: '1%',
    lineHeight: 20,
  },
  bottonLineView:{
    height: 1,
    backgroundColor: colors.colorD9,
    marginTop: '5%',
    marginHorizontal: -5,
  }
});
