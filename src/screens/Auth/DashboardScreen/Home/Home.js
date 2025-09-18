import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
  View,
  Image,
  PermissionsAndroid,
  Platform,
  DeviceEventEmitter,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { appImages } from '../../../../commons/AppImages';
import DashboardHeader from '../../../../components/header/DashboardHeader';
import { styles } from './styles';
import { homeCS } from '../../../../stores/DummyData/Home';
import ChangeRoute from '../../../../components/ChangeRoute';
import AppInputScroll from '../../../../halpers/AppInputScroll';
import handleAndroidBackButton from '../../../../halpers/handleAndroidBackButton';
import { useFocusEffect } from '@react-navigation/native';
import { rootStore } from '../../../../stores/rootStore';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { findPolygonForPoint, getCurrentLocation, setCurrentLocation } from '../../../../components/GetAppLocation';
import { useNotifications } from '../../../../halpers/useNotifications';
import socketServices from '../../../../socketIo/SocketServices';
import NoInternet from '../../../../components/NoInternet';
import messaging from '@react-native-firebase/messaging';
import { getUniqueId } from 'react-native-device-info';
import notifee, { AuthorizationStatus } from '@notifee/react-native';
import CustomerHomeSlider from '../../../../components/slider/customerHomeSlider';
import { colors } from '../../../../theme/colors';
import { Wrapper4 } from '../../../../halpers/Wrapper4';
import { getGeoCodes } from '../../../../components/GeoCodeAddress';
import AnimatedLoader from '../../../../components/AnimatedLoader/AnimatedLoader';


let currentLocation = {
  lat: null,
  lng: null,
};

