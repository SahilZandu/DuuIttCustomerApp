import React, {useCallback, useState,useRef} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  PermissionsAndroid,
  Alert,
  Linking,
} from 'react-native';
import {
  check,
  PERMISSIONS,
  RESULTS,
  request,
  openSettings,
} from 'react-native-permissions';
import {RFValue} from 'react-native-responsive-fontsize';
import {SvgXml} from 'react-native-svg';
import {appImagesSvg} from '../commons/AppImages';
import {fonts} from '../theme/fonts/fonts';
import {
  NavigationHelpersContext,
  useFocusEffect,
} from '@react-navigation/native';
import {useFormikContext} from 'formik';
import {LaunchCamera, LaunchGallary} from '../components/LaunchGallery';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

export default function PickUpdateActions({onSelectUri, name}) {
  useFocusEffect(
    useCallback(() => {
      checkPermissions();
    }, []),
  );

  const {
    setFieldTouched,
    handleChange,
    values,
    errors,
    touched,
    isValid,
    dirty,
    setFieldValue,
  } = useFormikContext();

  const onHandleGallery = async () => {
    const img = await LaunchGallary();
    console.log('result', img);
    if (img?.didCancel) {
      console.log('Gallary close');
    } else {
      onSelectUri(img?.assets[0]?.uri);
      setFieldValue(name, img?.assets[0]?.uri);
    }
  };

  const requestGalleryPermission = async () => {
    const result = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE);
    if (result === RESULTS.GRANTED) {
      console.log('Gallery permission granted');
    } else {
      console.log('Gallery permission denied');
    }
  };

  const onHandleCamera = async () => {
    const img = await LaunchCamera();
    console.log('result', img);
    if (img?.didCancel || img?.errorCode == "camera_unavailable") {
      console.log('Camera close');
    } else {
      onSelectUri(img?.assets[0]?.uri);
      setFieldValue(name, img?.assets[0]?.uri);
    }
  };

  const checkPermissions = async () => {
    if (Platform.OS === 'ios') {
      const cameraPermission = await check(PERMISSIONS.IOS.CAMERA);
      if (cameraPermission !== RESULTS.GRANTED) {
        requestCameraPermission();
      }
    } else {
      const cameraPermission = await check(
        PermissionsAndroid.PERMISSIONS.CAMERA,
      );
      if (cameraPermission !== PermissionsAndroid.RESULTS.GRANTED) {
        requestCameraPermission();
      }
    }
  };

  const openCameraSettings = () => {
    openSettings().catch(() => console.log('Cannot open settings'));
  };

  const requestCameraPermission = async () => {
    try {
      if (Platform.OS === 'ios') {
        const result = await request(PERMISSIONS.IOS.CAMERA);
        if (result !== RESULTS.GRANTED) {
          console.log('Camera permission denied');
          // Handle the denial of camera permission
          Alert.alert(
            'Permission Denied',
            'Please enable camera permission in settings to use this feature.',
            [
              {
                text: 'Cancel',
                style: 'cancel',
                onPress: () => {
                  onHandleCamera();
                },
              },
              {
                text: 'Open Settings',
                onPress: () => {
                  openCameraSettings();
                },
              },
            ],
          );
        }
      } else {
        const result = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          // {
          //   title: 'Permission Denied',
          //   message: 'Please enable camera permission in settings to use this feature.',
          //   buttonPositive:"Ok",
          // }
        );
        console.log('result', result);
        if (result !== PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Camera permission denied');
          // Handle the denial of camera permission
          Alert.alert(
            'Permission Denied',
            'Please enable camera permission in settings to use this feature.',
            [
              {
                text: 'Cancel',
                style: 'cancel',
                onPress: () => {
                  onHandleCamera();
                },
              },
              {
                text: 'Open Settings',
                onPress: () => {
                  Linking.openSettings();
                },
              },
            ],
          );
        }
      }
    } catch (error) {
      console.error('Error requesting camera permission:', error);
    }
  };

  return (
    <View>
      <TouchableOpacity
        onPress={() => {
          onHandleCamera();
        }}
        style={{
          flexDirection: 'row',
          // backgroundColor:'red',
          padding: 10,
          alignItems: 'center',
          // width: wp('35%'),
          marginLeft: hp('1%'),
          marginTop: '2%',
        }}>
        <SvgXml width={23} height={23} xml={appImagesSvg.cameraSvg} />
        <Text
          style={{
            fontSize: RFValue(14),
            fontFamily: fonts.medium,
            color: '#242424',
            marginLeft: '4%',
          }}>
          Camera
        </Text>
      </TouchableOpacity>
      <View
        style={{
          height: 2,
          backgroundColor: '#D9D9D9',
          marginTop: '2%',
          marginHorizontal: 20,
        }}
      />
      <TouchableOpacity
        onPress={() => {
          onHandleGallery();
        }}
        style={{
          flexDirection: 'row',
          padding: 10,
          alignItems: 'center',
          // width: wp('35%'),
          marginLeft: hp('1%'),
          marginTop: '3%',
        }}>
        <SvgXml width={23} height={23} xml={appImagesSvg.gallerySvg} />
        <Text
          style={{
            fontSize: RFValue(14),
            fontFamily: fonts.medium,
            color: '#242424',
            marginLeft: '4%',
          }}>
          Gallery
        </Text>
      </TouchableOpacity>
    </View>
  );
}
