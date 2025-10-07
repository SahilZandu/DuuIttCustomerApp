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

const DriverArrivingComp = ({topLine, title, onMessage, onCall,unReadMsg,bottomLine,lineStyle}) => {
  return (
    <View>
      {topLine && <View style={styles.topLineView} />}
      <View style={styles.textImageView}>
        <Text style={styles.DriverArriveText}>Driver Arriving</Text>
        <View style={{marginTop: '2%', flexDirection: 'row'}}>
          <TouchableOpacity onPress={onMessage} activeOpacity={0.8}>
            <Image
              resizeMode="contain"
              style={styles.image}
              source={unReadMsg ? appImages.messageUnreadImg : appImages.messageImage}
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
      </View>
      <Text style={styles.titleText}>{title}</Text>
        {bottomLine && <View style={[styles.bottomLine, lineStyle]} />}
    </View>
  );
};

export default DriverArrivingComp;

const styles = StyleSheet.create({
  topLineView: {
    height: 4.5,
    backgroundColor: colors.colorD9,
    width: wp('12%'),
    borderRadius: 10,
    alignSelf: 'center',
  },
  textImageView: {
    flexDirection: 'row',
    justifyContent:'center'
    // marginTop: '1%',
  },
  DriverArriveText: {
    flex: 1,
    fontSize: RFValue(17),
    fontFamily: fonts.bold,
    color: colors.black,
  },
  image: {
    height: 35,
    width: 35,
  },
  titleText: {
    fontSize: RFValue(11.5),
    fontFamily: fonts.medium,
    color: colors.colorAA,
    marginTop: '-4%',
  },
   bottomLine: {
    height: 1,
    backgroundColor: colors.colorD9,
    marginTop: '6%',
    marginHorizontal: -20,
  },
});
