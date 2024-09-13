import React, {useCallback, useEffect, useState} from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import {RFValue} from 'react-native-responsive-fontsize';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {appImages} from '../../../commons/AppImages';
import {getGeoCodes} from '../../../components/GeoCodeAddress';
import Header from '../../../components/header/Header';
import LocationHistoryCard from '../../../components/LocationHistoryCard';
import PickDropLocation from '../../../components/PickDropLocation';
import {pickUpHistory} from '../../../stores/DummyData/Home';
import {colors} from '../../../theme/colors';
import {fonts} from '../../../theme/fonts/fonts';
import {styles} from './styles';

const SetLocationHistory = ({navigation}) => {
  const [pickDrop, setPickDrop] = useState('pick');
  const [pickUpLocation, setPickUpLocation] = useState('');
  const [dropLocation, setDropLocation] = useState('');
  const [lat, setlat] = useState(30.7076);
  const [long, setlong] = useState(76.715126);

  useEffect(() => {
    onGetAddress();
  }, []);

  const onGetAddress = async () => {
    const resArress = await getGeoCodes(lat, long);
    console.log('resArress--', resArress);
  };

  const renderItem = ({item, index}) => {
    return (
      <>
        <LocationHistoryCard
          item={item}
          index={index}
          onPress={() => {
            if (pickDrop == 'pick') {
              setPickUpLocation(item?.address);
              setPickDrop('drop');
            } else {
              setDropLocation(item?.address);
            }
          }}
        />
      </>
    );
  };

  const onPressPickLocation = () => {
    navigation.navigate('chooseMapLocation',{pickDrop:pickDrop});
    // alert('pick')
  };

  const onPressDropLocation = () => {
    navigation.navigate('chooseMapLocation',{pickDrop:pickDrop});
    // alert('drop')
  };

  return (
    <View style={styles.container}>
      <Header
        title={'Pick up or send anything'}
        backArrow={true}
        onPress={() => {
          navigation.goBack();
        }}
      />
      <View style={{flex: 1, marginHorizontal: 20}}>
        <PickDropLocation
          pickUpLocation={pickUpLocation}
          dropLocation={dropLocation}
          onPressPickUp={() => {
            setPickUpLocation(''), setPickDrop('pick');
          }}
          onPressDrop={() => {
            setDropLocation(''), setPickDrop('pick');
          }}
          onPressPickLocation={onPressPickLocation}
          onPressDropLocation={onPressDropLocation}
        />
        <View style={styles.currentLocView}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {}}
            style={styles.currentLocTouch}>
            <Image
              resizeMode="contain"
              style={styles.currentLocImage}
              source={appImages.currentLocationIcon}
            />
            <Text style={styles.currentLocText}>Choose current location</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.middleLineView} />

        <View style={{marginTop: '1%'}}>
          <FlatList
            bounces={false}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{paddingBottom: '70%'}}
            data={pickUpHistory}
            renderItem={renderItem}
            keyExtractor={item => item.id}
          />
        </View>
      </View>
    </View>
  );
};

export default SetLocationHistory;
