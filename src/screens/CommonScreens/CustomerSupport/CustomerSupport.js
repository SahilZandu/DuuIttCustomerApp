import { hasProp } from 'mobx/dist/internal';
import React, { useEffect, useState, useCallback } from 'react';
import { Text, View, Image, Linking } from 'react-native';
import { appImages } from '../../../commons/AppImages';
import Header from '../../../components/header/Header';
import { styles } from './styles';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { colors } from '../../../theme/colors';
import BTN from '../../../components/cta/BTN';
import { useFocusEffect } from '@react-navigation/native';
import handleAndroidBackButton from '../../../halpers/handleAndroidBackButton';
import { rootStore } from '../../../stores/rootStore';

export default function CustomerSupport({ navigation }) {
  const { getAdminInfo, getSupportInfo } = rootStore.authStore;
  const [infoData, setInfoData] = useState({});

  useFocusEffect(
    useCallback(() => {
      handleAndroidBackButton(navigation);
      getSupportInfoData();
    }, []),
  );

  const getSupportInfoData = async () => {
    const res = await getSupportInfo(handleLoading);
    console.log('res----getAdminInfoData', res);
    setInfoData(res);
  };

  const handleLoading = v => {
    console.log('v--', v);
  };

  const hanldeLinking = type => {
    if (type) {
      if (type == 'email') {
        Linking.openURL(`mailto:${infoData?.email ?? "admin@gmail.com"}`);
      } else {
        Linking.openURL(`tel:${infoData?.phone ?? '1234567890'}`);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Header
        backArrow={true}
        onPress={() => {
          navigation.goBack();
        }}
        title={'Customer Support'}
        bottomLine={1}
      />
      <View style={styles.innerView}>
        <Image
          resizeMode="contain"
          style={styles.image}
          source={appImages.customerSupportImage}
        />
        <Text style={styles.supportText}>Customer Support Center</Text>
        <Text style={styles.ifText}>
          If you have any questions, encounter issues, or simply want to provide
          feedback, our support team is ready to help. Choose from the options
          below to get in touch with us
        </Text>
        <View style={styles.buttonView}>
          <BTN
            disable={infoData?.email?.length > 0 ? false : true}
            backgroundColor={colors.white}
            labelColor={colors.main}
            width={wp('40%')}
            title={'Email Us'}
            onPress={() => {
              hanldeLinking('email');
            }}
            bottomCheck={15}
            textTransform={'capitalize'}
          />

          <BTN
            disable={infoData?.phone?.toString()?.length > 0 ? false : true}
            width={wp('40%')}
            title={'Call Us'}
            onPress={() => {
              hanldeLinking('phone');
            }}
            bottomCheck={15}
            textTransform={'capitalize'}
          />
        </View>
      </View>
    </View>
  );
}
