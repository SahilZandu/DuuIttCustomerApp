import React from 'react';
import {View} from 'react-native';
import {styles} from './styles';
import Header from '../../../components/header/Header';
import SearchingRideForm from '../../../forms/SearchingRideForm';

const SearchingRide = ({navigation, route}) => {
 
  return (
    <View style={styles.container}>
      {/* <Header
        title={''}
        backArrow={true}
        onPress={() => {
          navigation.goBack();
        }}
      /> */}
      <SearchingRideForm navigation={navigation} route={route} screenName={'ride'}/>

    </View>
  );
};

export default SearchingRide;
