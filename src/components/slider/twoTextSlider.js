import {RFC_2822} from 'moment';
import React, {useRef, useState} from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  FlatList,
  Dimensions,
  StyleSheet,
} from 'react-native';
import {Surface, Text} from 'react-native-paper';
import {RFValue} from 'react-native-responsive-fontsize';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { colors } from '../../theme/colors';
import { fonts } from '../../theme/fonts/fonts';
import HomeSlider from './homeSlider';

const TwoTextSlider = ({data,title,message}) => {
  return (
    <View style={{marginTop:hp('4%'),justifyContent: 'center'}}>
    <View style={{justifyContent: 'center'}}>
      <Text
        style={{
          fontSize: RFValue(13),
          fontFamily: fonts.medium,
          color: colors.black,
        }}>
        {title}
      </Text>
      <Text
        style={{
          fontSize: RFValue(12),
          fontFamily: fonts.regular,
          color: colors.black85,
          marginRight: 20,
          marginTop: '2%',
          lineHeight: 20,
        }}>
       {message}
      </Text>
    </View>
    <View style={{marginHorizontal: '-3%',marginTop:'-2%'}}>
      <HomeSlider data={data} paginationList={true} />
    </View>
  </View>

  );
};

export default TwoTextSlider;

const styles = StyleSheet.create({
 
});
