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
  },
  titleView: {
    height: screenHeight(4),
    width: screenWidth(0.8),
    backgroundColor: colors.main,
  },
  title: {
    fontSize: RFValue(14),
    fontFamily: fonts.semiBold,
    color: colors.main,
    marginLeft: '4%',
    marginTop: '2%',
  },
});
