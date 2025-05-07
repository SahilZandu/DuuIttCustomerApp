import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, DeviceEventEmitter } from 'react-native';
import { appImagesSvg } from '../../../../commons/AppImages';
import { styles } from './styles';
import AppInputScroll from '../../../../halpers/AppInputScroll';
import { rootStore } from '../../../../stores/rootStore';
import handleAndroidBackButton from '../../../../halpers/handleAndroidBackButton';
import { useFocusEffect } from '@react-navigation/native';
import { CommonActions } from '@react-navigation/native';
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

export default function SideMenu({ navigation }) {
  const { setToken, setAppUser, appUser } = rootStore.commonStore;
   const {getCheckDeviceId} = rootStore.dashboardStore;
  const [initialValues, setInitialValues] = useState({
    image: '',
    name: '',
    email: '',
    phone: '',
  });
  const [internet, setInternet] = useState(true);
  const [isLogout, setIsLogout] = useState(false);

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
    {
      id: '0',
      title: 'Wallet',
      onPress: () => {
        navigation.navigate('wallet');
      },
      icon: appImagesSvg.walletSvg,
      show: true,
      disable: false,
    },

    {
      id: '1',
      title: (appUser?.password &&
        appUser?.password?.toString()?.length > 0)
        ? "Update Password" : 'Set Password',
      onPress: () => {
        navigation.navigate('setUpdatePass');
      },
      icon: appImagesSvg.setUpdateIcon,
      show: (appUser?.email && appUser?.email?.length > 0) ? true : false,
      disable: false,
    },
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
    // {
    //   title: 'About',
    //   onPress: () => {
    //     console.log('About');
    //   },
    //   icon: appImagesSvg.aboutSvg,
    //   show: true,
    //   disable: false,
    // },
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
    {
      id: '5',
      title: 'Customer Support',
      onPress: () => {
        navigation.navigate('customerSupport');
      },
      icon: appImagesSvg.customerSupport,
      show: true,
      disable: false,
    },

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
      title: 'Logout',
      onPress: async () => {
        setIsLogout(true);
        // let query ={
        //   user_id:appUser?._id
        //   }
        // socketServices.emit('remove-user',query)
        // socketServices.disconnectSocket();
        // await setToken(null);
        // await setAppUser(null);
        // navigation.dispatch(
        //   CommonActions.reset({
        //     index: 0,
        //     routes: [{name: 'auth'}],
        //   }),
        // );
      },
      icon: appImagesSvg.logOutSvg,
      show: true,
      disable: false,
    },
    // {
    //   id: '8',
    //   title: 'Chat',
    //   onPress: () => {
    //     navigation.navigate('chat');
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
          ? Url?.Image_Url + appUser?.profile_pic
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
    setIsLogout(false);
    setTimeout(async () => {
      let query = {
        user_id: appUser?._id,
      };
      socketServices.emit('remove-user', query);
      socketServices.disconnectSocket();
      await setToken(null);
      await setAppUser(null);
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'auth' }],
        }),
      );
    }, 500);
  };

  return (
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
            {/* <ReusableSurfaceComp title={'Food'}>
              <TouchTextRightIconComp firstIcon={true} data={foodOptions} />
            </ReusableSurfaceComp> */}

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
              visible={isLogout}
              type={'logout'}
              onClose={() => setIsLogout(false)}
              title={'Are you sure you want to log out?'}
              text={
                'You will be log out of your account. Do you want to continue?'
              }
              onDelete={handleLogout}
            />
          </AppInputScroll>
        </>
      )}
    </View>
  );
}
