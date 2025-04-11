import React from 'react';
import {View} from 'react-native';
import {styles} from './styles';
import Header from '../../../components/header/Header';
import SearchingRideForm from '../../../forms/SearchingRideForm';
import SearchingParcelForm from '../../../forms/SearchingParcelForm';

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
      {/* <SearchingRideForm navigation={navigation} route={route} screenName={'parcel'}/> */}
       <SearchingParcelForm navigation={navigation} route={route} screenName={'parcel'}/>
      

    </View>
  );
};

export default SearchingRide;
