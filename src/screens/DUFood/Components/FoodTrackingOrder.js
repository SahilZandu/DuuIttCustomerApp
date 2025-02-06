import React from 'react';
import {StyleSheet, View, Text, Image, TouchableOpacity} from 'react-native';
import {Surface} from 'react-native-paper';
import {RFValue} from 'react-native-responsive-fontsize';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { appImages } from '../../../commons/AppImages';
import { colors } from '../../../theme/colors';
import { fonts } from '../../../theme/fonts/fonts';


const FoodTrackingOrder = ({navigation, trackedArray,bottom}) => {
  const setOrderImage = status => {
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
    <View style={styles.main(bottom)}>
      <Surface elevation={3} style={styles.upperSurfaceView}></Surface>

      <TouchableOpacity
        onPress={() => {
          // navigation.navigate('trackingOrder');
        }}
        activeOpacity={0.8}>
        <Surface elevation={2} style={styles.viewDetailsSurfaceView}>
          <View style={styles.innerView}>
            <Image
              resizeMode="contain"
              style={styles.image}
              source={setOrderImage(trackedArray[0]?.order_type)}
            />
            <View style={styles.riderIdView}>
              <Text numberOfLines={1} style={styles.riderText}>
                Rider is on the way
              </Text>
              <Text numberOfLines={1} style={styles.trackId}>
                Tracking ID:{trackedArray[0]?.tracking_id}
              </Text>
            </View>
            <View style={styles.tarckOrderView}>
              <Text style={styles.trackOrderText}>Track Order</Text>
            </View>
          </View>
        </Surface>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          // navigation.navigate('trackingOrder');
        }}
        activeOpacity={0.8}
        style={styles.moreView}>
        <Surface elevation={2} style={styles.moreSurface}>
          <Text style={styles.moreText}> +{trackedArray?.length} more</Text>
        </Surface>
      </TouchableOpacity>
    </View>
  );
};

export default FoodTrackingOrder;

const styles = StyleSheet.create({
  main:(bottom)=>({
    position: 'absolute',
    alignSelf: 'center',
    bottom:bottom ? bottom :hp('8%'),
  }),
  upperSurfaceView: {
    width: wp('88%'),
    height: hp('3%'),
    shadowColor: Platform.OS == 'ios' ? colors.black50 : colors.black,
    backgroundColor: colors.white,
    alignSelf: 'center',
    borderRadius: 10,
    top: '12%',
  },
  viewDetailsSurfaceView: {
    shadowColor: Platform.OS == 'ios' ? colors.black50 : colors.black,
    backgroundColor: colors.white,
    borderRadius: 10,
    height: hp('8%'),
    width: wp('94%'),
    justifyContent: 'center',
  },
  innerView: {
    marginHorizontal: 10,
    flexDirection: 'row',
  },
  image: {
    width: 47,
    height: 47,
    borderRadius: 100,
  },
  riderIdView: {
    flex: 1,
    marginLeft: '4%',
    justifyContent: 'center',
  },
  riderText: {
    fontSize: RFValue(11),
    fontFamily: fonts.medium,
    color: colors.black,
    width: wp('45%'),
  },
  trackId: {
    fontSize: RFValue(10),
    fontFamily: fonts.semiBold,
    color: colors.color5A,
    width: wp('45%'),
    marginTop: '4%',
  },
  tarckOrderView: {
    alignSelf: 'center',
    justifyContent: 'center',
    backgroundColor: colors.main,
    height: hp('4%'),
    paddingHorizontal: '3%',
    borderRadius: 50,
  },
  trackOrderText: {
    fontSize: RFValue(11),
    fontFamily: fonts.medium,
    color: colors.white,
    textAlign: 'center',
  },
  moreView: {
    position: 'absolute',
    top: '13%',
    alignSelf: 'center',
  },
  moreSurface: {
    shadowColor: Platform.OS == 'ios' ? colors.black50 : colors.black85,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    height: hp('3.5%'),
    padding: '3%',
    borderRadius: 50,
  },
  moreText: {
    fontSize: RFValue(13),
    fontFamily: fonts.medium,
    color: colors.main,
  },
});
