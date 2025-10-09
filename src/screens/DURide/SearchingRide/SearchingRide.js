import React, { useEffect } from 'react';
import { View } from 'react-native';
import { styles } from './styles';
import Header from '../../../components/header/Header';
import SearchingRideForm from '../../../forms/SearchingRideForm';
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
        eventName: 'SeachingRide',
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
        {/* <Header
        title={''}
        backArrow={true}
        onPress={() => {
          navigation.goBack();
        }}
      /> */}
        <SearchingRideForm navigation={navigation} route={route} screenName={'ride'} />

      </View>
    </Wrapper>
  );
};

export default SearchingRide;
