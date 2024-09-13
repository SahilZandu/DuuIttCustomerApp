import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  Pressable,
} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {appImages, appImagesSvg} from '../commons/AppImages';
import {colors} from '../theme/colors';
import {fonts} from '../theme/fonts/fonts';

const DriverArrivingComp = ({topLine, title, onMessage, onCall}) => {
  return (
    <View>
      {topLine && <View style={styles.topLineView} />}
      <View style={styles.textImageView}>
        <Text style={styles.DriverArriveText}>Driver Arriving</Text>
        <TouchableOpacity onPress={onMessage} activeOpacity={0.8}>
          <Image
            resizeMode="contain"
            style={styles.image}
            source={appImages.messageImage}
          />
        </TouchableOpacity>
        <Text>{'    '}</Text>
        <TouchableOpacity onPress={onCall} activeOpacity={0.8}>
          <Image
            resizeMode="contain"
            style={styles.image}
            source={appImages.callImage}
          />
        </TouchableOpacity>
      </View>
      <Text style={styles.titleText}>{title}</Text>
    </View>
  );
};

export default DriverArrivingComp;

const styles = StyleSheet.create({
  topLineView: {
    height: 4,
    backgroundColor: colors.colorD9,
    width: wp('12%'),
    borderRadius: 10,
    alignSelf: 'center',
  },
  textImageView: {
    flexDirection: 'row',
    marginTop: '3%',
  },
  DriverArriveText: {
    flex: 1,
    fontSize: RFValue(18),
    fontFamily: fonts.bold,
    color: colors.black,
  },
  image: {
    height: 35,
    width: 35,
  },
  titleText: {
    fontSize: RFValue(12),
    fontFamily: fonts.medium,
    color: colors.colorAA,
    marginTop: '-2%',
  },
});
