import {PermissionsAndroid, Platform} from 'react-native';
import Geolocation from 'react-native-geolocation-service';

let loc = {
  // latitude: 30.7307,
  // longitude: 76.6815,
   latitude: null,
   longitude: null,
};

let liv = {
   latitude: null,
   longitude: null,
};

let watchId = null;

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



export const startWatchingPosition = async () => {
  if (Platform.OS === 'android') {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
    );
    if (granted !== PermissionsAndroid.RESULTS.GRANTED) return;
  }

  watchId = Geolocation.watchPosition(
    position => {
      liv = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      };
      console.log('Updated location:', loc);
    },
    error => {
      console.log('WatchPosition error:', error);
    },
    {
      enableHighAccuracy: true,
      distanceFilter: 5, // meters
      interval: 4000,
      fastestInterval: 2000,
    }
  );
};

export const stopWatchingPosition = () => {
  if (watchId !== null) {
    Geolocation.clearWatch(watchId);
    watchId = null;
  }
};


export const getLiveLocation = () => {
  return liv;
};


