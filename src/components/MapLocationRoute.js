import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, View, Image, Platform } from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { appImages } from '../commons/AppImages';
import { getMpaDalta } from './GeoCodeAddress';
import AnimatedLoader from './AnimatedLoader/AnimatedLoader';

// Constants outside component to prevent recreation
const DEFAULT_REGION = {
  latitude: 30.7400,
  longitude: 76.7900,
  latitudeDelta: 0.0322,
  longitudeDelta: 0.0322,
};

const MOHALI_CHD_BOUNDS = {
  north: 30.8258,
  south: 30.6600,
  west: 76.6600,
  east: 76.8500,
};

const MapLocationRoute = React.memo(({
  mapContainerView,
  origin,
  isPendingReq,
  onTouchLocation,
  height,
}) => {
  const mapRef = useRef(null);
  const debounceTimeout = useRef(null);
  const [isMapReady, setIsMapReady] = useState(false);

  // Memoized map region to prevent unnecessary re-renders
  const mapRegion = useMemo(() => {
    if (origin?.lat && origin?.lng) {
      return {
        latitude: Number(origin.lat),
        longitude: Number(origin.lng),
        ...getMpaDalta(),
      };
    }
    return DEFAULT_REGION;
  }, [origin?.lat, origin?.lng]);

  // Memoized bounds check function
  const isWithinBounds = useCallback((latitude, longitude) => {
    return (
      latitude <= MOHALI_CHD_BOUNDS.north &&
      latitude >= MOHALI_CHD_BOUNDS.south &&
      longitude >= MOHALI_CHD_BOUNDS.west &&
      longitude <= MOHALI_CHD_BOUNDS.east
    );
  }, []);

  // Optimized region change handler with debouncing
  const handleRegionChangeComplete = useCallback((region) => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(() => {
      // Only update if region actually changed significantly
      const latDiff = Math.abs(region.latitude - mapRegion.latitude);
      const lngDiff = Math.abs(region.longitude - mapRegion.longitude);

      if (latDiff > 0.0001 || lngDiff > 0.0001) {
      onTouchLocation({
          latitude: region.latitude,
          longitude: region.longitude,
        });
      }
    }, Platform.OS === 'ios' ? 100 : 300);
  }, [mapRegion, onTouchLocation]);

  // Optimized map ready handler
  const handleMapReady = useCallback(() => {
      setIsMapReady(true);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, []);

  // Memoized map props to prevent unnecessary re-renders
  const mapProps = useMemo(() => ({
    provider: PROVIDER_GOOGLE,
    style: [styles.mapContainer, mapContainerView],
    initialRegion: mapRegion,
    mapType: Platform.OS === 'ios' ? 'mutedStandard' : 'standard',
    showsCompass: false,
    showsUserLocation: false,
    followsUserLocation: false,
    loadingEnabled: true,
    zoomEnabled: true,
    scrollEnabled: true,
    rotateEnabled: true,
    zoomTapEnabled: true,
    // Performance optimizations
    showsBuildings: false,
    showsTraffic: false,
    showsIndoors: false,
    showsMyLocationButton: false,
    toolbarEnabled: false,
    // Reduce map updates for better performance
    onRegionChangeComplete: handleRegionChangeComplete,
    onMapReady: handleMapReady,
  }), [mapRegion, mapContainerView, handleRegionChangeComplete, handleMapReady]);

  // Memoized center marker
  const centerMarker = useMemo(() => (
    isMapReady && (
        <Image
          source={appImages.markerImage}
          style={styles.centerMarker}
          resizeMode="contain"
      />
    )
  ), [isMapReady]);

  // Memoized loader
  const loader = useMemo(() => (
    !isMapReady && (
      <AnimatedLoader
        absolute="relative"
        type="homeMapLoader"
        height={height}
      />
    )
  ), [isMapReady, height]);

  return (
    <View
      pointerEvents={isPendingReq ? 'none' : 'auto'}
      style={styles.homeSubContainer}
    >
      <MapView ref={mapRef} {...mapProps} />
      {centerMarker}
      {loader}
    </View>
  );
});

