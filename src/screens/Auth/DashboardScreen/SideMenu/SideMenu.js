import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, DeviceEventEmitter, Platform, InteractionManager } from 'react-native';
import { appImagesSvg } from '../../../../commons/AppImages';
import { styles } from './styles';
import AppInputScroll from '../../../../halpers/AppInputScroll';
import { rootStore } from '../../../../stores/rootStore';
import handleAndroidBackButton from '../../../../halpers/handleAndroidBackButton';
import { useFocusEffect, CommonActions } from '@react-navigation/native';
import Url from '../../../../api/Url';
import ReusableSurfaceComp from '../../../../components/ReusableSurfaceComp';
import TouchTextRightIconComp from '../../../../components/TouchTextRightIconComp';
import ProfileCompleteIconTextComp from '../../../../components/ProfileCompleteIconTextComp';
import ProfileUpperShowComp from '../../../../components/ProfileUpperShowComp';
import Spacer from '../../../../halpers/Spacer';
import { fetch } from '@react-native-community/netinfo';
import NoInternet from '../../../../components/NoInternet';
import socketServices from '../../../../socketIo/SocketServices';
import PopUp from '../../../../components/appPopUp/PopUp';
import PopUpInProgess from '../../../../components/appPopUp/PopUpInProgess';
import { Wrapper4 } from '../../../../halpers/Wrapper4';


