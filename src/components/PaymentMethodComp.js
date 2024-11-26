import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  Pressable,
  Platform,
} from 'react-native';
import {Surface} from 'react-native-paper';
import {RFValue} from 'react-native-responsive-fontsize';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {SvgXml} from 'react-native-svg';
import {appImages, appImagesSvg} from '../commons/AppImages';
import {currencyFormat} from '../halpers/currencyFormat';
import {screenHeight} from '../halpers/matrics';
import {colors} from '../theme/colors';
import {fonts} from '../theme/fonts/fonts';

const PaymentMethodComp = ({item, index, onSelectedMethod}) => {
  return (
    <View key={index} style={styles.cantainer(item)}>
      <Text style={styles.titleText}>{item?.title}</Text>
      <TouchableOpacity
        onPress={() => {
          onSelectedMethod(item);
        }}
        activeOpacity={0.8}>
        <Surface elevation={3} style={styles.surfaceView}>
          <View style={styles.innerMainView}>
            <Image
              resizeMode="contain"
              style={styles.logoImage(item)}
              source={item?.image}
            />
            <View style={styles.lineView} />
            <View style={styles.textView}>
              <Text style={styles.nameText}>{item?.name}</Text>
              {(item?.message?.length > 0 ||
                item?.price?.toString()?.length > 0) && (
                <Text numberOfLines={1} style={styles.messageText(item)}>
                  {item?.message?.length > 0
                    ? item?.message
                    : currencyFormat(item?.price)}
                </Text>
              )}
            </View>
            {item?.checkBox == true && (
              <SvgXml
                xml={
                  item?.active == true
                    ? appImagesSvg.selectCheckBox
                    : appImagesSvg.unSelectCheckBox
                }
              />
            )}
          </View>
        </Surface>
      </TouchableOpacity>
    </View>
  );
};

export default PaymentMethodComp;

const styles = StyleSheet.create({
  cantainer: item => ({
    marginTop: item?.title?.length > 0 ? '6%' : '-4%',
    justifyContent: 'center',
  }),
  titleText: {
    fontSize: RFValue(13),
    fontFamily: fonts.medium,
    color: colors.black,
  },
  surfaceView: {
    shadowColor: Platform.OS == 'ios' ? colors.black50 : colors.black, // You can customize shadow color
    backgroundColor: colors.white,
    borderRadius: 10,
    height: hp('8%'),
    marginTop: '4%',
    justifyContent: 'center',
  },
  innerMainView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
  },
  logoImage: item => ({
    height: item?.message?.length > 0 ? hp('3%') : hp('5%'),
    width: wp('10%'),
  }),
  lineView: {
    backgroundColor: colors.colorD9,
    height: hp('8%'),
    width: wp('0.3%'),
    marginLeft: wp('4%'),
  },
  textView: {
    flexDirection: 'column',
    justifyContent: 'center',
    flex: 1,
  },
  nameText: {
    marginLeft: wp('3%'),
    fontSize: RFValue(12),
    fontFamily: fonts.regular,
    color: colors.black,
  },
  messageText: item => ({
    marginLeft: wp('3%'),
    fontSize: RFValue(11),
    fontFamily: fonts.regular,
    color: item?.price ? colors.black : colors.black65,
    width: wp('65%'),
    marginTop: '2.5%',
  }),
});
