// import {PermissionsAndroid, Platform} from 'react-native';
// import Geolocation from 'react-native-geolocation-service';

// let loc = {
//   // latitude: 30.7307,
//   // longitude: 76.6815,
//    latitude: null,
//    longitude: null,
// };

// let liv = {
//    latitude: null,
//    longitude: null,
// };

// let watchId = null;

// export const setCurrentLocation = async () => {
//   if (Platform.OS == 'ios') {
//     setPostion();
//   } else {
//     const grant = await PermissionsAndroid.request(
//       PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
//     );

//     // console.log('grantttttt', grant);
//     if (grant == PermissionsAndroid.RESULTS.GRANTED) {
//       setPostion();
//     }
//   }
// };

// const postionerror = error => {
//   if (error.code == 1) {
//     console.log('postionerror', error);
//   }
//   loc = null;
//   // loc = loc;
// };

// const setPostion = () => {
//   Geolocation.getCurrentPosition(
//     coords => {
//       console.log('coords---', coords);
//       const originLocataion = {
//         latitude: coords?.coords?.latitude,
//         longitude: coords?.coords?.longitude,
//       };
//       loc = originLocataion;
//     },
//     error => {
//       postionerror(error);
//     },
//     {
//       timeout: 20000,
//       showLocationDialog: true,
//       forceRequestLocation: true,
//       enableHighAccuracy: true,
//       maximumAge:0
//     },
//   );
// };

// export const getCurrentLocation = () => {
//   return loc;
// };



// export const startWatchingPosition = async () => {
//   if (Platform.OS === 'android') {
//     const granted = await PermissionsAndroid.request(
//       PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
//     );
//     if (granted !== PermissionsAndroid.RESULTS.GRANTED) return;
//   }

//   watchId = Geolocation.watchPosition(
//     position => {
//       liv = {
//         latitude: position.coords.latitude,
//         longitude: position.coords.longitude,
//       };
//       console.log('Updated location:', loc);
//     },
//     error => {
//       console.log('WatchPosition error:', error);
//     },
//     {
//       enableHighAccuracy: true,
//       distanceFilter: 5, // meters
//       interval: 4000,
//       fastestInterval: 2000,
//     }
//   );
// };

// export const stopWatchingPosition = () => {
//   if (watchId !== null) {
//     Geolocation.clearWatch(watchId);
//     watchId = null;
//   }
// };


// export const getLiveLocation = () => {
//   return liv;
// };


// export const filterAddress =(address)=> {
//   const parts = address?.split(',').map(part => part?.trim());
//   // If first part looks like a Plus Code or short code (letters, numbers, or +)
//   // if (/^[A-Za-z0-9\+]{3,10}$/.test(parts[0])) {
//   if (/[\d\+]/.test(parts[0]?.trim())) {
//     parts.shift(); // Remove the first part
//   }
//   return parts?.join(', ').trim();
// }





import { PermissionsAndroid, Platform, Alert } from 'react-native';
import Geolocation from 'react-native-geolocation-service';

// Cache for location data with TTL
let locationCache = {
  data: null,
  timestamp: 0,
  ttl: 5000, // Reduced to 5 seconds for faster updates
};

let liveLocation = {
  latitude: null,
  longitude: null,
  accuracy: null,
  timestamp: 0,
};

let watchId = null;
let isWatching = false;
let lastKnownLocation = null; // Store last known location for immediate access

// Improved permission handling
const requestLocationPermission = async () => {
  if (Platform.OS === 'ios') {
    return true; // iOS handles permissions in Info.plist
  }

  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Location Permission',
        message: 'This app needs access to your location to provide better service.',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      }
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  } catch (err) {
    console.log('Permission request failed:', err);
    return false;
  }
};

