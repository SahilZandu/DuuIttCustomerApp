import React, { useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
  View,
  Text,
  Platform,
} from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { SvgXml } from 'react-native-svg';
import { appImages, appImagesSvg } from '../commons/AppImages';
import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts/fonts';
import CTA from './cta/CTA';
import { currencyFormat } from '../halpers/currencyFormat';
import { Surface } from 'react-native-paper';
import BTN from './cta/BTN';
import PickDropComp from './PickDropComp';
import moment from 'moment';
import Url from '../api/Url';
import { screenWidth } from '../halpers/matrics';
import AppInputScroll from '../halpers/AppInputScroll';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import TextRender from './TextRender';
import DotedLine from '../screens/DUFood/Components/DotedLine';
import OrdersInstrucationsComp from './OrderInstructionsComp';

const CardOrderDetails = ({ item }) => {
  console.log('item -- CardOrderDetails', item);
  let today = new Date();
  const setStatusData = status => {
    switch (status) {
      case 'cancelled':
        return 'Cancelled';
      case 'completed':
        return 'Completed';
      default:
        return 'Processing';
    }
  };

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

  let disFare = item?.total_amount - (item?.billing_detail?.delivery_fee + item?.billing_detail?.platform_fee + item?.billing_detail?.gst_fee);

  const billDetails = [
    {
      id: '0',
      name: 'Item Fee',
      price: item?.billing_detail?.item_sub_total_amount ? item?.billing_detail?.item_sub_total_amount : disFare ?? 0,
      coupanCode: '',
      bottomLine: false,
      gstIcon: false,
      isShow: item?.order_type == 'food' ? true : false,
    },
    {
      id: '1',
      name: 'Distance Fee',
      price: disFare ? disFare : item?.billing_detail?.distance_fee ?? 0,
      coupanCode: '',
      bottomLine: false,
      isShow: item?.order_type !== 'food' ? true : false,
      gstIcon: false,
    },
    {
      id: '2',
      name: item?.order_type == 'food' ? 'Delivery Fee' : 'Management Fare',
      price: item?.billing_detail?.delivery_fee ?? 0,
      coupanCode: '',
      bottomLine: false,
      isShow: true,
      gstIcon: false,
    },
    {
      id: '3',
      name: 'Packing fee',
      price: item?.billing_detail?.packing_fee ?? item?.packing_fee ?? 0,
      coupanCode: '',
      bottomLine: true,
      isShow: item?.order_type == 'food' ? true : false,
      gstIcon: false,
    },
    // {
    //   id: '4',
    //   name: 'Platform Charges',
    //   price: item?.billing_detail?.platform_fee ?? 0,
    //   coupanCode: '',
    //   bottomLine: false,
    //   isShow: true,
    //   gstIcon: false,
    // },
    // {
    //   id: '5',
    //   name: item?.order_type == 'food' ? 'GST and Restaurant Charges' : 'GST',
    //   price: item?.billing_detail?.gst_fee + item?.billing_detail?.restaurant_charge_amount ?? 0,
    //   coupanCode: '',
    //   bottomLine: true,
    //   // isShow: item?.order_type == 'food' ? true : false,
    //   isShow: true,
    //   gstIcon: true,
    // },
    {
      id: '6',
      name: setTitleText(item?.order_type),
      price: item?.total_amount,
      coupanCode: '',
      bottomLine: true,
      isShow: item?.order_type !== 'food' ? true : false,
      gstIcon: false,
    },

    {
      id: '7',
      name: 'Grand Total',
      price: item?.billing_detail?.total_amount - item?.billing_detail?.discount ?? 0,
      coupanCode: '',
      bottomLine: false,
      isShow: item?.order_type == 'food' ? true : false,
      gstIcon: false,
    },
    {
      id: '8',
      name: 'Restaurant Coupon',
      price: item?.billing_detail?.discount ?? 0,
      coupanCode: item?.billing_detail?.coupon_code ?? '',
      bottomLine: false,
      isShow: item?.order_type == 'food' ? true : false,
      gstIcon: false,
    },
    {
      id: '9',
      name: 'Total Paid',
      price: item?.status == 'cancelled' ? 0 : item?.total_amount,
      coupanCode: '',
      bottomLine: false,
      isShow: true,
      gstIcon: false,
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
        return appImages.foodOrderImage;
      case 'parcel':
        return appImages.parcelOrderImage;
      case 'ride':
        return appImages.rideOrderImage;
      default:
        return appImages.foodOrderImage;
    }
  };

  const setTypeImage = status => {
    switch (status) {
      case 'veg':
        return appImagesSvg.vegSvg;
      case 'non-veg':
        return appImagesSvg.nonVeg;
      case 'egg':
        return appImagesSvg.eggSvg;
      default:
        return appImagesSvg.vegSvg;
    }
  };


  return (
    <View style={styles.container}>
      <AppInputScroll padding={true} Pb={hp('25%')}>
        <TouchableOpacity style={{ flex: 1 }} activeOpacity={0.8}>
          <View style={styles.imageDateView}>
            <View style={styles.imageView}>
              <Image
                resizeMode="cover"
                style={styles.image}
                source=
                // setImageIcon(item?.order_type)
                {(item?.restaurant?.banner?.length > 0 || item?.restaurant?.logo?.length > 0)
                  ? { uri: Url?.Image_Url + (item?.restaurant?.banner || item?.restaurant?.logo) }
                  : setImageIcon(item?.order_type)
                }
              />
            </View>
            <View style={styles.trackTextView}>
              <Text numberOfLines={1} style={styles.trackIdText}>
                {`ID:${item?.order_id ?? item?._id}`}
              </Text>
              <Text style={styles.dateText}>
                {dateTimeFormat(item?.createdAt ?? today)}
              </Text>
              <View style={styles.statusView}>
                <Text
                  style={[
                    styles.statusText,
                    {
                      color:
                        item?.status == 'cancelled' ? '#E70000' : '#28B056',
                    },
                  ]}>
                  {setStatusData(item?.status)}
                </Text>
                <View style={styles.statusImageView}>
                  <SvgXml
                    xml={
                      item?.status == 'cancelled'
                        ? appImagesSvg.crossRedSvg
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
          <View style={{ marginTop: '3%' }}>
            <View style={{ flexDirection: 'row' }}>
              <Text style={styles.riderNameText}>{'Distance'}:</Text>
              <Text
                numberOfLines={1}
                style={[styles.riderNameText, { color: colors.black }]}>
                {' '}
                {item?.distance?.toFixed(2) ?? item?.restaurantToCustomerKm?.toFixed(2) ?? 0}{' '}
              </Text>

            </View>
            {item?.order_type == 'food' &&
              <>
                <Text
                  numberOfLines={1}
                  style={[styles.riderNameText,
                  {
                    color: colors.black,
                    textTransform: 'capitalize',
                    marginTop: '2%'
                  }]}>
                  {' '}
                  {item?.restaurant?.name}{' '}
                </Text>
              </>}

            {item?.order_type !== 'food' ? (
              <PickDropComp
                item={{
                  id: 1,
                  pickup_drop: 'Pickup location',
                  pickup: item?.sender_address?.address,
                  drop: item?.receiver_address?.address,
                }}
                lineHeight={70}
                upperCircleColor={
                  item?.status == 'cancelled' ? colors.red : colors.main
                }
                lineColor={
                  item?.status == 'cancelled' ? colors.red : colors.main
                }
                bottomCircleColor={
                  item?.status == 'cancelled' ? colors.red : colors.main
                }
              />
            ) : (
              <View>
                {item?.cartItems?.map((value, i) => {
                  return (
                    <>
                      <View key={i} style={{ flexDirection: 'row', marginTop: '4%' }}>
                        <SvgXml
                          xml={setTypeImage(value?.veg_nonveg)}
                        />
                        <Text
                          numberOfLines={1}
                          style={{

                            fontSize: RFValue(13),
                            fontFamily: fonts.regular,
                            color: colors.black,
                            marginLeft: '2%',

                          }}> {value?.quantity} X </Text>
                        <Text
                          numberOfLines={1}
                          style={{
                            flex: 1,
                            fontSize: RFValue(13),
                            fontFamily: fonts.regular,

                          }}>
                          {value?.varient_name ? value?.varient_name : value?.food_item_name}
                        </Text>

                        <Text style={{
                          fontSize: RFValue(13),
                          fontFamily: fonts.regular,
                          color: colors.black,
                          right: '10%'
                        }}> {currencyFormat(value?.varient_price ? value?.varient_price : value?.food_item_price)}</Text>
                      </View>
                      {value?.selected_add_on?.length > 0 && (
                        <View style={styles.addonsView}>
                          <Text numberOfLines={2} style={styles.addonsName}>
                            {value?.selected_add_on?.map(item => item?.addon_name).join(', ')}
                          </Text>
                          <Text style={styles.addonsPrice}>
                            {currencyFormat(
                              value?.selected_add_on?.reduce((acc, item) => acc + Number(item?.addon_price || 0), 0)
                            )}
                          </Text>
                        </View>
                      )}
                    </>
                  );
                })}
              </View>
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
                        gstShow={item?.gstIcon}
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
          <OrdersInstrucationsComp item={item} />
        </TouchableOpacity>
      </AppInputScroll>
      {/* <View
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
      </View> */}
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
    borderWidth: 0.3,
    borderColor: colors.main,
  },
  image: {
    width: 75,
    height: 75,
    borderRadius: 10,
  },
  trackTextView: { flex: 1, flexDirection: 'column', marginLeft: '2.5%' },
  trackIdText: {
    fontSize: RFValue(13),
    fontFamily: fonts.medium,
    color: colors.black,
  },
  dateText: {
    fontSize: RFValue(13),
    fontFamily: fonts.medium,
    color: colors.color83,
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
    marginLeft: '2%',
  },
  amountText: {
    fontSize: RFValue(13),
    fontFamily: fonts.medium,
    color: colors.black,
  },
  riderNameText: {
    fontSize: RFValue(13),
    fontFamily: fonts.medium,
    color: colors.main,
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
  addonsView: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: '1%'
  },
  addonsName: {
    flex: 1,
    flexWrap: 'wrap',
    fontFamily: fonts.medium,
    fontSize: RFValue(11),
    color: colors.black85
  },
  addonsPrice: {
    marginLeft: 10,
    fontFamily: fonts.medium,
    fontSize: RFValue(11),
    color: colors.black
  }


});