export default function Home({ navigation }) {
  const { appUser } = rootStore.commonStore;
  const { saveFcmToken, getCheckDeviceId, getRestaurantBanners } = rootStore.dashboardStore;
  const { setChangeLiveLocation, changeLiveLocation } = rootStore.foodDashboardStore;
  const { setSelectedAddress } = rootStore.cartStore;
  const { currentAddress } = rootStore.myAddressStore;
  const { geth3Polygons, h3PolyData } = rootStore.orderStore;
  const getLocation = type => {
    let d =
      type == 'lat'
        ? getCurrentLocation()?.latitude
        : getCurrentLocation()?.longitude;

    return d ? d : '';
  };
  useNotifications(navigation);
  const [internet, setInternet] = useState(true);
  const [bannerList, setBannerList] = useState([])
  const [polygonArray, setPolygonArray] = useState(h3PolyData ?? [])
  const [loading, setLoading] = useState(currentAddress?.address?.length > 0 ? false : true)

  useFocusEffect(
    useCallback(() => {
      // if (h3PolyData?.length == 0) {
      getH3PolygonData();
      // }
      setCurrentLocation();
      requestUserNotificationPermission();
      getCheckDevice();
      requestNotificationPermission();
      handleAndroidBackButton();
      checkInternet()
      checkNotificationPer()
      initFCM();
      getRestaurantBannersData();
      if (changeLiveLocation?.address?.length === 0) {
        setTimeout(() => {
          currentLocation = {
            lat: getLocation('lat'),
            lng: getLocation('lng'),
          }
          handleCurrentAddress();
        }, 1000)
      }
    }, []),
  );


  const getH3PolygonData = async () => {

    const resH3 = await geth3Polygons();
    // console.log("resH3---Home", resH3);
    setPolygonArray(resH3)


  }

  // function pointInPolygon(point, vs) {
  //   const [x, y] = point;
  //   let inside = false;

  //   for (let i = 0, j = vs.length - 1; i < vs.length; j = i++) {
  //     const xi = vs[i][0], yi = vs[i][1];
  //     const xj = vs[j][0], yj = vs[j][1];

  //     const intersect =
  //       yi > y !== yj > y &&
  //       x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;

  //     if (intersect) inside = !inside;
  //   }

  //   return inside;
  // }


  // function findPolygonForPoint(lat, lng, polygons) {
  //   for (const poly of polygons) {
  //     if (pointInPolygon([lat, lng], poly.polygon)) {
  //       return poly;
  //     }
  //   }
  //   return null;
  // }

  // Example usage:
  // const myLat = 30.7981;
  // const myLng = 76.6526;

  // const matchedPolygon = findPolygonForPoint(myLat, myLng, polygonArray);

  // if (matchedPolygon) {
  //   console.log("Point belongs to polygon:", matchedPolygon.name);
  // } else {
  //   console.log("Point is outside all polygons");
  // }


  const handleCurrentAddress = async () => {
    setCurrentLocation();
    const addressData = await getGeoCodes(
      currentLocation?.lat,
      currentLocation?.lng,
    );

    let data = {
      address: addressData?.address,
      geoLocation: addressData?.geo_location
    }

    const orderAddress = {
      _id: "674007788c0213057bd1520c",
      address: addressData?.address,
      address_detail: "Current Location",
      geo_location: addressData?.geo_location,
      landmark: "Live Location",
      location_id: addressData?.place_Id ?? "ChIJG4wjYojuDzkRE-yXH4TZiN0",
      name: appUser?.name ?? "No Name",
      phone: appUser?.phone ?? 9876543210,
      title: "Other"
    }

    setSelectedAddress(orderAddress);

    setChangeLiveLocation(data)
  };


  const getRestaurantBannersData = async () => {
    const res = await getRestaurantBanners();
    if (res?.length > 0) {
      setBannerList(res)
    } else {
      setBannerList([]);
    }
    //  console.log("res---getRestaurantBannersData",res,res[0]?.additional_details);

  }

  useFocusEffect(
    useCallback(() => {
      setTimeout(() => {
        if ((bannerList.length > 0 && bannerList[0]?.backgroundColorText !== '#000000')) {
          StatusBar.setBarStyle("light-content", true);
        } else {
          StatusBar.setBarStyle("dark-content", true);
        }
        return () => {
          StatusBar.setBarStyle("dark-content", true);
        };
      }, 2000)
    }, [bannerList])
  );


  async function requestUserNotificationPermission() {
    const settings = await notifee.requestPermission();

    if (settings.authorizationStatus >= AuthorizationStatus.AUTHORIZED) {
      console.log('Permission settings:', settings);
      setCurrentLocation();
    } else {
      console.log('User declined permissions');
      setCurrentLocation();
    }
  }

  const checkNotificationPer = () => {
    notifee.setBadgeCount(0).then(() => console.log('Badge count removed'));
  };

  const getCheckDevice = async () => {
    const deviceId = await getUniqueId();
    await getCheckDeviceId(deviceId)
  }

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
    // Initialize FCM
    // const initFCM = async () => {
    //   await requestUserPermission();
    // };
    // initFCM();
  }, [appUser]);


  const initFCM = async () => {
    await requestUserPermission();
  };
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
            user_type: 'customer',
          };
          saveFcmToken(token);
          socketServices.emit('update-fcm-token', request);
          setTimeout(() => {
            socketServices.disconnectSocket();
          }, 500);
        }, 1500);
      }
      //  await saveFcmToken(token)
    } catch (error) {
      console.log('Error getting token:', error);
    }
  };

  return (



    <>
      {bannerList?.length == 0 ? <Wrapper4
        edges={['left', 'right']}
        transparentStatusBar
        title={""}
        appUserInfo={appUser}
        navigation={navigation}
        showProfile={true}
        showHeader
        showLocation={true}
        onSetlocation={() => { setLoading(false) }}
        isOnSetlocation={true}
      >
        {/* <View style={styles.container}> */}
        {loading == true ? (
          <AnimatedLoader type={'homeScreenLoader'} />
        ) : (<>
          {internet == false ? (
            <NoInternet />
          ) : (
            <>
              {/* <DashboardHeader title={appUser?.name ?? "Home"}
              appUserInfo={appUser}
              navigation={navigation}
              showProfile={true} />  */}

              <View style={styles.mainView}>
                <AppInputScroll
                  padding={true}
                  keyboardShouldPersistTaps={'handled'}>
                  {/* {bannerList?.length > 0 && (
                  <CustomerHomeSlider
                    bannerList={bannerList}
                    data={bannerList[0]?.image_urls}
                    paginationList={true}
                    imageHeight={hp('30%')} />
                )} */}
                  <View style={styles.innerView}>
                    <ChangeRoute data={homeCS} navigation={navigation} />
                  </View>
                  <View style={styles.bottomImageView}>
                    <Image
                      resizeMode='contain'
                      style={styles.bottomImage}
                      source={appImages.mainHomeBootmImage}
                    />
                  </View>
                </AppInputScroll>
              </View>
            </>
          )}
        </>)}
      </Wrapper4> :
        <View style={styles.container}>
          <StatusBar
            animated={true}
            translucent={true}
            backgroundColor={
              colors.whiteThink
            }
            barStyle={"light-content"}
          />
          {internet == false ? (
            <NoInternet />
          ) : (
            <>
              <View style={styles.mainView}>
                <AppInputScroll
                  padding={true}
                  keyboardShouldPersistTaps={'handled'}>
                  {bannerList?.length > 0 && (
                    <CustomerHomeSlider
                      bannerList={bannerList}
                      data={bannerList[0]?.image_urls}
                      paginationList={true}
                      imageHeight={hp('38%')} />
                  )}
                  <View style={styles.haederShowView}>
                    <DashboardHeader
                      backgroundColor={colors.black05 ?? 'transparent'}
                      textColor={bannerList[0]?.backgroundColorText ?? colors.black}
                      title={""}
                      appUserInfo={appUser}
                      navigation={navigation}
                      showProfile={true}
                      showLocation={true}
                      onSetlocation={() => { setLoading(false) }}
                      isOnSetlocation={true}
                    />
                  </View>
                  {loading == true ? (
                    <AnimatedLoader type={'homeScreenLoader'} />
                  ) : (<>
                    <View style={styles.innerView}>
                      <ChangeRoute data={homeCS} navigation={navigation} />
                    </View>
                    <View style={styles.bottomImageView}>
                      <Image
                        resizeMode='contain'
                        style={styles.bottomImage}
                        source={appImages.mainHomeBootmImage}
                      />
                    </View>
                  </>)}
                </AppInputScroll>
              </View>

            </>

          )}
        </View>
      }

    </>


  );
}








