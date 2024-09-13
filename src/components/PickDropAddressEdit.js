import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  Pressable,
} from 'react-native';
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

const PickDropAddressEdit = ({item,onPressEdit}) => {
  return (
    <Surface elevation={2} style={styles.shadowView}>
      <View style={styles.innerShadowView}>
        <Image
          resizeMode="contain"
          style={styles.locationIcon}
          source={appImages.locationHistoryIcon}
        />
        <Text numberOfLines={1} style={styles.nameText}>
          {item?.name}
        </Text>
        <TouchableOpacity
          onPress={onPressEdit}
          activeOpacity={0.8}
          hitSlop={{top: 10, left: 10, right: 10, bottom: 10}}>
          <Text style={styles.editText}>Edit</Text>
        </TouchableOpacity>
      </View>
      <Text numberOfLines={1} style={styles.addressText}>
        {item?.address}
      </Text>
    </Surface>
  );
};

export default PickDropAddressEdit;

const styles = StyleSheet.create({
  shadowView: {
    shadowColor: colors.black50,
    backgroundColor: colors.white,
    borderRadius: 10,
    height: hp('8%'),
  },
  innerShadowView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 12,
    marginTop: '4%',
  },
  locationIcon: {
    width: 20,
    height: 20,
  },
  nameText: {
    flex: 1,
    marginLeft: '2%',
    fontSize: RFValue(12),
    fontFamily: fonts.medium,
    color: colors.black,
  },
  editText: {
    fontSize: RFValue(12),
    fontFamily: fonts.medium,
    color: colors.main,
  },
  addressText: {
    marginHorizontal: 12,
    marginLeft: '10%',
    fontSize: RFValue(12),
    fontFamily: fonts.regular,
    color:colors.color95,
  },
});
