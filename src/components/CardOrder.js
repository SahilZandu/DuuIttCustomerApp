import React, {useEffect, useRef, useState} from 'react';
import {
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
  View,
  Text,
} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {SvgXml} from 'react-native-svg';
import {appImagesSvg} from '../commons/AppImages';
import {colors} from '../theme/colors';
import {fonts} from '../theme/fonts/fonts';
import CTA from './cta/CTA';
import {currencyFormat} from '../halpers/currencyFormat';
import {Surface} from 'react-native-paper';
import BTN from './cta/BTN';
import PickDropComp from './PickDropComp';

const CardOrder = ({item, index}) => {
  const setDetailsBtn = status => {
    switch (status) {
      case 'food':
        return 'Order Details';
      case 'parcel':
        return 'Order Details';
      case 'ride':
        return 'Ride Details';
    }
  };

  const setProgressBtn = status => {
    switch (status) {
      case 'food':
        return 'Reorder';
      case 'parcel':
        return 'Repeat';
      case 'ride':
        return 'Rebooking';
    }
  };

  return (
    <Surface
    elevation={5}
    style={{
      shadowColor:  colors.black, // You can customize shadow color
      backgroundColor: colors.white,
      alignSelf: 'center',
      borderRadius: 10,
      width: wp('90%'),
      marginTop: '5%',

    }}>
    <TouchableOpacity
      key={index}
      activeOpacity={0.8}
      style={{
        alignSelf: 'center',
        borderRadius: 10,
      }}>
     
        <View
          style={{
            paddingHorizontal: '3%',
            marginTop: '5%',
            flexDirection: 'row',
          }}>
          <Image
            style={{width: 75, height: 75, borderRadius: 10}}
            source={item?.image}
          />
          <View style={{flex: 1, flexDirection: 'column', marginLeft: '2.5%'}}>
            <Text
              numberOfLines={1}
              style={{
                fontSize: RFValue(15),
                fontFamily: fonts.medium,
                color: colors.black,
              }}>
              {item?.name ? item?.name : `Tracking ID:${item?.tracking_id}`}
            </Text>
            <Text
              style={{
                fontSize: RFValue(13),
                fontFamily: fonts.medium,
                color: '#838282',
                marginTop: '3%',
              }}>
              {item?.date}
            </Text>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: '3%',
              }}>
              <Text
                style={{
                  fontSize: RFValue(13),
                  fontFamily: fonts.medium,
                  color: item?.status == 'Canceled' ? '#E70000' : '#28B056',
                }}>
                {item?.status}
              </Text>
              <View style={{flex: 1, marginLeft: '4%'}}>
                <SvgXml
                  xml={
                    item?.status == 'Canceled'
                      ? appImagesSvg.crossSvg
                      : appImagesSvg.rightSvg
                  }
                />
              </View>
              <Text
                style={{
                  fontSize: RFValue(13),
                  fontFamily: fonts.medium,
                  color: colors.black,
                }}>
                {currencyFormat(item?.price)}
              </Text>
            </View>
          </View>
        </View>

        <View style={{marginHorizontal: 10, marginTop: '3%'}}>
          {item?.itemArray?.map((value, i) => {
            return (
              <>
                {value?.type?.length > 0 ? (
                  <View key={i} style={{flexDirection: 'row', marginTop: '4%'}}>
                    <SvgXml
                      xml={
                        value?.type == 'veg'
                          ? appImagesSvg.vegSvg
                          : appImagesSvg.nonVeg
                      }
                    />
                    <Text
                      numberOfLines={1}
                      style={{
                        fontSize: RFValue(13),
                        fontFamily: fonts.regular,
                        marginLeft: '2%',
                        width: wp('75%'),
                      }}>
                      {value?.name}
                      <Text style={{color: '#646464'}}> x {value?.qty}</Text>
                    </Text>
                  </View>
                ) : (
                  <PickDropComp item={value} lineHeight={48}/>
                )}
              </>
            );
          })}

          <View
            style={{
              flexDirection: 'row',
              marginTop: '12%',
              justifyContent: 'space-between',
            }}>
            <BTN
              backgroundColor={colors.white}
              labelColor={colors.main}
              width={wp('38%')}
              title={setDetailsBtn(item?.statusOrder)}
              onPress={() => {
                // handleVerify(otp);
              }}
              bottomCheck={15}
              textTransform={'capitalize'}
            />

            <BTN
            width={wp('38%')}
            title={setProgressBtn(item?.statusOrder)}
            onPress={() => {
              // handleVerify(otp);
            }}
            bottomCheck={15}
            textTransform={'capitalize'}
            />
          </View>
        </View>
    </TouchableOpacity>
    </Surface>
  );
};

export default CardOrder;
