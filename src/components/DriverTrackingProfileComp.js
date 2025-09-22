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
import Rating from './Rating';
import Url from '../api/Url';

const DriverTrackingProfileComp = ({topLine, item, onMessage, onCall,unReadMsg}) => {
  // console.log('Driver--', item);

  return (
    <View>
      {topLine && <View style={styles.topLineView} />}
      <View style={styles.main}>
        <Image
          resizeMode="cover"
          style={styles.userImage}
          source={
            item?.image?.toString()?.includes('profile')
              ? {uri:item?.image}
              : item.image
          }
        />
        <View style={styles.textRatingView}>
          <Text numberOfLines={1} style={styles.title}>
            {item?.name}
          </Text>
          <Rating rating={item?.rating} />
        </View>
        <View style={styles.callMessageView}>
          <TouchableOpacity onPress={onMessage} activeOpacity={0.8}>
            <Image
              resizeMode="contain"
              style={styles.image}
              source={ unReadMsg ? appImages.messageUnreadImg :appImages.messageImage}
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
    </View>
  );
};

export default DriverTrackingProfileComp;

const styles = StyleSheet.create({
  topLineView: {
    height: 4,
    backgroundColor: colors.colorD9,
    width: wp('12%'),
    borderRadius: 10,
    alignSelf: 'center',
  },
  main: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userImage: {
    height: 55,
    width: 55,
    borderRadius: 100,
    borderWidth: 0.3,
    borderColor: colors.main,
  },
  textRatingView: {
    flex: 1,
    marginLeft: '2%',
  },
  title: {
    fontSize: RFValue(12),
    fontFamily: fonts.semiBold,
    color: colors.black,
    marginBottom: '7%',
    marginLeft: '2%',
    width: wp('40%'),
  },
  callMessageView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    height: 35,
    width: 35,
  },
});
