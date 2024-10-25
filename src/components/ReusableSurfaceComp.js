import React from 'react';
import {Surface} from 'react-native-paper';
import {View,Text,StyleSheet} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {colors} from '../theme/colors';
import {fonts} from '../theme/fonts/fonts';
import { RFValue } from 'react-native-responsive-fontsize';

const ReusableSurfaceComp = ({title,children}) => {
  return (
    <Surface
      elevation={2}
      style={styles.container}>
      <View
        style={styles.innerView}>
        <View
          style={styles.titleView}
        />
        <Text
          style={styles.title}>
         {title}
        </Text>
      </View>
      {/* Render the content passed as children */}
      {children}
    </Surface>
  );
};

export default ReusableSurfaceComp;

const styles = StyleSheet.create({
  container:{
    shadowColor: colors.black50,
    backgroundColor: colors.white,
    borderRadius: 10,
    minHeight: hp('13%'),
    marginTop: '6%',
    justifyContent: 'center',
    marginHorizontal: 20,
  },
  innerView:{
    marginTop: '5%',
    flexDirection: 'row',
  },
  titleView:{
    height: hp('4%'),
    width: wp('0.8%'),
    backgroundColor: colors.main,
  },
  title:{
    fontSize: RFValue(14),
            fontFamily: fonts.semiBold,
            color: colors.main,
            marginLeft: '4%',
            marginTop: '2%',
  }

})