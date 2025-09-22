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
import { screenWidth } from '../halpers/matrics';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { rootStore } from '../stores/rootStore';

const CardOrder = ({ item, index, handleDetails, navigation }) => {
  console.log('item --CardOrder ', item);
  let today = new Date();
  const { addReOrderRequestParcelRide } = rootStore.parcelStore;
  const { foodReorder } = rootStore.foodDashboardStore;
  const [selectedId, setSelectedId] = useState('')


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
        return appImages.foodOrderImage;
      case 'parcel':
        return appImages.parcelOrderImage;
      case 'ride':
        return appImages.rideOrderImage;
      default:
        return appImages.foodOrderImage;
    }
  };

  const setStatusData = status => {
    switch (status) {
      case 'cancelled':
        return 'Cancelled';
      case 'completed':
        return 'Completed';
      default:
        return 'Completed';
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


  const handleReOrder = async (item) => {
    console.log('item--handleReOrder', item);
    const newdata = {
      weight: item?.weight,
      quantity: item?.quantity ?? 1,
      type: 'Others',
      sender_address: item?.sender_address,
      receiver_address: item?.receiver_address,
      // billing_detail: {delivery_fee: 9, discount: 0, platform_fee: 10, gst: 18},
      billing_detail: item?.billing_detail,
      isSecure: item?.secure ?? false,
      order_type: item?.order_type,
    };
    console.log('newdata--', newdata);

    await addReOrderRequestParcelRide(newdata, navigation, handleLoading);
    setSelectedId('')
    // navigation.navigate('priceConfirmed',{item:newdata});
  };

  const handleFoodReOrder = async (item) => {

    const resFoodReorder = await foodReorder(item, navigation, handleLoading);
    setSelectedId('')
    console.log('item--handleFoodReOrder', resFoodReorder, item);

  }

  handleLoading = v => {
    if (v == false) {
      setSelectedId('')
    }

  }

  return (
    <Surface elevation={2} style={styles.container}>
      {item?.order_type == 'food' ?
        <TouchableOpacity
          key={index}
          activeOpacity={0.8}
          style={styles.innerViewFood}>
          <View style={[styles.imageDateView, { paddingHorizontal: '5%' }]}>
            <View style={styles.imageView}>
              <Image
                resizeMode="cover"
                style={styles.image}
                source=
                // setImageIcon(item?.order_type)
                {(item?.restaurant?.banner?.length > 0 || item?.restaurant?.logo?.length > 0)
                  ? {uri:item?.restaurant?.banner ?? item?.restaurant?.logo}
                  : setImageIcon(item?.order_type)
                }
              />
            </View>
            <View style={styles.nameDateView}>
              <Text numberOfLines={1} style={styles.nameText}>
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
                      color: item?.status == 'cancelled' ? colors.colorE7 : colors.green,
                    },
                  ]}>
                  {setStatusData(item?.status)}
                </Text>
                <View style={{ flex: 1, marginLeft: '2%' }}>
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

          <View style={{ marginHorizontal: 15 }}>
            <Text
              numberOfLines={1}
              style={[styles.riderNameText, { color: colors.black, textTransform: 'capitalize' }]}>
              {' '}
              {item?.restaurant?.name}{' '}
            </Text>
          </View>

          <View style={styles.orderItemViewFood}>

            <View>
              {item?.cartItems?.slice(0, 3)?.map((value, i) => {
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
                        {value?.varient_name}
                      </Text>

                      <Text style={{
                        fontSize: RFValue(13),
                        fontFamily: fonts.regular,
                        color: colors.black,
                        right: '10%'
                      }}> {currencyFormat(value?.varient_price)}</Text>
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

            <View style={styles.bottomBtn}>
              <BTN
                backgroundColor={colors.white}
                labelColor={colors.main}
                width={screenWidth(38)}
                title={setDetailsBtn(item?.order_type)}
                onPress={() => {
                  handleDetails(item);
                }}
                bottomCheck={15}
                textTransform={'capitalize'}
              />

              <BTN
                loading={selectedId == item?._id}
                width={screenWidth(38)}
                title={setProgressBtn(item?.order_type)}
                onPress={() => {
                  if (item?.order_type == 'food') {
                    setSelectedId(item?._id),
                      handleFoodReOrder(item)
                  } else {
                    setSelectedId(item?._id),
                      handleReOrder(item)
                  }
                }}
                bottomCheck={15}
                textTransform={'capitalize'}
              />

            </View>
          </View>
        </TouchableOpacity>
        :
        <TouchableOpacity
          key={index}
          activeOpacity={0.8}
          style={styles.innerView}>
          <View style={styles.imageDateView}>
            <View style={styles.imageView}>
              <Image
                resizeMode="cover"
                style={styles.image}
                source={
                  setImageIcon(item?.order_type)
                  // item?.rider?.profile_pic?.length > 0
                  //   ? {uri:item?.rider?.profile_pic}
                  //   : setImageIcon(item?.order_type)
                }
              />
            </View>
            <View style={styles.nameDateView}>
              <Text numberOfLines={1} style={styles.nameText}>
                {item?.name ? item?.name : `ID:${item?.order_id ?? "1234567890"}`}
              </Text>
              <Text style={styles.dateText}>
                {dateTimeFormat(item?.createdAt ?? today)}
              </Text>
              <View style={styles.statusView}>
                <Text
                  style={[
                    styles.statusText,
                    {
                      color: item?.status == 'cancelled' ? '#E70000' : '#28B056',
                    },
                  ]}>
                  {setStatusData(item?.status)}
                </Text>
                <View style={{ flex: 1, marginLeft: '2%' }}>
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

          <View style={styles.orderItemView}>
            <View style={{ flexDirection: 'row' }}>
              <Text style={styles.riderNameText}>{'Distance'}:</Text>
              <Text
                numberOfLines={1}
                style={[styles.riderNameText, { color: colors.black }]}>
                {' '}
                {item?.distance?.toFixed(2) ?? 0}{' '}
              </Text>
            </View>

            <PickDropComp
              item={{
                id: 1,
                pickup_drop: 'Pickup point',
                pickup: item?.sender_address?.address,
                drop: item?.receiver_address?.address,
              }}
              upperCircleColor={
                item?.status == 'cancelled' ? colors.red : colors.main
              }
              lineColor={item?.status == 'cancelled' ? colors.red : colors.main}
              bottomCircleColor={
                item?.status == 'cancelled' ? colors.red : colors.main
              }
              lineHeight={70}
            />

            <View style={styles.bottomBtn}>
              <BTN
                backgroundColor={colors.white}
                labelColor={colors.main}
                width={screenWidth(80)}
                title={setDetailsBtn(item?.order_type)}
                onPress={() => {
                  handleDetails(item);
                }}
                bottomCheck={15}
                textTransform={'capitalize'}
              />
            </View>
          </View>
        </TouchableOpacity>}
    </Surface>
  );
};

export default CardOrder;

const styles = StyleSheet.create({
  container: {
    shadowColor: colors.black, // You can customize shadow color
    backgroundColor: colors.white,
    alignSelf: 'center',
    borderRadius: 10,
    width: screenWidth(90),
    marginTop: '5%',
  },
  innerViewFood: {
    justifyContent: 'center',
    borderRadius: 10,
  },
  innerView: {
    alignSelf: 'center',
    borderRadius: 10,
  },
  imageDateView: {
    paddingHorizontal: '3%',
    // marginTop: '5%',
    paddingVertical: hp('2%'),
    flexDirection: 'row',
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
  nameDateView: {
    flex: 1,
    flexDirection: 'column',
    marginLeft: '2.5%',
  },
  nameText: {
    fontSize: RFValue(13),
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
  orderItemView: {
    marginHorizontal: 10,
    marginTop: '0%',
  },
  orderItemViewFood: {
    marginHorizontal: 20,
    marginTop: '0%',
  },
  bottomBtn: {
    flexDirection: 'row',
    marginTop: hp('4.5%'),
    justifyContent: 'space-between',
    marginBottom: hp('0.2%'),
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