// ULTRA-FAST location fetching - optimized for speed
export const setCurrentLocation = async (forceRefresh = false, liveOptions = {}) => {
  try {
    // Check cache first (only if not requesting live updates)
    const now = Date.now();
    if (!forceRefresh && !liveOptions.enableLive && locationCache.data && (now - locationCache.timestamp) < locationCache.ttl) {
      console.log('Using cached location');
      return locationCache.data;
    }

    const hasPermission = await requestLocationPermission();
    if (!hasPermission) {
      Alert.alert('Permission Denied', 'Location permission is required for this feature.');
      return null;
    }

    return new Promise((resolve, reject) => {
      const options = {
        timeout: liveOptions.timeout || 5000, // Reduced to 5 seconds for faster response
        showLocationDialog: true,
        forceRequestLocation: true,
        enableHighAccuracy: liveOptions?.enableHighAccuracy || true, // Always high accuracy for speed
        maximumAge: liveOptions?.maximumAge || (liveOptions?.enableLive ? 0 : 1000), // 1 second for live, 1 second for cached
        ...liveOptions
      };

      Geolocation.getCurrentPosition(
        position => {
          const location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: position.timestamp,
            speed: position.coords.speed,
            heading: position.coords.heading,
            altitude: position.coords.altitude,
          };

          // Update cache and last known location
          locationCache.data = location;
          locationCache.timestamp = now;
          lastKnownLocation = location;

          console.log('Location updated:', location);
          resolve(location);
        },
        error => {
          console.log('Location error:', error);
          // Return last known location if available
          if (lastKnownLocation) {
            console.log('Returning last known location due to error');
            resolve(lastKnownLocation);
          } else {
            reject(error);
          }
        },
        options
      );
    });
  } catch (error) {
    console.log('setCurrentLocation failed:', error);
    // Return last known location if available
    return lastKnownLocation;
  }
};

// Get cached location (fast)
export const getCurrentLocation = () => {
  return locationCache.data || lastKnownLocation;
};

// Get location with fallback to cache
export const getLocationWithFallback = async () => {
  try {
    const freshLocation = await setCurrentLocation();
    return freshLocation || locationCache.data || lastKnownLocation;
  } catch (error) {
    console.log('Using fallback location from cache');
    return locationCache.data || lastKnownLocation;
  }
};

// ULTRA-FAST live location watching - optimized for speed
export const startWatchingPosition = async (options = {}) => {
  if (isWatching) {
    console.log('Already watching location');
    return;
  }

  try {
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) return;

    const defaultOptions = {
      enableHighAccuracy: true, // Always high accuracy for speed
      distanceFilter: 1, // Update every 1 meter for maximum responsiveness
      interval: 1000, // 1 second for maximum speed
      fastestInterval: 500, // 0.5 seconds minimum for ultra-fast updates
      ...options
    };

    watchId = Geolocation.watchPosition(
      position => {
        const newLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp,
          speed: position.coords.speed,
          heading: position.coords.heading,
          altitude: position.coords.altitude,
        };

        // Update all location references immediately
        liveLocation = newLocation;
        locationCache.data = newLocation;
        locationCache.timestamp = Date.now();
        lastKnownLocation = newLocation;

        console.log('Live location updated:', newLocation);
      },
      error => {
        console.log('WatchPosition error:', error);
        isWatching = false;
      },
      defaultOptions
    );

    isWatching = true;
    console.log('Started watching location with ultra-fast updates');
  } catch (error) {
    console.log('Failed to start location watching:', error);
  }
};

// Get immediate location without waiting
export const getImmediateLocation = () => {
  if (liveLocation && liveLocation.latitude) {
    return liveLocation;
  }
  if (lastKnownLocation && lastKnownLocation.latitude) {
    return lastKnownLocation;
  }
  if (locationCache.data && locationCache.data.latitude) {
    return locationCache.data;
  }
  return null;
};

// Force immediate location update
export const forceLocationUpdate = async () => {
  try {
    const location = await setCurrentLocation(true, {
      enableLive: true,
      enableHighAccuracy: true,
      maximumAge: 0,
      timeout: 3000 // Very fast timeout
    });
    return location;
  } catch (error) {
    console.log('Force update failed:', error);
    return getImmediateLocation();
  }
};

export const stopWatchingPosition = () => {
  if (watchId !== null) {
    Geolocation.clearWatch(watchId);
    watchId = null;
    isWatching = false;
    console.log('Stopped watching location');
  }
};