MapLocationRoute.displayName = 'MapLocationRoute';

export default MapLocationRoute;

const styles = StyleSheet.create({
  homeSubContainer: {
    alignItems: 'flex-start',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  mapContainer: {
    alignSelf: 'center',
    height: hp('35%'),
    width: wp('100%'),
  },
  centerMarker: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -15,
    marginTop: -30,
    height: 35,
    width: 32,
    zIndex: 999,
  },
});





//  import React, { useCallback, useEffect, useRef, useState } from 'react';
//  import { StyleSheet, View, Image, Platform, Alert } from 'react-native';
//  import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
//  import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
//  import { appImages } from '../commons/AppImages';
//  import { getMpaDalta, setMpaDalta } from './GeoCodeAddress';
//  import AnimatedLoader from './AnimatedLoader/AnimatedLoader';
//  import { colors } from '../theme/colors';
//  
//  const mohaliChandigarhBounds = {
//    north: 30.8258,
//    south: 30.6600,
//   west: 76.6600,
//    east: 76.8500,
//  };
//  
//  const isWithinBounds = (latitude, longitude) => {
//    return (
//      latitude <= mohaliChandigarhBounds.north &&
//     latitude >= mohaliChandigarhBounds.south &&
//      longitude >= mohaliChandigarhBounds.west &&
//      longitude <= mohaliChandigarhBounds.east
//    );
//  };
//  
//  const MapLocationRoute = ({
//   mapContainerView,
//    origin,
//    isPendingReq,
//    onTouchLocation,
//    height,
//  }) => {
//    const mapRef = useRef(null);
//    const debounceTimeout = useRef(null);
//    const debounceRef = useRef(null);
//    const [mapRegion, setMapRegion] = useState({
//      latitude: (origin && Number(origin?.lat)) ? Number(origin?.lat) : 30.7400 ,
//      longitude: (origin && Number(origin?.lng)) ?Number(origin?.lng) : 76.7900,
//      ...getMpaDalta(),
//    });
//    const [isMapReady, setIsMapReady] = useState(false);
//  
//    useEffect(() => {
//      if (origin?.lat && origin?.lng) {
//        const newRegion = {
//          latitude: Number(origin?.lat),
//          longitude: Number(origin?.lng),
//         ...getMpaDalta(),
//        };
//        setTimeout(() => {
//          if (mapRegion?.latitude !== newRegion?.latitude) {
//            setMapRegion(newRegion);
//          }
//          if (mapRef?.current && mapRegion?.latitude !== newRegion?.latitude) {
//            mapRef.current?.animateToRegion(newRegion, 1000);
//          }
//       },500)
//      }
//  
//    }, [origin]);
//  
//  
//   // const handleRegionChangeComplete = region => {
//  
//    //   setMapRegion(region);
//    //   onTouchLocation({
//   //     latitude: region?.latitude,
//    //     longitude: region?.longitude,
//    //   });
//    // Optional bounds check
//    // if (!isWithinBounds(region?.latitude, region?.longitude)) {
//    //   Alert.alert("Restricted Area", "You can only explore within Mohali & Chandigarh.");
//    //   const fallbackRegion = {
//    //     latitude: 30.7400,
//    //     longitude: 76.7900,
//   //     ...getMpaDalta(),
//    //   };
//    //   mapRef.current?.animateToRegion(fallbackRegion, 1000);
//    // }
//    // };
//  
//    const handleRegionChangeComplete = useCallback((region) => {
//  
//      if (debounceTimeout.current) {
//        clearTimeout(debounceTimeout.current);
//      }
//  
//      debounceTimeout.current = setTimeout(() => {
//        setMapRegion(region);
//        onTouchLocation({
//          latitude: region?.latitude,
//          longitude: region?.longitude,
//        });
//        // Optional bounds check
//       // if (!isWithinBounds(region?.latitude, region?.longitude)) {
//        //   Alert.alert("Restricted Area", "You can only explore within Mohali & Chandigarh.");
//        //   const fallbackRegion = {
//       //     latitude: 30.7400,
//       //     longitude: 76.7900,
//       //     ...getMpaDalta(),
//        //   };
//        //   mapRef.current?.animateToRegion(fallbackRegion, 1000);
//        // }
//      }, Platform.OS == 'ios' ? 50 : 500);
//      // Adjust delay if needed
//    }, [onTouchLocation]);
//  
//  
//    const handleMapReady = () => {
//      // console.log('Map is ready');
//      if (origin?.lat?.toString()?.length > 0
//        && mapRegion?.latitude?.toString()?.length > 0
//      ) {
//        setIsMapReady(true);
//        setTimeout(() => {
//          setIsMapReady(true);
//        }, 1000);
//      } else {
//        setTimeout(() => {
//         setIsMapReady(true);
//        }, 5000);
//      }
//    };
//  
//  
//    //   const onTouchLocationData = useCallback(
//    //   coordinate => {
//    //     console.log('coordinate---', coordinate)
//  
//    //     // setMapRegion(prev => ({
//    //     //   ...prev,
//    //     //   latitude: Number(coordinate?.latitude),
//    //     //   longitude: Number(coordinate?.longitude),
//    //     //   ...getMpaDalta(),
//    //     //   // latitudeDelta: getMpaDalta().latitudeDelta,
//    //     //   // longitudeDelta: getMpaDalta().longitudeDelta,
//    //     // }));
//    //     // handleRegionChangeComplete(coordinate)
//    //     // onTouchLocation(coordinate);
//  
//    //   },
//    //   [],
//    // );
//  
//  
//    return (
//      <View pointerEvents={isPendingReq ? 'none' : 'auto'} style={styles.homeSubContainer}>
//        {/* {(mapRegion?.latitude && mapRegion?.latitude?.toString()?.length > 0 &&
//          mapRegion?.longitude && mapRegion?.longitude?.toString()?.length > 0) &&
//         <> */}
//        <MapView
//          ref={mapRef}
//          provider={PROVIDER_GOOGLE}
//          style={[styles.mapContainer, mapContainerView]}
//          initialRegion={mapRegion}
//          // region={mapRegion}
//          onRegionChange={(e) => { setMpaDalta(e) }}
//          onRegionChangeComplete={(e) => { handleRegionChangeComplete(e) }}
//          onMapReady={handleMapReady}
//         mapType={Platform.OS === 'ios' ? 'mutedStandard' : 'terrain'}
//          showsCompass={false}
//          showsUserLocation={false}
//          followsUserLocation={false}
//          loadingEnabled
//          zoomEnabled
//          scrollEnabled
//          rotateEnabled
//          zoomTapEnabled
//       />
//  
//        {/* Static marker overlay */}
//        {isMapReady &&
//          <Image
//            source={appImages.markerImage}
//            style={styles.centerMarker}
//            resizeMode="contain"
//          />}
//        {/* </>} */}
//  
//        {!isMapReady && (
//          <AnimatedLoader absolute="relative" type="homeMapLoader" height={height} />
//        )}
//      </View>
//    );
//  };
//  
//  export default MapLocationRoute;
//  
//  const styles = StyleSheet.create({
//   homeSubContainer: {
//      alignItems: 'flex-start',
//      justifyContent: 'center',
//      overflow: 'hidden',
//    },
//    mapContainer: {
//      alignSelf: 'center',
//      height: hp('35%'),
//      width: wp('100%'),
//    },
//    centerMarker: {
//      position: 'absolute',
//      top: '50%',
//      left: '50%',
//      marginLeft: -15,
//      marginTop: -30,
//      height: 35,
//      width: 32,
//      zIndex: 999,
//    },
//  });