// import React, { useEffect, useState, useRef, useCallback } from 'react';
// import {
//   View,
//   Image,
//   PermissionsAndroid,
//   Platform,
//   DeviceEventEmitter,
//   SafeAreaView,
//   StatusBar,
//   ImageBackground,
// } from 'react-native';
// import { appImages } from '../../../../commons/AppImages';
// import DashboardHeader from '../../../../components/header/DashboardHeader';
// import { styles } from './styles';
// import { homeCS } from '../../../../stores/DummyData/Home';
// import ChangeRoute from '../../../../components/ChangeRoute';
// import { mainArray } from '../../../../stores/DummyData/Home';
// import AppInputScroll from '../../../../halpers/AppInputScroll';
// import RenderOffer from '../../../../components/RenderOffer';
// import handleAndroidBackButton from '../../../../halpers/handleAndroidBackButton';
// import { useFocusEffect } from '@react-navigation/native';
// import { rootStore } from '../../../../stores/rootStore';
// import {
//   heightPercentageToDP as hp,
//   widthPercentageToDP as wp,
// } from 'react-native-responsive-screen';
// import { setCurrentLocation } from '../../../../components/GetAppLocation';
// import { useNotifications } from '../../../../halpers/useNotifications';
// import socketServices from '../../../../socketIo/SocketServices';
// import NoInternet from '../../../../components/NoInternet';
// import messaging from '@react-native-firebase/messaging';
// import { getUniqueId } from 'react-native-device-info';
// import notifee, { AuthorizationStatus } from '@notifee/react-native';
// import CustomerHomeSlider from '../../../../components/slider/customerHomeSlider';
// import { colors } from '../../../../theme/colors';



// export default function Home({ navigation }) {
//   const { appUser } = rootStore.commonStore;
//   const { saveFcmToken, getCheckDeviceId, getRestaurantBanners } = rootStore.dashboardStore;
//   useNotifications(navigation);
//   const [internet, setInternet] = useState(true);
//   const [bannerList, setBannerList] = useState([])

//   useFocusEffect(
//     useCallback(() => {
//       requestUserNotificationPermission();
//       getCheckDevice();
//       requestNotificationPermission();
//       handleAndroidBackButton();
//       setCurrentLocation()
//       checkInternet()
//       checkNotificationPer()
//       initFCM();
//       getRestaurantBannersData();
//     }, []),
//   );


//   const getRestaurantBannersData = async () => {
//     const res = await getRestaurantBanners();
//     setBannerList(res)
//     //  console.log("res---getRestaurantBannersData",res);

//   }


//   async function requestUserNotificationPermission() {
//     const settings = await notifee.requestPermission();

//     if (settings.authorizationStatus >= AuthorizationStatus.AUTHORIZED) {
//       console.log('Permission settings:', settings);
//     } else {
//       console.log('User declined permissions');
//     }
//   }

