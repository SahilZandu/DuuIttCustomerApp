import React from 'react';
import { BackHandler, Alert, Platform, AppState } from 'react-native';
import { rootStore } from '../stores/rootStore';
import RNRestart from 'react-native-restart';



function handleAndroidBackButton(navigation, tab,type,goBack) {

  const { addParcelInfo, setAddParcelInfo } = rootStore.parcelStore;
  const { updateOrderStatus } = rootStore.orderStore;

  const deleteIncompleteOrder = async (data) => {
    const parcelId = data?._id;
    console.log('Item parcelId--', parcelId);
    if (data?.status === 'pending') {
      await updateOrderStatus(
        parcelId,
        'deleted',
        handleDeleteLoading,
        onDeleteSuccess,
        false,
      );
    }
  };

  const handleDeleteLoading = () => {
    console.log('Deleting order...');

  }

  const onDeleteSuccess = () => {
    console.log('onDeleteSuccess...');
    if (Platform.OS === 'ios') {
      goBack.navigate(type, { screen: 'home' });
      setAddParcelInfo({})
     
      // setTimeout(() => {
      //   RNRestart.restart();
      // }, 200)
    }
    else {
      goBack.navigate(type, { screen: 'home' });
      BackHandler.exitApp();
      setAddParcelInfo({})
     
      // setTimeout(() => {
      //   RNRestart.restart();
      // }, 200)
    }
  }

  const onBackPress = () => {
    if (tab && tab !== "All Orders") {
      navigation.navigate('tab4')
    } else {
      if (navigation) {
        navigation.goBack();
      } else {
        if ((addParcelInfo?._id?.length > 0 &&
          (addParcelInfo?.status === 'pending'
            || addParcelInfo?.status === 'find-rider'))) {
          console.log('Item parcelId--', addParcelInfo?._id);
          if (Platform.OS === 'ios') {
            const subscription = AppState.addEventListener('change', nextAppState => {
              // if (
              //   appState.current.match(/inactive|background/) &&
              //   nextAppState === 'active'
              // ) {
              //   console.log('App has come to the foreground!');
              //   if (tab && tab !== "All Orders") {
              //     navigation.navigate('tab4');
              //   } else if (navigation.canGoBack()) {
              //     navigation.goBack();
              //   }
              // }
              if (nextAppState === 'inactive') {
                console.log('App is inactive');
                deleteIncompleteOrder(addParcelInfo);
              }
              appState.current = nextAppState;
            });
          } else {
            deleteIncompleteOrder(addParcelInfo);
          }
        } else {
          BackHandler.exitApp();
        }
        // BackHandler.exitApp();
        // Alert.alert(
        //       'Exit App',
        //       'Are you sure you want exit the application?', [{
        //           text: 'Cancel',
        //           onPress: () => console.log('Cancel Pressed'),
        //           style: 'cancel'
        //       }, {
        //           text: 'OK',
        //           onPress: () => BackHandler.exitApp()
        //       }, ], {
        //           cancelable: false
        //       }
        //)
      }
    }
    return true;
  };

  const subscription = BackHandler.addEventListener(
    'hardwareBackPress',
    onBackPress,
  );

  return () => subscription.remove();
}


export default handleAndroidBackButton;
