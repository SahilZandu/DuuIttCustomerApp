import React, { useEffect } from 'react';
import { View } from 'react-native';
import { styles } from './styles';
import Header from '../../../components/header/Header';
import SearchingRideForm from '../../../forms/SearchingRideForm';
import SearchingParcelForm from '../../../forms/SearchingParcelForm';
import { Wrapper } from '../../../halpers/Wrapper';
import { AppEvents } from '../../../halpers/events/AppEvents';
import { rootStore } from '../../../stores/rootStore';

const SearchingRide = ({ navigation, route }) => {

  const { appUser } = rootStore.commonStore;

  useEffect(() => {
    onAppEvents();
  }, [])

  const onAppEvents = async () => {
    try {
      await AppEvents({
        eventName: 'SearchingRideParcel',
        payload: {
          name: appUser?.name ?? '',
          phone: appUser?.phone?.toString() ?? '',
        }
      })
    } catch (error) {
      console.log("Error---", error);
    }

  }

  return (
    <Wrapper
      edges={['left', 'right', 'bottom']}
      transparentStatusBar
    >
      <View style={styles.container}>
        <SearchingParcelForm navigation={navigation} route={route} screenName={'parcel'} />
      </View>
    </Wrapper>
  );
};

export default SearchingRide;