export const getLiveLocation = () => {
  return liveLocation;
};

// Check if location watching is active
export const isLocationWatching = () => {
  return isWatching;
};

// Enhanced address filtering
export const filterAddress = (address) => {
  if (!address) return '';

  try {
    const parts = address?.split(',')?.map(part => part?.trim())?.filter(Boolean);

    // Remove Plus Codes and short codes
    if (parts.length > 0 && /[\d\+]/.test(parts[0])) {
      parts.shift();
    }

    // Remove empty parts and join
    return parts?.join(', ').trim();
  } catch (error) {
    console.log('Address filtering error:', error);
    return address || '';
  }
};

// Utility functions
export const isLocationValid = (location) => {
  return location &&
    typeof location?.latitude === 'number' &&
    typeof location?.longitude === 'number' &&
    !isNaN(location?.latitude) &&
    !isNaN(location?.longitude);
};

export const getDistanceFromLocation = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
};

// Clear cache when needed
export const clearLocationCache = () => {
  locationCache = {
    data: null,
    timestamp: 0,
    ttl: 30000,
  };
};

// Live Location Manager for always-on tracking
class LiveLocationManager {
  constructor() {
    this.isActive = false;
    this.watchId = null;
    this.intervalId = null;
    this.locationCallback = null;
    this.errorCallback = null;
    this.options = {
      enableHighAccuracy: true,
      distanceFilter: 5, // meters
      interval: 3000, // 3 seconds
      fastestInterval: 2000, // 2 seconds minimum
      timeout: 10000,
      maximumAge: 0, // Always fresh
    };
  }

  // Start continuous location tracking
  async startTracking(callback, errorCallback, customOptions = {}) {
    if (this.isActive) {
      console.log('Location tracking already active');
      return;
    }

    try {
      const hasPermission = await requestLocationPermission();
      if (!hasPermission) {
        throw new Error('Location permission denied');
      }

      this.locationCallback = callback;
      this.errorCallback = errorCallback;
      this.options = { ...this.options, ...customOptions };

      // Use watchPosition for real-time updates
      this.watchId = Geolocation.watchPosition(
        (position) => {
          const location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: position.timestamp,
            speed: position.coords.speed,
            heading: position.coords.heading,
            altitude: position.coords.altitude,
          };

          // Update live location
          liveLocation = location;

          // Call callback with new location
          if (this.locationCallback) {
            this.locationCallback(location);
          }

          console.log('Live location updated:', location);
        },
        (error) => {
          console.error('WatchPosition error:', error);
          if (this.errorCallback) {
            this.errorCallback(error);
          }
          this.isActive = false;
        },
        this.options
      );

      this.isActive = true;
      console.log('Live location tracking started');
    } catch (error) {
      console.error('Failed to start location tracking:', error);
      throw error;
    }
  }

  // Stop location tracking
  stopTracking() {
    if (this.watchId !== null) {
      Geolocation.clearWatch(this.watchId);
      this.watchId = null;
    }

    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }

    this.isActive = false;
    this.locationCallback = null;
    this.errorCallback = null;
    console.log('Live location tracking stopped');
  }

  // Get current tracking status
  isTracking() {
    return this.isActive;
  }

  // Update tracking options
  updateOptions(newOptions) {
    if (this.isActive) {
      // Restart tracking with new options
      const callback = this.locationCallback;
      const errorCallback = this.errorCallback;
      this.stopTracking();
      this.startTracking(callback, errorCallback, { ...this.options, ...newOptions });
    } else {
      this.options = { ...this.options, ...newOptions };
    }
  }
}

// Create global instance
export const liveLocationManager = new LiveLocationManager();

// Convenience functions for live location
export const startLiveLocationTracking = (callback, errorCallback, options) => {
  return liveLocationManager.startTracking(callback, errorCallback, options);
};

export const stopLiveLocationTracking = () => {
  liveLocationManager.stopTracking();
};

export const isLiveLocationTracking = () => {
  return liveLocationManager.isTracking();
};

export const updateLiveLocationOptions = (options) => {
  liveLocationManager.updateOptions(options);
};