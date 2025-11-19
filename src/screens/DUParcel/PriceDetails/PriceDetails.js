import React, { useCallback, useEffect } from 'react';
import {
  View,
} from 'react-native';
import { styles } from './styles';
import handleAndroidBackButton from '../../../halpers/handleAndroidBackButton';
import { useFocusEffect } from '@react-navigation/native';
import Header from '../../../components/header/Header';
import PriceDetailsForm from '../../../forms/PriceDetailsForm';
import { Wrapper } from '../../../halpers/Wrapper';
import { AppEvents } from '../../../halpers/events/AppEvents';
import { rootStore } from '../../../stores/rootStore';



export default function PriceDetails({ navigation }) {

  const { appUser } = rootStore.commonStore;

  useEffect(() => {
    onAppEvents();
  }, [])

  const onAppEvents = async () => {
    try {
      await AppEvents({
        eventName: 'PriceDetailsParcel',
        payload: {
          name: appUser?.name ?? '',
          phone: appUser?.phone?.toString() ?? '',
        }
      })
    } catch (error) {
      console.log("Error---", error);
    }

  }

  useFocusEffect(
    useCallback(() => {
      handleAndroidBackButton(navigation);
    }, []),
  );


  return (
    <Wrapper
      edges={['left', 'right', 'bottom']}
      transparentStatusBar
      title={'Parcel Details'}
      backArrow={true}
      onPress={() => {
        navigation.goBack();
      }}
      showHeader
    >
      <View style={styles.container}>
        {/* <Header 
      title={'Parcel Details'}
      backArrow={true}
      onPress={() => {
        navigation.goBack();
      }}/> */}
        <PriceDetailsForm navigation={navigation} />
      </View>
    </Wrapper>
  );
}
