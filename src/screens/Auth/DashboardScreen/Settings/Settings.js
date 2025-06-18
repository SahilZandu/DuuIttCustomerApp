import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Platform, DeviceEventEmitter } from 'react-native';
import Header from '../../../../components/header/Header';
import { useFocusEffect, CommonActions } from '@react-navigation/native';
import { styles } from './styles';
import AppInputScroll from '../../../../halpers/AppInputScroll';
import TouchableTextSwitch from '../../../../components/TouchableTextSwitch';
import PopUp from '../../../../components/appPopUp/PopUp';
import { rootStore } from '../../../../stores/rootStore';
import socketServices from '../../../../socketIo/SocketServices';
import PopUpInProgess from '../../../../components/appPopUp/PopUpInProgess';
import handleAndroidBackButton from '../../../../halpers/handleAndroidBackButton';

export default function Settings({ navigation }) {
  const { deleteAccount } = rootStore.dashboardStore;
  const { appUser, setToken, setAppUser } = rootStore.commonStore;
  const {
    ordersTrackOrder,
    orderTrackingList,
    getPendingForCustomer,
  } = rootStore.orderStore;
  const [activateSwitch, setActivateSwitch] = useState(true);
  const [switchWallet, setSwitchWallet] = useState(true);
  const [isDelete, setIsDelete] = useState(false);
  const [incompletedParcelOrder, setIncompletedParcelOrder] = useState([])
  const [incompletedRideOrder, setIncompletedRideOrder] = useState([])
  const [trackedParcelOrder, setTrackedParcelOrder] = useState(orderTrackingList ?? [])
  const [isProgrss, setIsProgress] = useState(false);

  useFocusEffect(
    useCallback(() => {
      handleAndroidBackButton(navigation);
    }, []),
  );


  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([
          getIncompleteParcelOrder(),
          getTrackingParcelOrder(),
          getIncompleteRideOrder()
        ]);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchData();
  }, []);


  const getIncompleteParcelOrder = async () => {
    const resIncompleteOrder = await getPendingForCustomer('parcel');
    console.log('resIncompleteOrder parcel--', resIncompleteOrder);

    if ((resIncompleteOrder[0]?.status == 'pending'
      || resIncompleteOrder[0]?.status == 'find-rider')) {
      // deleteIncompleteOrder(resIncompleteOrder);
    }
    else if (resIncompleteOrder?.length > 0 &&
      (resIncompleteOrder[0]?.status !== 'pending'
        || resIncompleteOrder[0]?.status !== 'find-rider')
    ) {
      setIncompletedParcelOrder(resIncompleteOrder);
    }
  };

  const getIncompleteRideOrder = async () => {
    const resIncompleteOrder = await getPendingForCustomer('ride');
    console.log('resIncompleteOrder parcel--', resIncompleteOrder);

    if ((resIncompleteOrder[0]?.status == 'pending'
      || resIncompleteOrder[0]?.status == 'find-rider')) {
      // deleteIncompleteOrder(resIncompleteOrder);
    }
    else if (resIncompleteOrder?.length > 0 &&
      (resIncompleteOrder[0]?.status !== 'pending'
        || resIncompleteOrder[0]?.status !== 'find-rider')
    ) {
      setIncompletedRideOrder(resIncompleteOrder);
    }
  };

  const getTrackingParcelOrder = async () => {
    const resTrack = await ordersTrackOrder(handleLoadingTrack);
    setTrackedParcelOrder(resTrack);
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

  const onTogglePress = async () => {
    setActivateSwitch(!activateSwitch);
  };

  const onToggleWallet = async () => {
    setSwitchWallet(!switchWallet);
  };

  const handleDelete = async () => {
    const res = await deleteAccount(appUser, handleLoading);
    console.log('res delete--', res, res?.statusCode);
    if (res?.statusCode == 200) {
      setIsDelete(false);
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
    } else {
      setIsDelete(false);
    }
  };

  const handleLoading = () => {
    setIsDelete(false);
  };

  return (
    <View style={styles.container}>
      <Header
        bottomLine={true}
        onPress={() => {
          navigation.goBack();
        }}
        title={'Settings'}
        backArrow={true}
      />

      <AppInputScroll
        Pb={'20%'}
        padding={true}
        keyboardShouldPersistTaps={'handled'}>
        <View style={{ marginHorizontal: 20, justifyContent: 'center' }}>
          {/* <TouchableTextSwitch
            toggle={true}
            activateSwitch={activateSwitch}
            onTogglePress={onTogglePress}
            title={'Notification Settings'}
            text={'Define what alerts and notifications you want to see'}
          /> */}

          <TouchableTextSwitch
            toggle={false}
            title={'Delete Account'}
            text={'Delete your account'}
            onPress={() => {
              if (incompletedParcelOrder?.length > 0
                || incompletedRideOrder?.length > 0
                || trackedParcelOrder?.length > 0) {
                setIsProgress(true)
              } else {
                setIsDelete(true);
              }

            }}
          />

          {/* <TouchableTextSwitch
            toggle={true}
            activateSwitch={switchWallet}
            onTogglePress={onToggleWallet}
            title={'Wallet Settings'}
            text={'Show/Hide your wallet on home'}
          /> */}
          {/* <TouchableTextSwitch
            toggle={false}
            title={'Terms and Conditions'}
            text={'You must agree to the Terms & Conditions.'}
            onPress={() => {
              navigation.navigate('myWebComponent', {
                type: 'terms',
              });
            }}
          />
          <TouchableTextSwitch
            toggle={false}
            title={'Privacy Policy'}
            text={'You must agree to the Privacy Policy.'}
            onPress={() => {
              navigation.navigate('myWebComponent', {
                type: 'policy',
              });
            }}
          /> */}
        </View>
        <PopUp
          visible={isDelete}
          type={'delete'}
          onClose={() => setIsDelete(false)}
          title={'Are you sure you want to delete your account?'}
          text={
            'This action is permanent and will remove all your data. Do you really want to continue?'
          }
          onDelete={handleDelete}
        />
        <PopUpInProgess
          CTATitle={'Cancel'}
          visible={isProgrss}
          type={'warning'}
          onClose={() => setIsProgress(false)}
          title={'You cannot delete account'}
          text={
            "You cannot delete your account while your order is being processed."
          }
        />
      </AppInputScroll>
    </View>
  );
}