//   const checkNotificationPer = () => {
//     notifee.setBadgeCount(0).then(() => console.log('Badge count removed'));
//   };

//   const getCheckDevice = async () => {
//     const deviceId = await getUniqueId();
//     await getCheckDeviceId(deviceId)
//   }

//   useEffect(() => {
//     DeviceEventEmitter.addListener('tab1', event => {
//       console.log('event----tab1', event);
//       if (event != 'noInternet') {
//       }
//       setInternet(event == 'noInternet' ? false : true);
//       console.log('internet event');
//     });
//   }, []);
//   const checkInternet = () => {
//     fetch().then(state => {
//       setInternet(state.isInternetReachable);
//     });
//   };

//   async function requestNotificationPermission() {
//     if (Platform.OS === 'android' && Platform.Version >= 33) {
//       // Android 13+
//       try {
//         const granted = await PermissionsAndroid.request(
//           PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
//           {
//             title: 'Notification Permission',
//             message:
//               'This app needs notification permissions to send you alerts.',
//             buttonNeutral: 'Ask Me Later',
//             buttonNegative: 'Cancel',
//             buttonPositive: 'OK',
//           },
//         );
//         if (granted === PermissionsAndroid.RESULTS.GRANTED) {
//           console.log('Notification permission granted');
//         } else {
//           console.log('Notification permission denied');
//         }
//       } catch (err) {
//         console.warn(err);
//       }
//     }
//   }

//   useEffect(() => {
//     socketServices.initailizeSocket();
//     // Initialize FCM
//     // const initFCM = async () => {
//     //   await requestUserPermission();
//     // };
//     // initFCM();
//   }, [appUser]);


//   const initFCM = async () => {
//     await requestUserPermission();
//   };
//   const requestUserPermission = async () => {
//     const authStatus = await messaging().requestPermission();
//     const enabled =
//       authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
//       authStatus === messaging.AuthorizationStatus.PROVISIONAL;
//     if (enabled) {
//       console.log('Authorization status:', authStatus);
//       await registerForRemoteMessages();
//     }
//   };

//   const registerForRemoteMessages = async () => {
//     try {
//       await messaging().registerDeviceForRemoteMessages();
//       console.log('Device registered for remote messages.');
//       await getToken();
//     } catch (error) {
//       console.log('Error registering device for remote messages:', error);
//     }
//   };

//   const getToken = async () => {
//     try {
//       const token = await messaging().getToken();
//       console.log('FCM Token:', token);
//       if (token) {
//         setTimeout(() => {
//           let request = {
//             user_id: appUser?._id,
//             fcm_token: token,
//             user_type: 'customer',
//           };
//           saveFcmToken(token);
//           socketServices.emit('update-fcm-token', request);
//           setTimeout(() => {
//             socketServices.disconnectSocket();
//           }, 500);
//         }, 1500);
//       }
//       //  await saveFcmToken(token)
//     } catch (error) {
//       console.log('Error getting token:', error);
//     }
//   };

//   return (
//     <>
//       <StatusBar
//         translucent={true}
//         backgroundColor="transparent"
//         barStyle="light-content" // or "dark-content"
//       />
//       <View>
//         <View style={styles.statusBarBackground} />
//         <ImageBackground
//         source={appImages.birthdayImage1}
//         resizeMode="cover"
//         style={{ flex: 1,
//           width: wp('100%'),
//           height: hp('100%') + (Platform.OS === 'android' ? StatusBar.currentHeight : 0),
//           marginTop: Platform.OS === 'android' ? -StatusBar.currentHeight : 0,}}
//       />
//       </View>
//     </>
//   );
// }







// import React from 'react';
// import {
//   View,
//   ImageBackground,
//   StatusBar,
//   StyleSheet,
//   Platform,
// } from 'react-native';
// import { appImages } from '../../../../commons/AppImages';


// export default function App() {
//   return (
//     <View style={styles.container}>
//       {/* Transparent status bar so image shows behind it */}
//       <StatusBar
//         translucent={true}
//         backgroundColor="transparent"
//         barStyle="dark-content"
//       />

//       <ImageBackground
//         source={appImages.birthdayImage1}
//         resizeMode="cover"
//         style={styles.image}
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   image: {
//     flex: 1,
//     width: '100%',
//     height: '100%',
//     paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
//   },
// });









