import React from 'react';
import {Text, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {SvgXml} from 'react-native-svg';
import {RFValue} from 'react-native-responsive-fontsize';
import { setBarColor } from '../halpers/SetStatusBarColor';
import { fonts } from '../theme/fonts/fonts';
import CTA from './cta/CTA';
import Spacer from '../halpers/Spacer';

const NoInternet = ({currentScreen, onReload, onAppJs}) => {
  if (onAppJs) {
    return (
      <View
        style={{
          paddingVertical: '1%',
          alignItems: 'center',
          backgroundColor: setBarColor(currentScreen),
          flexDirection: 'row',
          justifyContent: 'center',
        }}>
        <Icon name={'sync-disabled'} size={18} />
        <Text style={{marginLeft: 10}}>No internet Connection</Text>
      </View>
    );
  } else {
    return (
      <View
        style={{
          paddingVertical: '1%',
          alignItems: 'center',
          backgroundColor: 'white',
          justifyContent: 'center',
          flex: 1,
        }}>
        <SvgXml xml={icon} fill={'#646464'} />
        <Text
          style={{
            marginTop: '5%',
            fontFamily: fonts.bold,
            fontSize: RFValue(14),
            color: '#333333',
          }}>
          No internet Connection
        </Text>
        <Text
          style={{
            marginTop: '4%',
            marginHorizontal: '8%',
            textAlign: 'center',
            fontFamily: fonts.regular,
            fontSize: RFValue(12),
            color: '#9A9A9A',
          }}>
          No internet connection found. Check your connection or try again.{' '}
        </Text>
        <Spacer space={'15%'} />
        {onReload && <CTA title={'Reload'} onPress={onReload} />}
      </View>
    );
  }
};

export default NoInternet;

const icon = `<svg xmlns="http://www.w3.org/2000/svg" height="70" viewBox="0 -960 960 960" width="70"><path d="M790-56 414-434q-47 11-87.5 33T254-346l-84-86q32-32 69-56t79-42l-90-90q-41 21-76.5 46.5T84-516L0-602q32-32 66.5-57.5T140-708l-84-84 56-56 736 736-58 56Zm-310-64q-42 0-71-29.5T380-220q0-42 29-71t71-29q42 0 71 29t29 71q0 41-29 70.5T480-120Zm236-238-29-29-29-29-144-144q81 8 151.5 41T790-432l-74 74Zm160-158q-77-77-178.5-120.5T480-680q-21 0-40.5 1.5T400-674L298-776q44-12 89.5-18t92.5-6q142 0 265 53t215 145l-84 86Z"/></svg>`;
