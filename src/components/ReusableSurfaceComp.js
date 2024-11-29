import React from 'react';
import {Surface} from 'react-native-paper';
import {View, Text, StyleSheet, Platform} from 'react-native';
import {colors} from '../theme/colors';
import {fonts} from '../theme/fonts/fonts';
import {RFValue} from 'react-native-responsive-fontsize';
import {screenHeight, screenWidth} from '../halpers/matrics';

const ReusableSurfaceComp = ({title, children}) => {
  return (
    <Surface elevation={3} style={styles.container}>
      <View style={styles.innerView}>
        <View style={styles.titleView} />
        <Text style={styles.title}>{title}</Text>
      </View>
      {/* Render the content passed as children */}
      {children}
    </Surface>
  );
};

export default ReusableSurfaceComp;

const styles = StyleSheet.create({
  container: {
    shadowColor: Platform.OS == 'ios' ? colors.black50 : colors.black,
    backgroundColor: colors.white,
    borderRadius: 10,
    minHeight: screenHeight(13),
    marginTop: '6%',
    justifyContent: 'center',
    marginHorizontal: 20,
  },
  innerView: {
    marginTop: '5%',
    flexDirection: 'row',
    //  justifyContent:'center',
    alignItems:'center'
  },
  titleView: {
    // height: screenHeight(4),
    // width: screenWidth(0.8),
    // backgroundColor: colors.main,
     height: screenHeight(2.5),
    width: screenWidth(3),
    borderLeftWidth: 10, // Half of the triangle's base
    borderRightWidth: 10, // Half of the triangle's base
    borderBottomWidth: 10, // Height of the triangle
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: colors.main, // Triangle's color,
    transform: [{ rotate: '90deg' }], // Rotates the triangle 90 degrees,
  },
  title: {
    fontSize: RFValue(14),
    fontFamily: fonts.semiBold,
    color: colors.main,
    right: screenWidth(0.5),
    // marginTop: '2%',
  },
});
