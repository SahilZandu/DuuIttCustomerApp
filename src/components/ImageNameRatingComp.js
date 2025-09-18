import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Dimensions, TouchableOpacity, View, Text } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { SvgXml } from 'react-native-svg';
import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts/fonts';
import FastImage from 'react-native-fast-image';
import Url from '../api/Url';
import { appImages } from '../commons/AppImages';
import Rating from './Rating';

const ImageNameRatingComp = ({ parcelInfo }) => {
  return (
    <View style={styles.container}>
      <View style={styles.innerView}>
        <FastImage
          style={styles.image}
          source={
            parcelInfo?.rider?.profile_pic?.length > 0
              ? {
                uri: Url?.Image_Url + parcelInfo?.rider?.profile_pic,
                priority: FastImage.priority.high,
              }
              : appImages.avtarImage
          }
          resizeMode={FastImage.resizeMode.stretch}
        />
        <View style={{ flexDirection: 'column', justifyContent: 'center' }}>
          <Text numberOfLines={1} style={styles.nameText}>
            {parcelInfo?.rider?.name}
          </Text>
          <FastImage
            style={{ width: 50, height: 50, marginLeft: '4%' }}
            source={parcelInfo?.rider?.vehicle_info?.vehicle_type == 'bike' ?
              appImages.bikeRiderImage :
              appImages?.scootyRiderImage}
            resizeMode={FastImage.resizeMode.contain}
          />
        </View>

        <Rating rating={parcelInfo?.rider?.average_rating !== undefined
          ? Number(parcelInfo?.rider?.average_rating)?.toFixed(1)?.toString()
          : '0.0'} />
      </View>
      <View style={styles.bottomLine} />
    </View>
  );
};

export default ImageNameRatingComp;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: '5%',
  },
  innerView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    width: 55,
    height: 55,
    borderRadius: 100,
    borderWidth: 0.2,
    borderColor: colors.main,
  },
  nameText: {
    fontSize: RFValue(12),
    fontFamily: fonts.semiBold,
    color: colors.black,
    marginLeft: '4%',
    width: wp('56.2%'),
    top: '7%'
  },
  bottomLine: {
    height: 1,
    backgroundColor: colors.colorD9,
    marginTop: '4%',
    marginHorizontal: -20,
  },
});
