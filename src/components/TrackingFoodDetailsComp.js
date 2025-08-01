import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
import { Surface } from 'react-native-paper';
import { RFValue } from 'react-native-responsive-fontsize';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { SvgXml } from 'react-native-svg';
import { appImages, appImagesSvg } from '../commons/AppImages';
import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts/fonts';
import moment from 'moment';
import Url from '../api/Url';

const TrackingFoodDetailsComp = ({ onViewDetails, item, xml, index }) => {
  const setTrackImage = status => {
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

console.log("item---TrackingFoodDetailsComp",item);


  const dateFormate = (date) => {
    const formattedDate = moment(date).format('MMM D, YYYY - hh:mm A');
    // console.log(formattedDate);
    return formattedDate;
  };

  const onViewDetail = (status, index) => {
    onViewDetails(status, index);
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => {
        onViewDetail(item?.status, index);
      }}>
      <Surface elevation={3} style={styles.viewDetailsSurfaceView}>
        <View style={styles.innerView}>
          <View style={styles.imageTrackView}>
            <Image
              resizeMode='cover'
              style={styles.image}
              source=
              // {setTrackImage(item?.order_type)
                {(item?.restaurant?.banner?.length > 0 || item?.restaurant?.logo?.length > 0)
                  ? {uri: Url?.Image_Url + (item?.restaurant?.banner || item?.restaurant?.logo)}
                  : setTrackImage(item?.order_type)
              }
            />
            <View style={styles.trackIdView}>
              <Text numberOfLines={1} style={styles.trackName}>
                {item?.restaurant?.name}
              </Text>
              <Text numberOfLines={1} style={styles.orderText}>
                #:{item?.order_id}
              </Text>
              <Text numberOfLines={1} style={styles.dateText}>
                {dateFormate(item?.updatedAt)}
              </Text>
            </View>
          </View>
          <View style={styles.viewDetailsView}>
            <Text style={styles.viewDetailsText}>Details</Text>
            <SvgXml xml={xml} />
          </View>
        </View>
      </Surface>
    </TouchableOpacity>
  );
};

export default TrackingFoodDetailsComp;

const styles = StyleSheet.create({
  viewDetailsSurfaceView: {
    shadowColor: colors.black50, // You can customize shadow color
    backgroundColor: colors.white,
    borderRadius: 10,
    height: hp('10%'),
    marginTop: '4%',
    justifyContent: 'center',
  },
  innerView: {
    marginHorizontal: 15,
    flexDirection: 'row',
  },
  imageTrackView: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    height: 55,
    width: 55,
    borderRadius: 100,
  },
  trackIdView: {
    flexDirection: 'column',
    marginLeft: '3%',
    marginRight: '1%',
  },
  trackName: {
    fontSize: RFValue(12),
    fontFamily: fonts.semiBold,
    color: colors.black,
    width: wp('45%'),
  },
  orderText: {
    fontSize: RFValue(12),
    fontFamily: fonts.medium,
    color: colors.black,
    marginTop: '2%',
    width: wp('45%'),
  },
  dateText: {
    fontSize: RFValue(10),
    fontFamily: fonts.medium,
    color: colors.color72,
    marginTop: '2%',
    width: wp('45%'),
  },
  viewDetailsView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    height: hp('4%'),
    paddingHorizontal: '2%',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.main,
  },
  viewDetailsText: {
    fontSize: RFValue(11),
    fontFamily: fonts.semiBold,
    color: colors.main,
  },
});
