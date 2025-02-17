import React from 'react';
import {StyleSheet, View, Text, Image, TouchableOpacity} from 'react-native';
import {Surface} from 'react-native-paper';
import {RFValue} from 'react-native-responsive-fontsize';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {SvgXml} from 'react-native-svg';
import {appImages, appImagesSvg} from '../commons/AppImages';
import {colors} from '../theme/colors';
import {fonts} from '../theme/fonts/fonts';
import moment from 'moment';

const TrackingFoodDetailsComp = ({onViewDetails, item, xml, index}) => {
  const setTrackImage = status => {
    switch (status) {
      case 'food':
        return appImages.order1;
      case 'parcel':
        return appImages.order2;
      case 'ride':
        return appImages.order3;
    }
  };
  const dateFormate = () => {
              const formattedDate = moment().format('MMM D, YYYY - hh:mm A');
              // console.log(formattedDate);
              return formattedDate
          }

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
              resizeMode="contain"
              style={styles.image}
              source={setTrackImage(item?.order_type)}
            />
            <View style={styles.trackIdView}>
              <Text numberOfLines={1} style={styles.trackName}>
              {item?.name}
              </Text>
              <Text numberOfLines={1} style={styles.dateText}>
                {dateFormate(item?.date)}
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
    marginTop: '6%',
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
  dateText: {
    fontSize: RFValue(10),
    fontFamily: fonts.medium,
    color: colors.color72,
    marginTop: '4%',
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
