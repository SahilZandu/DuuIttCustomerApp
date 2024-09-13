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
import PickDropComp from './PickDropComp';

const TrackingOrderCard = ({value}) => {
  return (
    <>
      <Surface elevation={2} style={styles.container}>
        <View style={styles.imageTextView}>
          <Image
            resizeMode="contain"
            style={{width: 55, height: 55}}
            source={appImages.parcelImageWhite}
          />
          <View style={styles.trackingIdView}>
            <Text style={styles.trackingId}>Tracking ID: </Text>
            <Text numberOfLines={1} style={styles.trackingText}>
              {value?.trackingId}
            </Text>
          </View>
          <View style={styles.priceView}>
            <Text numberOfLines={1} style={styles.priceText}>
              {currencyFormat(Number(value?.price))}
            </Text>
          </View>
        </View>

        <View style={{marginHorizontal: 20}}>
          <PickDropComp item={value} />
          <View style={styles.dateView}>
            <SvgXml xml={appImagesSvg.datePickerSvg} />
            <Text style={styles.dateText}>{value?.date}</Text>
          </View>
        </View>
      </Surface>
    </>
  );
};

export default TrackingOrderCard;

const styles = StyleSheet.create({
  container: {
    shadowColor: colors.black50, // You can customize shadow color
    backgroundColor: colors.white,
    alignSelf: 'center',
    borderRadius: 10,
    height: hp('23%'),
    marginTop: '5%',
  },
  imageTextView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: '4%',
  },
  trackingIdView: {
    flex: 1,
    marginHorizontal: 10,
    justifyContent: 'center',
  },
  trackingId: {
    fontSize: RFValue(10),
    fontFamily: fonts.semiBold,
    color: colors.color72,
    marginBottom: '3%',
  },
  trackingText: {
    fontSize: RFValue(14),
    fontFamily: fonts.semiBold,
    color: colors.black,
  },
  priceView: {
    backgroundColor: colors.main,
    borderRadius: 7,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
  },
  priceText: {
    fontSize: RFValue(13),
    fontFamily: fonts.bold,
    color: colors.white,
    minWidth: wp('10%'),
    maxWidth: wp('20%'),
    textAlign: 'center',
  },
  dateView: {
    flexDirection: 'row',
    marginTop: '4%',
  },
  dateText: {
    fontSize: RFValue(11),
    fontFamily: fonts.medium,
    color:colors.color72,
    marginLeft: '3%',
  },
});
