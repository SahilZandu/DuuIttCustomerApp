import React, {useState, useEffect} from 'react';
import {Text, TouchableOpacity, View, Image, StyleSheet} from 'react-native';
import {currencyFormat} from '../../../halpers/currencyFormat';
import {fonts} from '../../../theme/fonts/fonts';
import {RFValue} from 'react-native-responsive-fontsize';
import {SvgXml} from 'react-native-svg';
import {appImages, appImagesSvg} from '../../../commons/AppImages';
import DotedLine from '../Components/DotedLine';
import {colors} from '../../../theme/colors';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const DeliveryCart = ({
  DeliveryInMint,
  address,
  locationAddress,
  onAddInstruction,
  isTxtInst,
  instuctions,
  isAudio,
  isPlaying,
  audioInstuctions,
  nameWithNumber,
  number,
  onBillDetails,
  totalBill,
  cartBillG,
}) => {
  const AddInstruction = () => {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onAddInstruction}
        style={styles.addInstTouch}>
        <Image
          resizeMode="contain"
          style={styles.resImage}
          source={appImages.retaurentNote}
        />
        {isTxtInst && <Text style={styles.instructionText}>{instuctions}</Text>}
        {isAudio && (
          <View style={styles.audioView}>
            <SvgXml
              xml={isPlaying ? appImagesSvg.stopRed : appImagesSvg.playRed}
            />
            <Text style={styles.audioInstText}>{audioInstuctions}</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.deliveryInMintView}>
        <SvgXml xml={appImagesSvg.deliveryTime} />
        <Text style={styles.deliveryInMintText}>{DeliveryInMint}</Text>
      </View>

      <View style={styles.mainDeliverycartView}>
        <View style={styles.deliveryAddressView}>
          <View style={styles.deliveryAddressInnerView}>
            <SvgXml xml={appImagesSvg.markerColor} />
            <View style={styles.addressView}>
              <Text style={styles.addressText}>{address}</Text>
              <Text numberOfLines={2} style={styles.locationAddress}>
                {locationAddress}
              </Text>
              <AddInstruction />
            </View>
          </View>
          <SvgXml xml={appImagesSvg.rightArrow} />
        </View>

        <DotedLine />

        <View style={styles.nameNumberView}>
          <View style={styles.nameNumberInnerView}>
            <SvgXml xml={appImagesSvg.phone_} />
            <View style={styles.nameWithNumberView}>
              <Text numberOfLines={2} style={styles.nameWithNumber}>
                {nameWithNumber}
              </Text>
              <Text numberOfLines={1} style={styles.phoneText}>
                {number}
              </Text>
            </View>
          </View>
          <SvgXml xml={appImagesSvg.rightArrow} />
        </View>

        <DotedLine marginTop={'3%'} />

        <View style={styles.tottalBillView}>
          <TouchableOpacity activeOpacity={0.8} onPress={onBillDetails}>
            <View style={styles.totalBillInnerView}>
              <SvgXml xml={appImagesSvg.totalBill} />
              <View style={styles.totalBillRatetView}>
                <View style={styles.totalBillWithRate}>
                  <Text style={styles.totalBillText}>{totalBill}</Text>
                  <Text style={styles.crossLineText}>
                    {currencyFormat(cartBillG?.cartTotal)}
                    {''}
                  </Text>
                  <Text style={styles.totalRateText}>
                    {currencyFormat(cartBillG?.topay)}
                  </Text>
                  <Text style={styles.saveYouText}>You saved ₹10</Text>
                </View>
                <Text numberOfLines={2} style={styles.taxesText}>
                  Incl. taxes and charges
                </Text>
              </View>
            </View>
          </TouchableOpacity>
          <SvgXml xml={appImagesSvg.rightArrow} />
        </View>
      </View>
    </View>
  );
};

