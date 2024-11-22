import {PermissionsAndroid, Platform} from 'react-native';
import Geolocation from 'react-native-geolocation-service';

let loc = {
  // latitude: 30.7307,
  // longitude: 76.6815,
   latitude: null,
   longitude: null,
};

export const setCurrentLocation = async () => {
  if (Platform.OS == 'ios') {
    setPostion();
  } else {
    const grant = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );

    // console.log('grantttttt', grant);
    if (grant == PermissionsAndroid.RESULTS.GRANTED) {
      setPostion();
    }
  }
};

const postionerror = error => {
  if (error.code == 1) {
    console.log('postionerror', error);
  }
  loc = null;
  // loc = loc;
};

const setPostion = () => {
  Geolocation.getCurrentPosition(
    coords => {
      console.log('coords---', coords);
      const originLocataion = {
        latitude: coords?.coords?.latitude,
        longitude: coords?.coords?.longitude,
      };
      loc = originLocataion;
    },
    error => {
      postionerror(error);
    },
    {
      timeout: 20000,
      showLocationDialog: true,
      forceRequestLocation: true,
      enableHighAccuracy: true,
      maximumAge:0
    },
  );
};

export const getCurrentLocation = () => {
  return loc;
};
