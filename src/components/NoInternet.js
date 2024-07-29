import React from 'react';
import {Platform, Text, View,SafeAreaView} from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts/fonts';

const NoInternet = ({}) => (
  <SafeAreaView
    style={{
      paddingVertical: '1%',
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'center',
      backgroundColor:colors.main
    }}>
    <Icon name={'sync-disabled'} size={22} color="#FFFFFF" />
    <Text style={{marginLeft: 12, color: '#FFFFFF',
    fontSize:RFValue(12),fontFamily:fonts.bold}}>No Internet Connection</Text>
  </SafeAreaView>
);

export default NoInternet;
