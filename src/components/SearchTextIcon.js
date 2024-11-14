import React from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {SvgXml} from 'react-native-svg';
import {appImagesSvg} from '../commons/AppImages';
import {colors} from '../theme/colors';
import {fonts} from '../theme/fonts/fonts';

const SearchTextIcon = ({title,onPress}) => {
  return (
    <View style={styles.main}>
      <TouchableOpacity 
      onPress={onPress}
      activeOpacity={0.8} style={styles.touch}>
        <View style={styles.viewCricle} />

        <Text style={styles.title}>{title}</Text>
        <SvgXml
          width={20}
          height={20}
          xml={appImagesSvg.searchIcon}
          style={{right: wp('4%')}}
        />
      </TouchableOpacity>
    </View>
  );
};

export default SearchTextIcon;

const styles = StyleSheet.create({
  main: {
    position: 'absolute',
    width: wp('100%'),
    top: '10%',
  },
  touch: {
    flexDirection: 'row',
    marginHorizontal: 20,
    height: hp('5.8%'),
    backgroundColor: colors.white,
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor:colors.black25,
    alignItems: 'center',
  },
  viewCricle: {
    height: 20,
    width: 20,
    backgroundColor:colors.white,
    borderColor:colors.main,
    borderRadius: 100,
    borderWidth: 6,
    marginLeft: '4%',
  },
  title: {
    flex: 1,
    marginLeft: '4%',
    fontSize: RFValue(12),
    fontFamily: fonts.medium,
    color: colors.colorD1,
  },
});
