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
import {screenWidth} from '../halpers/matrics';
import AppInputScroll from '../halpers/AppInputScroll';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import TextRender from './TextRender';
import DotedLine from '../screens/DUFood/Components/DotedLine';

const CardOrderDetails = ({item}) => {
  // console.log('item -- ', item);
  let firstCapStatus =
    item?.status.charAt(0).toUpperCase() + item?.status.slice(1).toLowerCase();

  const setTitleText = status => {
    switch (status) {
      case 'food':
        return 'Item Total';
      case 'parcel':
        return 'Parcel Amount';
      case 'ride':
        return 'Ride Amount';
    }
  };
  const billDetails = [
    {
      id: '1',
      name: setTitleText(item?.order_type),
      price: item?.total_amount ?? 200,
      coupanCode: '',
      bottomLine: false,
      isShow: true,
    },
    {
      id: '2',
      name: 'Delivery Fee',
      price: 150,
      coupanCode: '',
      bottomLine: false,
      isShow: item?.order_type == 'food' ? true : false,
    },
    {
      id: '3',
      name: 'Platform fee',
      price: 10,
      coupanCode: '',
      bottomLine: item?.order_type !== 'food' ? true : false,
      isShow: true,
    },
    {
      id: '4',
      name: 'GST and Restaurant Charges',
      price: 5,
      coupanCode: '',
      bottomLine: true,
      isShow: item?.order_type == 'food' ? true : false,
    },
    {
      id: '5',
      name: 'Grand Total',
      price: 230,
      coupanCode: '',
      bottomLine: false,
      isShow: item?.order_type == 'food' ? true : false,
    },
    {
      id: '6',
      name: 'Restaurant Coupon',
      price: 30,
      coupanCode: 'DUIT75',
      bottomLine: false,
      isShow: item?.order_type == 'food' ? true : false,
    },
    {
      id: '7',
      name: 'Total',
      price: item?.total_amount + 10 ?? 210,
      coupanCode: '',
      bottomLine: false,
      isShow: true,
    },
  ];

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
    <View style={styles.container}>
      <AppInputScroll padding={true} Pb={hp('25%')}>
        <TouchableOpacity style={{flex: 1}} activeOpacity={0.8}>
          <View style={styles.imageDateView}>
          <View style={styles.imageView}>
            <Image
              resizeMode="cover"
              style={styles.image}
              source={
                item?.rider?.profile_pic?.length > 0
                  ? {uri: Url.Image_Url + item?.rider?.profile_pic}
                  : setImageIcon(item?.order_type)
              }
            />
            </View>
            <View style={styles.trackTextView}>
              <Text numberOfLines={1} style={styles.trackIdText}>
                {item?.name ? item?.name : `Tracking ID:${item?.customer_id}`}
              </Text>
              <Text style={styles.dateText}>
                {dateTimeFormat(item?.createdAt)}
              </Text>
              <View style={styles.statusView}>
                <Text
                  style={[
                    styles.statusText,
                    {
                      color:
                        item?.status == 'Canceled' || item?.status == 'deleted'
                          ? '#E70000'
                          : '#28B056',
                    },
                  ]}>
                  {firstCapStatus}
                </Text>
                <View style={styles.statusImageView}>
                  <SvgXml
                    xml={
                      item?.status == 'Canceled' || item?.status == 'deleted'
                        ? appImagesSvg.crossSvg
                        : appImagesSvg.rightSvg
                    }
                  />
                </View>
                <Text style={styles.amountText}>
                  {currencyFormat(item?.total_amount)}
                </Text>
              </View>
            </View>
          </View>
          <View style={{marginTop: '3%'}}>
            {item?.order_type !== 'food' ? (
              <PickDropComp
                item={{
                  id: 1,
                  pickup_drop: 'Pickup location',
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
          </View>

          <View style={styles.scrollInnerView}>
            <Text numberOfLines={1} style={styles.billingSummary}>
              Bill Summary
            </Text>

            {billDetails?.map((item, i) => {
              return (
                <>
                  {item?.isShow == true ? (
                    <View style={styles.billDetailRenderView}>
                      <TextRender
                        titleStyle={[
                          styles.titleText,
                          {
                            color:
                              item?.coupanCode?.length > 0
                                ? colors.main
                                : item?.name == 'Total'
                                ? colors.black
                                : colors.color64,
                          },
                        ]}
                        valueStyle={[
                          styles.valueText,
                          {
                            color:
                              item?.coupanCode?.length > 0
                                ? colors.main
                                : item?.name == 'Total'
                                ? colors.black
                                : colors.color64,
                          },
                        ]}
                        title={
                          item?.coupanCode?.length > 0
                            ? item?.name + '- (' + item?.coupanCode + ')'
                            : item?.name
                        }
                        value={currencyFormat(Number(item?.price))}
                        bottomLine={false}
                      />
                      {item?.bottomLine && <DotedLine />}
                    </View>
                  ) : null}
                </>
              );
            })}
          </View>
        </TouchableOpacity>
      </AppInputScroll>
      <View
        style={{
          justifyContent: 'center',
          bottom: hp(7),
          backgroundColor: colors.white,
          marginHorizontal: -20,
          height: hp(8),
        }}>
        <BTN
          width={screenWidth(90)}
          title={setProgressBtn(item?.order_type)}
          onPress={() => {
            // handleOrder();
          }}
          bottomCheck={1}
          textTransform={'capitalize'}
        />
      </View>
    </View>
  );
};

export default CardOrderDetails;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.appBackground,
    marginTop: '3%',
    marginHorizontal: 20,
  },
  imageDateView: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  imageView: {
    width: 75,
    height: 75,
    borderRadius: 10,
    borderWidth:0.3,
    borderColor:colors.main
  },
  image: {
    width: 75,
    height: 75,
    borderRadius: 10,
  },
  trackTextView: {flex: 1, flexDirection: 'column', marginLeft: '2.5%'},
  trackIdText: {
    fontSize: RFValue(15),
    fontFamily: fonts.medium,
    color: colors.black,
  },
  dateText: {
    fontSize: RFValue(13),
    fontFamily: fonts.medium,
    color: '#838282',
    marginTop: '3%',
  },
  statusView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '3%',
  },
  statusText: {
    fontSize: RFValue(13),
    fontFamily: fonts.medium,
  },
  statusImageView: {
    flex: 1,
    marginLeft: '4%',
  },
  amountText: {
    fontSize: RFValue(13),
    fontFamily: fonts.medium,
    color: colors.black,
  },
  billingSummary: {
    fontFamily: fonts.bold,
    fontSize: RFValue(15),
    color: colors.black,
  },
  scrollInnerView: {
    marginTop: '6%',
    justifyContent: 'center',
  },
  billDetailRenderView: {
    paddingHorizontal: 10,
    justifyContent: 'center',
  },
  titleText: {
    fontFamily: fonts.medium,
    fontSize: RFValue(13),
    color: colors.color64,
  },
  valueText: {
    fontFamily: fonts.medium,
    fontSize: RFValue(14),
    color: colors.color64,
  },
});