export default function SideMenu({ navigation }) {
  const { setToken, setAppUser, appUser } = rootStore.commonStore;
  const { getCheckDeviceId, saveFcmToken, userLogout } = rootStore.dashboardStore;
  const {
    ordersTrackOrder,
    orderTrackingList,
    getPendingForCustomer,
  } = rootStore.orderStore;
  const {
    getFoodOrderTracking,
    foodOrderTrackingList,
  } = rootStore.foodDashboardStore;

  const [initialValues, setInitialValues] = useState({
    image: '',
    name: '',
    email: '',
    phone: '',
  });
  const [internet, setInternet] = useState(true);
  const [isLogout, setIsLogout] = useState(false);
  const [incompletedParcelOrder, setIncompletedParcelOrder] = useState([])
  const [incompletedRideOrder, setIncompletedRideOrder] = useState([])
  const [trackedParcelOrder, setTrackedParcelOrder] = useState(orderTrackingList ?? [])
  const [isProgrss, setIsProgress] = useState(false);
  const [loading, setLoading] = useState(false);
  const [foodTrackedArray, setFoodTrackedArray] = useState(foodOrderTrackingList ?? [])

  const foodOptions = [
    {
      id: '1',
      title: 'Your Order',
      onPress: () => {
        // console.log('Order Histroy');
        navigation.navigate('tab3', { tabText: 'Food' });
      },
      icon: appImagesSvg.orderHistory,
      show: true,
      disable: false,
    },
    {
      id: '2',
      title: 'My Favorite',
      onPress: () => {
        navigation.navigate('favoriteRestaurant');
      },
      icon: appImagesSvg.myFavorate,
      show: true,
      disable: false,
    },
  ];

  const rideOptions = [
    {
      id: '1',
      title: 'Your Order',
      onPress: () => {
        // console.log('Order Histroy');
        navigation.navigate('tab3', { tabText: 'Ride' });
      },
      icon: appImagesSvg.orderHistory,
      show: true,
      disable: false,
    },
  ];
  const parcelOptions = [
    {
      id: '1',
      title: 'Your Order',
      onPress: () => {
        // console.log('Order Histroy');
        navigation.navigate('tab3', { tabText: 'Parcel' });
      },
      icon: appImagesSvg.orderHistory,
      show: true,
      disable: false,
    },
  ];

  const moneyOptions = [
    {
      id: '1',
      title: 'Wallet',
      onPress: () => {
        navigation.navigate('wallet');
        // console.log('Wallet');
      },
      icon: appImagesSvg.walletSvg,
      show: true,
      disable: false,
    },
    {
      id: '2',
      title: 'Buy  Gift Card',
      onPress: () => {
        // console.log('Buy  Gift Card');
        navigation.navigate('giftCard');
      },
      icon: appImagesSvg.giftCardSvg,
      show: true,
      disable: false,
    },
    {
      id: '3',
      title: 'Claim Gift Card',
      onPress: () => {
        // console.log('Claim Gift Card');
        navigation.navigate('claimGiftCardList');
      },
      icon: appImagesSvg.myFavorate,
      show: true,
      disable: false,
    },
    {
      id: '4',
      title: 'Reward Coins',
      onPress: () => {
        navigation.navigate('rewardsStars');
        // console.log('Reward Coins');
      },
      icon: appImagesSvg.currencySvg,
      show: true,
      disable: false,
    },
    {
      id: '5',
      title: 'Duuitt Credits',
      onPress: () => {
        navigation.navigate('duuIttCredit');
        // console.log('Duuitt Credits');
      },
      icon: appImagesSvg.duuIttCoin,
      show: true,
      disable: false,
    },
    {
      id: '6',
      title: 'Payment Settings',
      onPress: () => {
        console.log('Payment Settings');
      },
      icon: appImagesSvg.paymentSvg,
      show: true,
      disable: false,
    },
  ];

  const coupanOptions = [
    {
      id: '1',
      title: 'Collected Coupons',
      onPress: () => {
        console.log('Collected Coupons');
      },
      icon: appImagesSvg.coupansSvg,
      show: true,
      disable: false,
    },
  ];

  const moreOptions = [
    // {
    //   id: '0',
    //   title: 'Wallet',
    //   onPress: () => {
    //     navigation.navigate('wallet');
    //   },
    //   icon: appImagesSvg.walletSvg,
    //   show: true,
    //   disable: false,
    // },

    // {
    //   id: '1',
    //   title: (appUser?.password &&
    //     appUser?.password?.toString()?.length > 0)
    //     ? "Update Password" : 'Set Password',
    //   onPress: () => {
    //     navigation.navigate('setUpdatePass');
    //   },
    //   icon: appImagesSvg.setUpdateIcon,
    //   show: (appUser?.email && appUser?.email?.length > 0) ? true : false,
    //   disable: false,
    // },
    {
      id: '2',
      title: 'My Address',
      onPress: () => {
        navigation.navigate('myAddress', { screenName: 'home' });
        // console.log('My Address');
      },
      icon: appImagesSvg.myAddressSvg,
      show: true,
      disable: false,
    },
    {
      id: '3',
      title: 'Send feedback',
      onPress: () => {
        navigation.navigate('feedback');
      },
      icon: appImagesSvg.sendFeedback,
      show: true,
      disable: false,
    },
    {
      id: '4',
      title: 'Help',
      onPress: () => {
        navigation.navigate('help');
      },
      icon: appImagesSvg.helpSvg,
      show: true,
      disable: false,
    },
    // {
    //   id: '5',
    //   title: 'Customer Support',
    //   onPress: () => {
    //     navigation.navigate('customerSupport');
    //   },
    //   icon: appImagesSvg.customerSupport,
    //   show: true,
    //   disable: false,
    // },

    {
      id: '6',
      title: 'Settings',
      onPress: () => {
        navigation.navigate('settings');
        // console.log('Settings');
      },
      icon: appImagesSvg.settingSvg,
      show: true,
      disable: false,
    },
    {
      id: '7',
      title: 'About',
      onPress: () => {
        navigation.navigate('about');
        console.log('About');
      },
      icon: appImagesSvg.aboutSvg,
      show: true,
      disable: false,
    },
    {
      id: '8',
      title: 'Logout',
      onPress: async () => {
        // setIsLogout(true);
        if ((incompletedParcelOrder?.length > 0
          || incompletedRideOrder?.length > 0
          || trackedParcelOrder?.length > 0
          || foodTrackedArray?.length > 0)) {
          setIsProgress(true)
        } else {
          setIsLogout(true);
        }
      },
      icon: appImagesSvg.logOutSvg,
      show: true,
      disable: false,
    },
    // {
    //   id: '8',
    //   title: 'Chat',
    //   onPress: () => {
    //     navigation.navigate('chat',{item:{}});
    //   },
    //   icon: appImagesSvg.walletSvg,
    //   show: true,
    //   disable: false,
    // },
  ];

  useFocusEffect(
    useCallback(() => {
      getCheckDevice();
      socketServices.initailizeSocket();
      checkInternet();
      handleAndroidBackButton(navigation);
      onUpdateUserInfo();
    }, []),
  );
  const getCheckDevice = async () => {
    await getCheckDeviceId()
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([
          getIncompleteParcelOrder(),
          getTrackingParcelOrder(),
          getIncompleteRideOrder(),
          getFoodTrackingOrder(),
        ]);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchData();
  }, []);

  const getFoodTrackingOrder = async () => {
    const res = await getFoodOrderTracking(handleTrackingLoading);
    if (res?.data?.length > 0) {
      setFoodTrackedArray(res?.data);
    } else {
      setFoodTrackedArray([]);
    }
  };

  const handleTrackingLoading = (v) => {
    console.log("v", v);

  }


  const getIncompleteParcelOrder = async () => {
    const resIncompleteOrder = await getPendingForCustomer('parcel');
    console.log('resIncompleteOrder parcel--', resIncompleteOrder);
    if (resIncompleteOrder?.length > 0 &&
      (resIncompleteOrder[0]?.status !== 'pending')
    ) {
      setIncompletedParcelOrder(resIncompleteOrder);
    }
  };

  const getIncompleteRideOrder = async () => {
    const resIncompleteOrder = await getPendingForCustomer('ride');
    console.log('resIncompleteOrder parcel--', resIncompleteOrder);
    if (resIncompleteOrder?.length > 0 &&
      (resIncompleteOrder[0]?.status !== 'pending')
    ) {
      setIncompletedRideOrder(resIncompleteOrder);
    }
  };

  const getTrackingParcelOrder = async () => {
    const resTrack = await ordersTrackOrder(handleLoadingTrack);
    if (resTrack?.data?.length > 0) {
      setTrackedParcelOrder(resTrack?.data);
    } else {
      setTrackedParcelOrder([]);
    }
  };

  const handleLoadingTrack = v => {
    console.log('Track...', v);
  };



  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener('cancelOrder', data => {
      console.log('cancel Order data -- ', data);
      if (data) {
        getIncompleteParcelOrder();
        getIncompleteRideOrder();
      }
    });
    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener('dropped', data => {
      console.log('dropped data --Parcel ', data);
      if (data) {
        getIncompleteParcelOrder();
        getTrackingParcelOrder();
        getIncompleteRideOrder();
      }

    });
    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener('picked', data => {
      console.log('picked data -- ', data);
      if (data?.order_type == 'parcel') {
        getTrackingParcelOrder();
      }
    });
    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    DeviceEventEmitter.addListener('tab4', event => {
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

  const onUpdateUserInfo = () => {
    const { appUser } = rootStore.commonStore;
    console.log('appUser--', appUser);
    setInitialValues({
      image:
        appUser?.profile_pic?.length > 0
          ? appUser?.profile_pic
          : '',
      name: appUser?.name?.length > 0 ? appUser?.name : 'User Name',
      email: appUser?.email?.length > 0 ? appUser?.email : '',
      phone:
        appUser?.phone?.toString()?.length > 0
          ? appUser?.phone?.toString()
          : '',
    });
  };

  const handleLogout = async () => {
    await userLogout(handleLogoutLoading, isSuccess, onError)

  };

  const handleLogoutLoading = (v) => {
    setLoading(v)
  }
  // const isSuccess = () => {
  //   if (Platform.OS === 'ios') {
  //     setTimeout(async () => {
  //       let query = {
  //         user_id: appUser?._id,
  //       };
  //       socketServices.emit('remove-user', query);
  //       socketServices.disconnectSocket();
  //       await setToken(null);
  //       await setAppUser(null);
  //       setIsLogout(false);
  //       navigation.dispatch(
  //         CommonActions.reset({
  //           index: 0,
  //           routes: [{ name: 'auth' }],
  //         }),
  //       );
  //     }, 1000);
  //   } else {
  //     setTimeout(async () => {
  //       let query = {
  //         user_id: appUser?._id,
  //       };
  //       socketServices.emit('remove-user', query);
  //       socketServices.disconnectSocket();
  //       await setToken(null);
  //       await setAppUser(null);
  //       setIsLogout(false);
  //       navigation.dispatch(
  //         CommonActions.reset({
  //           index: 0,
  //           routes: [{ name: 'auth' }],
  //         }),
  //       );
  //     }, 500);
  //   }
  // }

  const isSuccess = async () => {
    try {
      const query = {
        user_id: appUser?._id || null,
      };

      if (query?.user_id) {
        socketServices?.emit?.('remove-user', query);
      }

      socketServices?.disconnectSocket?.();
      await setToken(null);
      await setAppUser(null);
      setIsLogout(false);
      // Use InteractionManager to wait until animations & state finish
      InteractionManager.runAfterInteractions(() => {
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: 'auth' }],
          }),
        );
      });
    } catch (error) {
      console.log("Logout crash error:", error);
      setIsLogout(false);
    }
  };


  const onError = () => {
    setIsLogout(false);
  }


  return (
    <Wrapper4
      edges={['left', 'right']}
      transparentStatusBar
      // title={"Explore"}
      appUserInfo={appUser}
      navigation={navigation}
    // showHeader
    >
      <View style={styles.container}>
        {internet == false ? (
          <NoInternet />
        ) : (
          <>
            <ProfileUpperShowComp
              navigation={navigation}
              item={initialValues}
              appUser={appUser}
            />
            <Spacer space={'1%'} />
            <AppInputScroll
              Pb={'57%'}
              padding={true}
              keyboardShouldPersistTaps={'handled'}>
              <ProfileCompleteIconTextComp
                navigation={navigation}
                appUser={appUser}
              />
              <ReusableSurfaceComp title={'Food'}>
                <TouchTextRightIconComp firstIcon={true} data={foodOptions} />
              </ReusableSurfaceComp>

              <ReusableSurfaceComp title={'Ride'}>
                <TouchTextRightIconComp firstIcon={true} data={rideOptions} />
              </ReusableSurfaceComp>

              <ReusableSurfaceComp title={'Parcel'}>
                <TouchTextRightIconComp firstIcon={true} data={parcelOptions} />
              </ReusableSurfaceComp>

              {/* <ReusableSurfaceComp title={'Money'}>
          <TouchTextRightIconComp firstIcon={true} data={moneyOptions} />
        </ReusableSurfaceComp> */}
              {/* <ReusableSurfaceComp title={'Coupons'}>
          <TouchTextRightIconComp  firstIcon={true} data={coupanOptions} />
        </ReusableSurfaceComp> */}

              <ReusableSurfaceComp title={'More'}>
                <TouchTextRightIconComp firstIcon={true} data={moreOptions} />
              </ReusableSurfaceComp>
              <PopUp
                topIcon={true}
                visible={isLogout}
                type={'logout'}
                onClose={() => setIsLogout(false)}
                title={'Are you sure you want to log out?'}
                text={
                  'You will be log out of your account. Do you want to continue?'
                }
                onDelete={handleLogout}
              />

              <PopUpInProgess
                topIcon={true}
                CTATitle={'Cancel'}
                visible={isProgrss}
                type={'warning'}
                onClose={() => setIsProgress(false)}
                title={"You can't logout"}
                text={
                  "You can't logout your account while your order is being processed."
                }
              />

            </AppInputScroll>
          </>
        )}
      </View>
    </Wrapper4>
  );
}
