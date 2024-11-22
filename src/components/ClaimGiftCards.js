import React, {useEffect, useState} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Platform,
  Image,
  TouchableOpacity,
} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import {SvgXml} from 'react-native-svg';
import {fonts} from '../theme/fonts/fonts';
import {appImagesSvg} from '../commons/AppImages';
import {colors} from '../theme/colors';
import {Surface} from 'react-native-paper';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

const ClaimGiftCards = ({item, index, onViewPress}) => {
  return (
    <View index={index} style={styles.container}>
      <Surface elevation={3} style={styles.surfaceView}>
        <View style={styles.innerMainView}>
          <Image resizeMode="cover" style={styles.image} source={item?.image} />
          <View style={styles.textMainView}>
            <Text style={styles.titleText}>{item?.title}</Text>
            <Text numberOfLines={1} style={styles.messageText}>
              {item?.message}
            </Text>
            <TouchableOpacity
              onPress={()=>{onViewPress(item)}}
              activeOpacity={0.8}
              style={styles.touchViewText}>
              <Text style={styles.viewDetailsText}>View Details</Text>
              <SvgXml
                style={{marginTop: '1%'}}
                xml={appImagesSvg.greenRightArrow}
              />
            </TouchableOpacity>
          </View>
        </View>
      </Surface>
    </View>
  );
};

export default ClaimGiftCards;

const styles = StyleSheet.create({
  container: {
    marginTop: '5%',
    justifyContent: 'center',
  },
  surfaceView: {
    shadowColor: Platform.OS == 'ios' ? colors.black50 : colors.black,
    backgroundColor: colors.white,
    alignSelf: 'center',
    borderRadius: 10,
    width: wp('90%'),
    height: hp('12%'),
    borderWidth: 0.5,
    borderColor: colors.colorD9,
  },
  innerMainView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    height: hp('12%'),
    width: wp('36%'),
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  textMainView: {
    marginTop: '4%',
    marginLeft: '3%',
  },
  titleText: {
    fontSize: RFValue(14),
    fontFamily: fonts.medium,
    color: colors.black,
  },
  messageText: {
    fontSize: RFValue(12),
    fontFamily: fonts.regular,
    color: colors.black85,
    width: wp('50%'),
    marginTop: '4%',
  },
  touchViewText: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: '1%',
    width: wp('30%'),
    height: hp('4%'),
  },
  viewDetailsText: {
    fontSize: RFValue(12),
    fontFamily: fonts.regular,
    color: colors.lightGreen1,
  },
});
