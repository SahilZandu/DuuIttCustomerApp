import React from 'react';
import { View } from 'react-native';
import { styles } from './styles';
import Header from '../../../components/header/Header';
import SearchingRideForm from '../../../forms/SearchingRideForm';
import SearchingParcelForm from '../../../forms/SearchingParcelForm';
import { Wrapper } from '../../../halpers/Wrapper';

const SearchingRide = ({ navigation, route }) => {

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
