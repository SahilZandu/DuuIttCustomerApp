import React, {useEffect, useRef, useState} from 'react';
import {
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
  View,
  Text,
  Platform,
} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import {SvgXml} from 'react-native-svg';
import {appImages, appImagesSvg} from '../commons/AppImages';
import {colors} from '../theme/colors';
import {fonts} from '../theme/fonts/fonts';
import CTA from './cta/CTA';
import {currencyFormat} from '../halpers/currencyFormat';
import {Surface} from 'react-native-paper';
import BTN from './cta/BTN';
import PickDropComp from './PickDropComp';
import moment from 'moment';
import Url from '../api/Url';
import { screenWidth } from '../halpers/matrics';

const CardOrder = ({item, index}) => {
  // console.log('item -- ', item);
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

  const dateTimeFormat = createdAt => {
    const date = new Date(createdAt);
    const formattedDate = moment(date).format('MMM DD, YYYY - hh:mm A');
    // console.log('formattedDate--', formattedDate); // Output: Jul 25, 2024 - 10:30 AM
    return formattedDate;
  };

  const setImageIcon = status => {
    switch (status) {
      case 'food':
        return appImages.order1;
      case 'parcel':
        return appImages.order2;
      case 'ride':
        return appImages.order3;
    }
  };

  return (
    <Surface
      elevation={2}
      style={{
        shadowColor: colors.black, // You can customize shadow color
        backgroundColor: colors.white,
        alignSelf: 'center',
        borderRadius: 10,
        width: screenWidth(90),
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
            source={
              item?.rider?.profile_pic?.length > 0
                ? {uri: Url.Image_Url + item?.rider?.profile_pic}
                : setImageIcon(item?.order_type)
            }
          />
          <View style={{flex: 1, flexDirection: 'column', marginLeft: '2.5%'}}>
            <Text
              numberOfLines={1}
              style={{
                fontSize: RFValue(15),
                fontFamily: fonts.medium,
                color: colors.black,
              }}>
              {item?.name ? item?.name : `Tracking ID:${item?.customer_id}`}
            </Text>
            <Text
              style={{
                fontSize: RFValue(13),
                fontFamily: fonts.medium,
                color: '#838282',
                marginTop: '3%',
              }}>
              {dateTimeFormat(item?.createdAt)}
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
                {currencyFormat(item?.total_amount)}
              </Text>
            </View>
          </View>
        </View>

        <View style={{marginHorizontal: 10, marginTop: '3%'}}>
          {item?.order_type !== 'food' ? (
            <PickDropComp
              item={{
                id: 1,
                pickup_drop: 'Pickup point',
                pickup: item?.sender_address?.address,
                drop: item?.receiver_address?.address,
              }}
              lineHeight={48}
            />
          ) : (
            <>
              {/* {item?.sender_address?.map((value, i) => {
                return (
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
                );
              })} */}
            </>
          )}

          <View
            style={{
              flexDirection: 'row',
              marginTop: '12%',
              justifyContent: 'space-between',
            }}>
            <BTN
              backgroundColor={colors.white}
              labelColor={colors.main}
              width={screenWidth(38)}
              title={setDetailsBtn(item?.order_type)}
              onPress={() => {
                // handleVerify(otp);
              }}
              bottomCheck={15}
              textTransform={'capitalize'}
            />

            <BTN
              width={screenWidth(38)}
              title={setProgressBtn(item?.order_type)}
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