export default DeliveryCart;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginTop: '5%',
    justifyContent: 'center',
  },
  deliveryInMintView: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    backgroundColor: colors.white,
    padding: 10,
    // height:hp("5%"),
    alignItems: 'center',
    justifyContent: 'center',
    borderTopEndRadius: 10,
    borderTopLeftRadius: 10,
    borderWidth: 1,
    borderColor: colors.colorCA,
    elevation: 4,
    shadowColor: colors.black,
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: {width: 0, height: 4},
  },
  deliveryInMintText: {
    fontFamily: fonts.medium,
    fontSize: RFValue(12),
    color: colors.color24,
    marginLeft: '2%',
  },
  mainDeliverycartView: {
    width: wp('90%'),
    alignSelf: 'flex-start',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    padding: 10,
    marginTop: hp('-0.6%'),
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.colorCA,
    elevation: 4,
    shadowColor: colors.black,
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: {width: 0, height: 4},
  },
  deliveryAddressView: {
    width: wp('84%'),
    flexDirection: 'row',
    alignSelf: 'flex-start',
    justifyContent: 'space-between',
    marginTop: '2%',
  },
  deliveryAddressInnerView: {
    width: wp('70%'),
    flexDirection: 'row',
  },
  addressView: {
    marginLeft: '2.5%',
    justifyContent: 'center',
  },
  addressText: {
    alignSelf: 'flex-start',
    fontFamily: fonts.medium,
    fontSize: RFValue(12),
    color: colors.color24,
  },
  locationAddress: {
    alignSelf: 'flex-start',
    fontFamily: fonts.medium,
    fontSize: RFValue(11),
    color: colors.color8A,
    marginTop: '0.5%',
  },
  addInstTouch: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    backgroundColor: colors.white,
    padding: 10,
    alignItems: 'center',
    marginTop: '3%',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.colorCA,
    elevation: 4,
    shadowColor: colors.black,
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: {width: 0, height: 4},
  },
  resImage: {
    width: wp('5%'),
    height: hp('2%'),
  },
  instructionText: {
    fontFamily: fonts.medium,
    fontSize: RFValue(11),
    color: colors.color24,
    marginLeft: '2%',
  },
  audioView: {
    marginLeft: '2%',
    flexDirection: 'row',
    backgroundColor: colors.white,
    alignItems: 'center',
  },
  audioInstText: {
    fontFamily: fonts.medium,
    fontSize: RFValue(11),
    color: colors.color24,
    marginLeft: '2.5%',
  },
  nameNumberView: {
    width: wp('84%'),
    flexDirection: 'row',
    alignSelf: 'flex-start',
    justifyContent: 'space-between',
    marginTop: '4%',
  },
  nameNumberInnerView: {
    width: wp('70%'),
    flexDirection: 'row',
  },
  nameWithNumberView: {
    marginLeft: '2.5%',
    justifyContent: 'center',
  },
  nameWithNumber: {
    alignSelf: 'flex-start',
    fontFamily: fonts.medium,
    fontSize: RFValue(12),
    color: colors.color24,
  },
  phoneText: {
    alignSelf: 'flex-start',
    fontFamily: fonts.medium,
    fontSize: RFValue(11),
    color: colors.color8A,
    marginTop: '1%',
  },
  tottalBillView: {
    width: wp('84%'),
    flexDirection: 'row',
    alignSelf: 'flex-start',
    justifyContent: 'space-between',
    marginTop: '3%',
    paddingBottom: '1%',
  },
  totalBillInnerView: {
    width: wp('70%'),
    flexDirection: 'row',
  },
  totalBillRatetView: {
    marginLeft: '2.5%',
    justifyContent: 'center',
  },
  totalBillWithRate: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  totalBillText: {
    alignSelf: 'flex-start',
    fontFamily: fonts.medium,
    fontSize: RFValue(12),
    color: colors.color24,
  },
  crossLineText: {
    color: colors.black75,
    textDecorationLine: 'line-through',
    fontFamily: fonts.medium,
    fontSize: RFValue(12),
    marginLeft: '3%',
  },
  totalRateText: {
    fontFamily: fonts.medium,
    fontSize: RFValue(12),
    color: colors.color24,
    marginLeft: '2%',
  },
  saveYouText: {
    fontFamily: fonts.medium,
    fontSize: RFValue(10),
    color: colors.main,
    borderRadius: 5,
    marginLeft: '2%',
    paddingHorizontal: '3%',
    paddingVertical: '2%',
    paddingBottom: 2,
    backgroundColor: colors.colorD6,
  },
  taxesText: {
    fontFamily: fonts.medium,
    fontSize: RFValue(11),
    color: colors.color8A,
  },
});
