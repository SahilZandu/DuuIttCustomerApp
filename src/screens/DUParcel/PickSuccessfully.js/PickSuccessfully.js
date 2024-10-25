import React, {useEffect, useState, useCallback, useRef} from 'react';
import {Text, TouchableOpacity, View, Image, Platform} from 'react-native';
import {appImages, appImagesSvg} from '../../../commons/AppImages';
import {styles} from './styles';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {RFValue} from 'react-native-responsive-fontsize';
import {fonts} from '../../../theme/fonts/fonts';
import {colors} from '../../../theme/colors';
import handleAndroidBackButton from '../../../halpers/handleAndroidBackButton';
import {useFocusEffect} from '@react-navigation/native';
import CTA from '../../../components/cta/CTA';
import BTN from '../../../components/cta/BTN';
import Spacer from '../../../halpers/Spacer';
import socketServices from '../../../socketIo/SocketServices';

export default function PickSuccessfully({navigation}) {
  useFocusEffect(
    useCallback(() => {
      handleAndroidBackButton();
      socketServices.removeListener('update-location');
      socketServices.removeListener('remaining-distance');
      socketServices.disconnectSocket();
      
    },[]),
  );

  return (
    <View style={styles.container}>
      <View style={styles.main}>
        <Image
          resizeMode="cover"
          style={styles.pickedImage}
          source={appImages.pickedGreenImage}
        />

        <Text style={styles.title}>Picked Sucessfully</Text>
        <Text style={styles.message}>
          Order picked successfully. Our rider will deliver your order at your
          given place
        </Text>

        <Spacer space={'10%'} />
        <BTN
          title={'Track Your Order'}
          onPress={() => {
            navigation.navigate('trackingOrder');
          }}
        />

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            navigation.navigate('parcel', {screen: 'home'});
          }}
          style={styles.backToHomeView}>
          <Text style={styles.backToHomeText}>Back to home</Text>
          <View style={styles.backHomeBottonLine} />
        </TouchableOpacity>
      </View>
    </View>
  );
}
