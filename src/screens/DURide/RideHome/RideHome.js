import React, {useEffect, useState, useRef, useCallback} from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  Image,
  DeviceEventEmitter,
} from 'react-native';
import {appImages, appImagesSvg} from '../../../commons/AppImages';
import {styles} from './styles';
import {SvgXml} from 'react-native-svg';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import AppInputScroll from '../../../halpers/AppInputScroll';
import handleAndroidBackButton from '../../../halpers/handleAndroidBackButton';
import {useFocusEffect} from '@react-navigation/native';
import DashboardHeader2 from '../../../components/header/DashboardHeader2';
import {homeCS, homeRideCS} from '../../../stores/DummyData/Home';
import ChangeRoute2 from '../../../components/ChangeRoute2';
import SearchTextIcon from '../../../components/SearchTextIcon';
import MapRoute from '../../../components/MapRoute';
import {getCurrentLocation, setCurrentLocation} from '../../../components/GetAppLocation';
import {rootStore} from '../../../stores/rootStore';
import IncompleteCartComp from '../../../components/IncompleteCartComp';
import socketServices from '../../../socketIo/SocketServices';
import {fetch} from '@react-native-community/netinfo';
import NoInternet from '../../../components/NoInternet';
import PopUp from '../../../components/appPopUp/PopUp';
import MapLocationRoute from '../../../components/MapLocationRoute';


let geoLocation = {
  lat: null,
  lng: null,
};

export default function RideHome({navigation}) {
  const {appUser} = rootStore.commonStore;
  const {getPendingForCustomer, updateOrderStatus} = rootStore.orderStore;
  const {setAddParcelInfo} = rootStore.parcelStore;
  const {setSenderAddress, setReceiverAddress} = rootStore.myAddressStore;
  const [appUserInfo, setAppUserInfo] = useState(appUser);
  const [trackedArray, setTrackedArray] = useState([]);
  const [incompletedArray, setIncompletedArray] = useState([]);
  const [internet, setInternet] = useState(true);
  const [isDelete, setIsDelete] = useState(false);
  const [originLocation ,setOriginLocation]=useState({})
  const getLocation = type => {
    let d =
      type == 'lat'
        ? getCurrentLocation()?.latitude
        : getCurrentLocation()?.longitude;

    return d ? d : '';
  };

  useFocusEffect(
    useCallback(() => {
      checkInternet();
      handleAndroidBackButton(navigation);
      setCurrentLocation();
      onUpdateUserInfo();
      getIncompleteOrder();
      socketServices.removeListener('update-location');
      socketServices.removeListener('remaining-distance');
      socketServices.disconnectSocket();
      setSenderAddress({});
      setReceiverAddress({});
      setTimeout(() => {
        geoLocation = {
          lat: getLocation('lat'),
          lng: getLocation('lng'),
        };
        setOriginLocation(geoLocation)
        console.log('Updated geoLocation:', geoLocation);
      },1500);
      
    }, []),
  );

  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener('newOrder', data => {
      console.log('new order data -- ', data);
      getIncompleteOrder();
    });

    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener('cancelOrder', data => {
      console.log('cancel Order data -- ', data);
      getIncompleteOrder();
    });
    return () => {
      subscription.remove();
    };
  }, []);

  // useEffect(() => {
  //   const subscription = DeviceEventEmitter.addListener(
  //     'picked',
  //     data => {
  //     console.log('picked data -- ',data)
  //     // navigation.navigate('parcel', {screen: 'home'});
  //     getTrackingOrder()
  //     },
  //   );
  //   return () => {
  //     subscription.remove();
  //   };
  // }, []);

  // useEffect(() => {
  //   const subscription = DeviceEventEmitter.addListener(
  //     'dropped',
  //     data => {
  //     console.log('dropped data -- ',data)
  //      getTrackingOrder();
  //     },
  //   );
  //   return () => {
  //     subscription.remove();
  //   };
  // }, []);

  // const getTrackingOrder = async () => {
  //   const resTrack = await ordersTrackOrder(handleLoadingTrack);
  //   setTrackedArray(resTrack);
  // };

  const getIncompleteOrder = async () => {
    const resIncompleteOrder = await getPendingForCustomer('ride');
    console.log('resIncompleteOrder ride--', resIncompleteOrder);
    setIncompletedArray(resIncompleteOrder);
    if(resIncompleteOrder?.length > 0){
    setAddParcelInfo(resIncompleteOrder[0]);
    }
  };

  const deleteIncompleteOrder = async () => {
    const parcelId = incompletedArray[0]?._id;
    console.log('Item parcelId--', parcelId);
    await updateOrderStatus(
      parcelId,
      'deleted',
      handleDeleteLoading,
      onDeleteSuccess,
      true,
    );
  };

  const handleDeleteLoading = v => {
    console.log('delete...', v);
    setIsDelete(false);
  };

  const onDeleteSuccess = () => {
    console.log('onDeleteSuccess...');
    getIncompleteOrder();
  };

  const onUpdateUserInfo = () => {
    const {appUser} = rootStore.commonStore;
    setAppUserInfo(appUser);
  };

  const getHeight = (trackedArray, incompletedArray) => {
    if (trackedArray?.length > 0 && incompletedArray?.length > 0) {
      return hp('25%');
    } else if (trackedArray?.length > 0 || incompletedArray?.length > 0) {
      return hp('16%');
    } else {
      return hp('5%');
    }
  };

  const onPressInCompleteOrder = () => {
    console.log('home priceConfirmed --', incompletedArray[0]);
    setAddParcelInfo(incompletedArray[0]);
    let checkStatus = incompletedArray[0]?.status;
    if (
      (checkStatus == 'accepted' ||
      checkStatus == 'find-rider' ||
      checkStatus == 'picked')
    ) {
      navigation.navigate('searchingRide', {
        paymentMethod:
          incompletedArray[0]?.payment_mode == 'cash' ? 'Cash' : 'Online',
          totalAmount:incompletedArray[0]?.total_amount,
      });
    } else {
      navigation.navigate('priceConfirmed', {
        item: incompletedArray[0],
      });
    }
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

           <MapLocationRoute
            mapContainerView={{height: hp('25%')}}
            origin={geoLocation ?? originLocation}
            isPendingReq={true}
          />
          
          <SearchTextIcon
            title={'Enter pick up or send location'}
            onPress={() => {
              if (incompletedArray?.length > 0) {
                onPressInCompleteOrder();
                // navigation.navigate('setLocationHistory');
              } else {
                navigation.navigate('setLocationHistory');
                // navigation.navigate('pickSuccessfully');
              }
            }}
          />
          <View style={styles.outerScrollView}>
            <AppInputScroll
              padding={true}
              Pb={getHeight(trackedArray, incompletedArray)}
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
                  resizeMode='contain'
                  style={styles.bottomImage}
                  source={appImages.rideHomeBootmImage}
                />
              </View>
            </AppInputScroll>
          </View>

          {incompletedArray?.length > 0 && (
            <IncompleteCartComp
              navigation={navigation}
              trackedArray={trackedArray}
              incompletedArray={incompletedArray}
              onPressComplete={() => {
                onPressInCompleteOrder();
              }}
              onDeleteRequest={() => {
                setIsDelete(true);
              }}
              title={'Complete your ride'}
            />
          )}
          <PopUp
            visible={isDelete}
            type={'delete'}
            onClose={() => setIsDelete(false)}
            title={'You are about to delete an request'}
            text={
              'This will delete your order request from the pending order.Are your sure?'
            }
            onDelete={deleteIncompleteOrder}
          />
        </>
      )}
    </View>
  );
}
