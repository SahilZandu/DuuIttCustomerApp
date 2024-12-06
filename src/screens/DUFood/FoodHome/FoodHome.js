import React, {useEffect, useState, useCallback} from 'react';
import {View, Image, DeviceEventEmitter, Text} from 'react-native';
import {appImages, appImagesSvg} from '../../../commons/AppImages';
import {styles} from './styles';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import AppInputScroll from '../../../halpers/AppInputScroll';
import handleAndroidBackButton from '../../../halpers/handleAndroidBackButton';
import {useFocusEffect} from '@react-navigation/native';
import DashboardHeader2 from '../../../components/header/DashboardHeader2';
import {homeRideCS, silderArray} from '../../../stores/DummyData/Home';
import ChangeRoute2 from '../../../components/ChangeRoute2';
import {setCurrentLocation} from '../../../components/GetAppLocation';
import {rootStore} from '../../../stores/rootStore';
import {fetch} from '@react-native-community/netinfo';
import NoInternet from '../../../components/NoInternet';
import MikePopUp from '../../../components/MikePopUp';
import FoodSlider from '../../../components/slider/foodSlider';

export default function FoodHome({navigation}) {
  const {appUser} = rootStore.commonStore;
  const [appUserInfo, setAppUserInfo] = useState(appUser);
  const [internet, setInternet] = useState(true);
  const [isKeyboard, setIskeyboard] = useState(false);
  const [searchRes, setSearchRes] = useState('');
  const [visible, setVisible] = useState(false);
  const [sliderItems, setSliderItems] = useState(silderArray);

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

  const hanldeSearch = async s => {
    console.log('get res:--', s);
  };

  const onSuccessResult = item => {
    console.log('item=== onSuccessResult', item);
    setSearchRes(item);
    setVisible(false);
  };
  const onCancel = () => {
    setVisible(false);
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
            autoFocus={isKeyboard}
            value={searchRes}
            onChangeText={t => {
              setSearchRes(t);
              if (t) {
                hanldeSearch(t);
              }
            }}
            onMicroPhone={() => {
              setVisible(true);
            }}
            onFocus={() => setIskeyboard(true)}
            onBlur={() => setIskeyboard(false)}
            onCancelPress={() => {
              setSearchRes('');
            }}
            // onRefershData={onRefershData}
          />

          <View style={styles.outerScrollView}>
            <AppInputScroll
              padding={true}
              keyboardShouldPersistTaps={'handled'}>
              {/* <View style={{marginTop: '2%', marginHorizontal: 20}}>
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
              </View> */}
              {/* <View style={styles.bottomImageView}>
                <Image
                  resizeMode="cover"
                  style={styles.bottomImage}
                  source={appImages.rideHomeBootmImage}
                />
              </View> */}

              <View style={{marginHorizontal: 20, justifyContent: 'center'}}>
                <View
                  style={{
                    marginHorizontal: -10,
                    alignContent: 'center',
                  }}>
                  <FoodSlider
                    data={sliderItems}
                    imageWidth={wp('77%')}
                    imageHeight={hp('18%')}
                  />
                </View>
              </View>
            </AppInputScroll>
          </View>
        </>
      )}
      <MikePopUp
        visible={visible}
        title={'Sorry! Didn’t hear that'}
        text={'Try saying restaurant name or a dish.'}
        onCancelBtn={onCancel}
        onSuccessResult={onSuccessResult}
      />
    </View>
  );
}
