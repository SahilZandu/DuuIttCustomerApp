import React, {useEffect, useState,useCallback} from 'react';
import {
  View,
  Image,
  DeviceEventEmitter,
} from 'react-native';
import {appImages,} from '../../../commons/AppImages';
import {styles} from './styles';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import AppInputScroll from '../../../halpers/AppInputScroll';
import handleAndroidBackButton from '../../../halpers/handleAndroidBackButton';
import {useFocusEffect} from '@react-navigation/native';
import DashboardHeader2 from '../../../components/header/DashboardHeader2';
import {homeRideCS} from '../../../stores/DummyData/Home';
import ChangeRoute2 from '../../../components/ChangeRoute2';
import {setCurrentLocation} from '../../../components/GetAppLocation';
import {rootStore} from '../../../stores/rootStore';
import {fetch} from '@react-native-community/netinfo';
import NoInternet from '../../../components/NoInternet';


export default function FoodHome({navigation}) {
  const {appUser} = rootStore.commonStore;
  const [appUserInfo, setAppUserInfo] = useState(appUser);

  const [internet, setInternet] = useState(true);


  useFocusEffect(
    useCallback(() => {
      checkInternet();
      handleAndroidBackButton(navigation);
      setCurrentLocation();
      onUpdateUserInfo();
    }, []),
  );


  const onUpdateUserInfo = () => {
    const {appUser} = rootStore.commonStore;
    setAppUserInfo(appUser);
  };

  useEffect(() => {
    DeviceEventEmitter.addListener('tab1', event => {
      if (event != 'noInternet') {
      }
      setInternet(event == 'noInternet' ? false : true);
      console.log('internet event');
    });
  }, []);

  const checkInternet = () => {
    fetch().then(state => {
      setInternet(state.isInternetReachable);
    });
  };

  return (
    <View style={styles.container}>
      {internet == false ? (
        <NoInternet />
      ) : (
        <>
          <DashboardHeader2
            navigation={navigation}
            onPress={() => {
              navigation.goBack();
            }}
            appUserInfo={appUserInfo}
          />

          <View style={styles.outerScrollView}>
            <AppInputScroll
              padding={true}
              keyboardShouldPersistTaps={'handled'}>
              <View style={{marginTop: '2%', marginHorizontal: 20}}>
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Image
                    resizeMode="contain"
                    style={{width: wp('90%'), height: hp('18%')}}
                    source={appImages.rideHomeImage}
                  />
                </View>
                <ChangeRoute2
                  data={homeRideCS}
                  navigation={navigation}
                  route={'RIDE'}
                />
              </View>
              <View style={styles.bottomImageView}>
                <Image
                  resizeMode="cover"
                  style={styles.bottomImage}
                  source={appImages.rideHomeBootmImage}
                />
              </View>
            </AppInputScroll>
          </View>
        </>
      )}
    </View>
  );
}
