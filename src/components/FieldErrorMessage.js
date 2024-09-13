import {StyleSheet, Text} from 'react-native';
import React from 'react';

import { RFValue } from 'react-native-responsive-fontsize';
import { fonts } from '../theme/fonts/fonts';

export default function ErrorMessage({error, visible,errorStyle}) {
  if (error && visible) {
    return <Text style={[styles.error,errorStyle]}>{error}</Text>;
  }
  return null;
}

const styles = StyleSheet.create({
  error: {
    color: 'red',
   fontFamily:fonts.medium,
   fontSize:RFValue(12),
   marginTop: '1.7%',
  },
});
