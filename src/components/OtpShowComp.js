import React from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { colors } from '../theme/colors';
import {fonts} from '../theme/fonts/fonts';


const OtpShowComp = ({title,data}) => {
  return (
    <View
    style={styles.main}>
    <Text
      style={styles.title}>
     {title}
    </Text>
    {data?.map((item, i) => {
      return (
        <View
          style={styles.renderView}>
          <Text
            style={styles.item}>
            {item}
          </Text>
        </View>
      );
    })}
  </View>
  );
};

export default OtpShowComp;

const styles = StyleSheet.create({
    main:{
        flexDirection: 'row',
      alignItems: 'center',
      marginTop: '4%',
    },
    title:{
        flex: 1,
        fontSize: RFValue(12),
        fontFamily: fonts.regular,
        color: colors.black,
    },
    renderView:{
        backgroundColor: colors.colorFA,
        height: hp('3.5%'),
        width: wp('8%'),
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 3,
    },
    item:{
        fontSize: RFValue(13),
        fontFamily: fonts.semiBold,
        color: colors.white,
        textAlign: 'center',
    }
  
});
