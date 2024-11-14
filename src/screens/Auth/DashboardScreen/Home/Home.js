import React, {useEffect, useState, useRef, useCallback} from 'react';
import {
  View,
  KeyboardAvoidingView,
  Image,
  PermissionsAndroid,
  Platform,
  DeviceEventEmitter,
} from 'react-native';
import {appImages} from '../../../../commons/AppImages';
import DashboardHeader from '../../../../components/header/DashboardHeader';
import MikePopUp from '../../../../components/MikePopUp';
import {styles} from './styles';
import {homeCS} from '../../../../stores/DummyData/Home';
import ChangeRoute from '../../../../components/ChangeRoute';
import {mainArray} from '../../../../stores/DummyData/Home';
import HomeSlider from '../../../../components/slider/homeSlider';
import AppInputScroll from '../../../../halpers/AppInputScroll';
import RenderOffer from '../../../../components/RenderOffer';
import handleAndroidBackButton from '../../../../halpers/handleAndroidBackButton';
import {useFocusEffect} from '@react-navigation/native';
import {rootStore} from '../../../../stores/rootStore';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import messaging from '@react-native-firebase/messaging';
import {useNotifications} from '../../../../halpers/useNotifications';
import {fetch} from '@react-native-community/netinfo';
import NoInternet from '../../../../components/NoInternet';
import socketServices from '../../../../socketIo/SocketServices';

let imageArray = [
  {id: 1, image: appImages.sliderImage1},
  {id: 2, image: appImages.sliderImage2},
  {id: 3, image: appImages.sliderImage1},
  {id: 4, image: appImages.sliderImage2},
];

export default function Home({navigation}) {
  const {appUser} = rootStore.commonStore;
  const {saveFcmToken} = rootStore.dashboardStore;
  useNotifications(navigation);

  const [sliderItems, setSliderItems] = useState(imageArray);
  const [isKeyboard, setIskeyboard] = useState(false);
  const [searchRes, setSearchRes] = useState('');
  const [visible, setVisible] = useState(false);
  const [appUserInfo, setAppUserInfo] = useState(appUser);
  const [internet, setInternet] = useState(true);

  useFocusEffect(
    useCallback(() => {
      requestNotificationPermission();
      handleAndroidBackButton();
      onUpdateUserInfo();
      checkInternet();
    }, []),
  );

  useEffect(() => {
    DeviceEventEmitter.addListener('tab1', event => {
      console.log('event----tab1', event);
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

  async function requestNotificationPermission() {
    if (Platform.OS === 'android' && Platform.Version >= 33) {
      // Android 13+
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
          {
            title: 'Notification Permission',
            message:
              'This app needs notification permissions to send you alerts.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Notification permission granted');
        } else {
          console.log('Notification permission denied');
        }
      } catch (err) {
        console.warn(err);
      }
    }
  }

  useEffect(() => {
    socketServices.initailizeSocket();
    const requestUserPermission = async () => {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        console.log('Authorization status:', authStatus);
        await registerForRemoteMessages();
      }
    };

    const registerForRemoteMessages = async () => {
      try {
        await messaging().registerDeviceForRemoteMessages();
        console.log('Device registered for remote messages.');
        await getToken();
      } catch (error) {
        console.log('Error registering device for remote messages:', error);
      }
    };

    const getToken = async () => {
      try {
        const token = await messaging().getToken();
        console.log('FCM Token:', token);
        if (token) {
          setTimeout(() => {
            let request = {
              user_id: appUser?._id,
              fcm_token: token,
              user_type:'customer'
            };
            saveFcmToken(token);
            socketServices.emit('update-fcm-token', request);
            setTimeout(() => {
              socketServices.disconnectSocket();
            }, 500);
          },1500);
        }
        //  await saveFcmToken(token)
      } catch (error) {
        console.log('Error getting token:', error);
      }
    };

    // Initialize FCM
    const initFCM = async () => {
      await requestUserPermission();
    };

    initFCM();
  }, []);

  const onUpdateUserInfo = () => {
    const {appUser} = rootStore.commonStore;
    setAppUserInfo(appUser);
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
          <DashboardHeader
            navigation={navigation}
            // title={'Home'}
            // autoFocus={isKeyboard}
            // onPressSecond={() => {
            //   // alert('second');
            // }}
            // secondImage={appImagesSvg.cartIcon}
            // value={searchRes}
            // onChangeText={t => {
            //   setSearchRes(t);
            //   if (t) {
            //     hanldeSearch(t);
            //   }
            // }}
            // onMicroPhone={() => {
            //   setVisible(true);
            // }}
            // onFocus={() => setIskeyboard(true)}
            // onBlur={() => setIskeyboard(false)}
            // onCancelPress={() => {
            //   setSearchRes('');
            // }}
            appUserInfo={appUserInfo}
          />
          <View style={styles.mainView}>
            <KeyboardAvoidingView
              style={{flex: 1, marginTop: '1.5%'}}
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
              <AppInputScroll
                padding={true}
                keyboardShouldPersistTaps={'handled'}>
                <View style={styles.innerView}>
                  <ChangeRoute data={homeCS} navigation={navigation} />

                  <HomeSlider data={sliderItems} paginationList={true} />

                  <RenderOffer data={mainArray} />
                </View>
                <View style={styles.bottomImageView}>
                  <Image
                    resizeMode="cover"
                    style={styles.bottomImage}
                    source={appImages.mainHomeBootmImage}
                  />
                </View>
              </AppInputScroll>
            </KeyboardAvoidingView>
          </View>
          <MikePopUp
            visible={visible}
            title={'Sorry! Didn’t hear that'}
            text={'Try saying restaurant name or a dish.'}
            onCancelBtn={onCancel}
            onSuccessResult={onSuccessResult}
          />
        </>
      )}
    </View>
  );
}
