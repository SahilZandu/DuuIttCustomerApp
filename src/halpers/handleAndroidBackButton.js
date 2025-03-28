import React from 'react';
import {BackHandler,Alert} from 'react-native';


function handleAndroidBackButton(navigation) {
  const onBackPress = () => {
    if (navigation) {
      navigation.goBack();
    } else {
      BackHandler.exitApp();
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
      //    )
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
