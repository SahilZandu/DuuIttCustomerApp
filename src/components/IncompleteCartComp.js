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

const IncompleteCartComp = ({navigation, trackedArray,onPressComplete}) => {
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
    <View style={styles.main(trackedArray)}>
      <Surface elevation={2} style={styles.viewDetailsSurfaceView}>
        <View style={styles.innerView}>
          {/* <Image
              resizeMode="contain"
              style={styles.image}
              source={setOrderImage('parcel')}
            /> */}
          <View style={styles.IncompleteView}>
            <Text numberOfLines={1} style={styles.incompleteText}>
              Complete your order....
            </Text>
            <Text numberOfLines={2} style={styles.proceedText}>
              Proceed the process and find your driver
            </Text>
          </View>
          <View style={styles.completeDeleteView}>
            <TouchableOpacity
             onPress={onPressComplete}
              activeOpacity={0.8}
              style={styles.completeBtnView}>
              <Text style={styles.completeBtnText}>Complete your order</Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.deleteImageView}>
              <SvgXml width={35} height={35} xml={appImagesSvg.deleteIconSvg} />
            </TouchableOpacity>
          </View>
        </View>
      </Surface>
    </View>
  );
};

export default IncompleteCartComp;

const styles = StyleSheet.create({
  main: trackedArray => ({
    position: 'absolute',
    alignSelf: 'center',
    bottom: trackedArray?.length > 0 ? '14%' : '1%',
  }),
  viewDetailsSurfaceView: {
    shadowColor: colors.black50, // You can customize shadow color
    backgroundColor: colors.white,
    borderRadius: 10,
    height: hp('8%'),
    width: wp('90%'),
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
  IncompleteView: {
    flex: 1,
    marginLeft: '3%',
    justifyContent: 'center',
  },
  incompleteText: {
    fontSize: RFValue(12),
    fontFamily: fonts.medium,
    color: colors.black,
    width: wp('41%'),
  },
  proceedText: {
    fontSize: RFValue(10),
    fontFamily: fonts.medium,
    color: colors.black65,
    width: wp('41%'),
    marginTop: '2%',
  },
  completeDeleteView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
  },
  completeBtnView: {
    alignSelf: 'center',
    justifyContent: 'center',
    backgroundColor: colors.colorD45,
    height: hp('5.8%'),
    width: wp('24%'),
    borderRadius: 10,
    borderColor: colors.main,
    borderWidth: 0.5,
  },
  completeBtnText: {
    fontSize: RFValue(12),
    fontFamily: fonts.medium,
    color: colors.main,
    textAlign: 'center',
  },
  deleteImageView: {
    marginLeft: '7%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
