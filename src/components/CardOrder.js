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
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

const CardOrder = ({item, index, handleDetails}) => {
  // console.log('item -- ', item);
  let firstCapStatus =
    item?.status.charAt(0).toUpperCase() + item?.status.slice(1).toLowerCase();
  //  console.log(' item?.status -- ',  item?.status);
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
    <Surface elevation={2} style={styles.container}>
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
              item?.rider?.profile_pic?.length > 0
                ? {uri: Url.Image_Url + item?.rider?.profile_pic}
                : setImageIcon(item?.order_type)
            }
          />
          </View>
          <View style={styles.nameDateView}>
            <Text numberOfLines={1} style={styles.nameText}>
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
              <View style={{flex: 1, marginLeft: '4%'}}>
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

        <View style={styles.orderItemView}>
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

const styles = StyleSheet.create({
  container: {
    shadowColor: colors.black, // You can customize shadow color
    backgroundColor: colors.white,
    alignSelf: 'center',
    borderRadius: 10,
    width: screenWidth(90),
    marginTop: '5%',
  },
  innerView: {
    alignSelf: 'center',
    borderRadius: 10,
  },
  imageDateView: {
    paddingHorizontal: '3%',
    // marginTop: '5%',
    paddingVertical: '5%',
    flexDirection: 'row',
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
  nameDateView: {
    flex: 1,
    flexDirection: 'column',
    marginLeft: '2.5%',
  },
  nameText: {
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
  amountText: {
    fontSize: RFValue(13),
    fontFamily: fonts.medium,
    color: colors.black,
  },
  orderItemView: {
    marginHorizontal: 10,
    marginTop: '3%',
  },
  bottomBtn: {
    flexDirection: 'row',
    marginTop:hp(4.5),
    justifyContent: 'space-between',
  },
});
