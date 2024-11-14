import React from 'react';
import {StyleSheet, View, Text, TouchableOpacity, Image, Platform} from 'react-native';
import {Surface} from 'react-native-paper';
import {RFValue} from 'react-native-responsive-fontsize';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {appImages} from '../commons/AppImages';
import { screenHeight } from '../halpers/matrics';
import {colors} from '../theme/colors';
import {fonts} from '../theme/fonts/fonts';

const MeetingPickupComp = ({firstText, secondText, onPressDot}) => {
  return (
    <Surface elevation={3} style={styles.rateSurfaceView}>
      <View style={styles.innerSurfaceView}>
        <View style={styles.textView}>
          <Text numberOfLines={1} style={styles.meetText}>
            {firstText}
          </Text>
          <Text numberOfLines={1} style={styles.rideText}>
            {secondText}
          </Text>
        </View>
        <TouchableOpacity onPress={onPressDot} activeOpacity={0.8}>
          <Image
            resizeMode="cover"
            style={styles.image}
            source={appImages.detailsIcon}
          />
        </TouchableOpacity>
      </View>
    </Surface>
  );
};

export default MeetingPickupComp;

const styles = StyleSheet.create({
  rateSurfaceView: {
    shadowColor:Platform.OS == 'ios'? colors.black50:colors.black, // You can customize shadow color
    backgroundColor: colors.white,
    borderRadius: 10,
    height: screenHeight(8),
    marginTop: '5%',
    justifyContent: 'center',
  },
  innerSurfaceView: {
    flexDirection: 'row',
    marginHorizontal: 20,
    alignItems: 'center',
  },
  textView: {
    flex: 1,
    flexDirection: 'column',
  },
  meetText: {
    fontSize: RFValue(16),
    fontFamily: fonts.bold,
    color: colors.black,
  },
  rideText: {
    fontSize: RFValue(12),
    fontFamily: fonts.medium,
    color: colors.colorAA,
    marginTop: '2%',
  },
  image: {
    width: 45,
    height: 45,
    alignSelf: 'center',
  },
});
