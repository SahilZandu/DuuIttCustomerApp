import React, {useEffect, useState} from 'react';
import {
  Pressable,
  Text,
  TouchableOpacity,
  View,
  Image,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import {SvgXml} from 'react-native-svg';
import {colors} from '../theme/colors';
import {fonts} from '../theme/fonts/fonts';
import {Strings} from '../translates/strings';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {appImagesSvg} from '../commons/AppImages';
import {currencyFormat} from '../halpers/currencyFormat';
import {opacity} from 'react-native-reanimated/lib/typescript/Colors';

const AddMoneyCoinComp = ({
  item,
  onPressTouch,
  bottomLine,
  onAddMoney,
  addBtn,
  value,
  loading
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPressTouch}
      style={styles.container}>
      <View style={styles.mainInnerView}>
        <View style={styles.namePriceView}>
          <Text style={styles.walletRenderText}>{item?.name}</Text>
          <Text style={styles.walletRenderValue}>
            {currencyFormat(item?.price)}
          </Text>
        </View>
        {onAddMoney && (
          <TouchableOpacity
            disabled={value == 0 ? false : value >= 50 ? false : true}
            onPress={()=>{onAddMoney(addBtn ? (value > 0 ? 'Add' : 'Cancel') : '+ Add Money')}}
            activeOpacity={0.8}
            style={[
              styles.addMoneyBtn,
              {opacity: value == 0 ? 1 : value >= 50 ? 1 : 0.5},
            ]}>
              {loading == true ?
              <ActivityIndicator size="small" color={colors.white} />
              :
             <Text style={styles.addMoneyText}>
              {addBtn ? (value > 0 ? 'Add' : 'Cancel') : '+ Add Money'}
            </Text>}
          </TouchableOpacity>
        )}
      </View>
      {bottomLine && <View style={styles.bottomLine} />}
    </TouchableOpacity>
  );
};
export default AddMoneyCoinComp;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainInnerView: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  namePriceView: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  walletRenderText: {
    fontSize: RFValue(11),
    fontFamily: fonts.medium,
    color: colors.color83,
    marginTop: hp('2.5%'),
  },
  walletRenderValue: {
    fontSize: RFValue(13),
    fontFamily: fonts.semiBold,
    color: colors.black,
    marginTop: '2%',
  },
  addMoneyBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.main,
    alignSelf: 'center',
    height: hp('3.5%'),
    marginTop: hp('3%'),
    paddingHorizontal: 10,
    borderRadius: 20,
  },
  addMoneyText: {
    fontSize: RFValue(11),
    fontFamily: fonts.bold,
    color: colors.white,
  },
  bottomLine: {
    height: 1.5,
    backgroundColor: colors.colorD9,
    width: wp('82%'),
    marginTop: hp('2.4%'),
  },
});
