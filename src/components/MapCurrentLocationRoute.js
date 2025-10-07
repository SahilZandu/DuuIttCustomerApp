import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  StyleSheet,
  View,
  Image,
  Platform,
  Dimensions,
  Text,
  Alert,
} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { appImages } from '../commons/AppImages';
import MapView, { Marker, Polygon, Polyline, PROVIDER_GOOGLE, AnimatedRegion } from 'react-native-maps';
import AnimatedLoader from './AnimatedLoader/AnimatedLoader';
import { getMpaDalta, setMpaDalta } from './GeoCodeAddress';
import { getCurrentLocation } from './GetAppLocation';
import { DuuittMapTheme } from './DuuittMapTheme';

let currentLocation = {
  lat: 30.7400,
  lng: 76.7900,
};

const MapCurrentLocationRoute = ({
  mapContainerView,
  origin,
  isPendingReq,
  onTouchLocation,
  height,
}) => {
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const [mapRegion, setMapRegion] = useState({
    latitude: origin?.lat || getCurrentLocation()?.latitude || 30.4766,
    longitude: origin?.lng || getCurrentLocation()?.longitude || 76.5905,
    ...getMpaDalta(),
    //   latitudeDelta: getMpaDalta().latitudeDelta,
    //   longitudeDelta: getMpaDalta().longitudeDelta,
  });

  const [isMapReady, setIsMapReady] = useState(false);
  // console.log('origin---11', origin, mapRegion);
  const [animatedCoordinate] = useState(
    new AnimatedRegion({
      latitude: origin?.lat || null,
      longitude: origin?.lng || null,
      ...getMpaDalta(),
    })
  );

  useEffect(() => {
    if (origin && (origin?.lat && origin?.lng)) {
      const newCoord = {
        latitude: Number(origin.lat),
        longitude: Number(origin.lng),
      };

      currentLocation = newCoord;
      if (mapRegion?.latitude !== newCoord?.latitude) {
        setMapRegion({
          ...newCoord,
          ...getMpaDalta(),
        });
      }

      animatedCoordinate.timing({
        ...newCoord,
        duration: 500,
        useNativeDriver: false,
      }).start();

      if (mapRef?.current) {
        mapRef?.current.animateToRegion(
          {
            ...newCoord,
            ...getMpaDalta(),
          },
          2000
        );
      }
    }
  }, [origin, isMapReady]);


  useEffect(() => {
    if (origin && (origin?.lat && origin?.lng)) {
      const newCoord = {
        latitude: Number(origin.lat),
        longitude: Number(origin.lng),
      };

      currentLocation = newCoord;

      const timeoutId = setTimeout(() => {
        // Animate marker
        animatedCoordinate.timing({
          latitude: newCoord.latitude,
          longitude: newCoord.longitude,
          duration: 500,
          useNativeDriver: false,
        }).start();

        // Update map region state
        const delta = getMpaDalta(); // you can pass distance here if needed
        setMapRegion({
          ...newCoord,
          ...delta,
        });

        // Animate map camera
        if (mapRef?.current) {
          mapRef.current.animateToRegion(
            {
              ...newCoord,
              ...delta,
            },
            1000 // duration
          );
        }
      }, 5000); // delay for 5 seconds

      return () => {
        clearTimeout(timeoutId);
      };
    }
  }, []);



  // useEffect(() => {
  //   setTimeout(() => {
  //     setIsMapReady(currentLocation?.lat?.toString()?.length > 0 ? true : false)
  //   }, 1000)
  // }, [currentLocation])

  const onTouchLocationData = useCallback(
    coordinate => {
      // console.log('coordinate---', coordinate);
      setMapRegion(prev => ({
        ...prev,
        latitude: Number(coordinate?.latitude),
        longitude: Number(coordinate?.longitude),
        latitudeDelta: getMpaDalta().latitudeDelta ?? 0.0322,
        longitudeDelta: getMpaDalta().longitudeDelta ?? 0.0321,
      }));
      handleRegionChangeComplete(coordinate)
      onTouchLocation(coordinate);

    },
    [onTouchLocation],
  );

  const handleMapReady = () => {
    // console.log('Map is ready');
    if (origin?.lat?.toString()?.length > 0
      && animatedCoordinate?.latitude?.toString()?.length > 0) {
      setTimeout(() => {
        setIsMapReady(true);
      }, 300);
    } else {
      setTimeout(() => {
        setIsMapReady(true);
      }, 1000);
    }
  };

  return (
    <View
      pointerEvents={isPendingReq ? 'none' : 'auto'}
      style={styles.homeSubContainer}>
      {(mapRegion?.latitude?.toString()?.length > 0 &&
        mapRegion?.longitude?.toString()?.length > 0) &&
        <MapView
          provider={PROVIDER_GOOGLE}
          // onRegionChange={e => {
          //   setMpaDalta(e);
          //   // console.log('e---onRegionChange', e);
          // }}
          ref={mapRef}
          style={[styles.mapContainer, mapContainerView]}
          zoomEnabled
          scrollEnabled={true}
          showsScale
          // mapType={Platform.OS === 'ios' ? 'mutedStandard' : 'terrain'}
          mapType={Platform.OS === 'ios' ? 'standard' : 'standard'}
          customMapStyle={DuuittMapTheme}
          region={mapRegion}
          // initialRegion={mapRegion}
          zoomTapEnabled
          rotateEnabled={false}
          loadingEnabled
          onPress={e => onTouchLocationData(e.nativeEvent.coordinate)}
          onPoiClick={e => onTouchLocationData(e.nativeEvent.coordinate)}
          showsCompass={false}
          // 👇 Set Zoom Limits
          minZoomLevel={10}  // prevent zooming out too far
          maxZoomLevel={18}  // prevent zooming in too much
          showsUserLocation={true}   // 👈 shows blue dot
          followsUserLocation={true} // 👈 map follows the user as they move
          // Performance optimizations
          showsBuildings={false}
          showsTraffic={false}
          showsIndoors={false}
          showsMyLocationButton={false}
          toolbarEnabled={false}
          onMapReady={handleMapReady}>
          {animatedCoordinate?.latitude && animatedCoordinate?.longitude && (
            <Marker.Animated
              ref={markerRef}
              coordinate={animatedCoordinate}
              tracksViewChanges={!isMapReady}
            >
              <Image
                resizeMode="contain"
                source={appImages.markerImage}
                style={styles.markerImage}
              />

            </Marker.Animated>
          )}
          {/* {mapRegion?.latitude?.toString()?.length > 0 &&
            mapRegion?.longitude?.toString()?.length > 0 && (
              <Marker
                coordinate={{
                  latitude: Number(mapRegion?.latitude),
                  longitude: Number(mapRegion?.longitude),
                }}
                tracksViewChanges={!isMapReady}>
                <Image
                  resizeMode="contain"
                  source={appImages.markerImage}
                  style={styles.markerImage}
                />
              </Marker>
            )} */}
        </MapView>}
      {isMapReady == false && (
        // <View style={{position: 'absolute'}}>
        <AnimatedLoader
          absolute={'relative'}
          type={'homeMapLoader'}
          height={height}
        />
        // </View>
      )}
    </View>
  );
};

export default React.memo(MapCurrentLocationRoute);

const styles = StyleSheet.create({
  homeSubContainer: {
    alignItems: 'flex-start',
    justifyContent: 'center',
    overflow: 'hidden',
    shadowRadius: 1,
    shadowOffset: { height: 2, width: 0 },
  },
  mapContainer: {
    alignSelf: 'center',
    height: hp('35%'),
    width: wp('100%'),
    overflow: 'hidden',
  },
  markerImage: {
    height: 30,
    width: 30,
    marginTop: Platform.OS === 'ios' ? '25%' : 0,
  },
});











// import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
// import { StyleSheet, View, Image, Platform } from 'react-native';
// import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
// import { appImages } from '../commons/AppImages';
// import MapView, { Marker, PROVIDER_GOOGLE, AnimatedRegion } from 'react-native-maps';
// import AnimatedLoader from './AnimatedLoader/AnimatedLoader';
// import { getMpaDalta } from './GeoCodeAddress';
// import { getCurrentLocation } from './GetAppLocation';
// import { useFocusEffect } from '@react-navigation/native';

// // Constants outside component to prevent recreation
// const DEFAULT_REGION = {
//   latitude: 30.7400,
//   longitude: 76.7900,
//   latitudeDelta: 0.0322,
//   longitudeDelta: 0.0321,
// };

// const MapCurrentLocationRoute = React.memo(({
//   mapContainerView,
//   origin,
//   isPendingReq,
//   onTouchLocation,
//   height,
// }) => {
//   const mapRef = useRef(null);
//   const markerRef = useRef(null);
//   const timeoutRef = useRef(null);
//   const [isMapReady, setIsMapReady] = useState(false);

//   // Memoized map region to prevent unnecessary re-renders
//   const mapRegion = useMemo(() => {
//     if (origin?.lat && origin?.lng) {
//       return {
//         latitude: Number(origin.lat),
//         longitude: Number(origin.lng),
//         ...getMpaDalta(),
//       };
//     }
//     return {
//       latitude: getCurrentLocation()?.latitude || DEFAULT_REGION.latitude,
//       longitude: getCurrentLocation()?.longitude || DEFAULT_REGION.longitude,
//       ...getMpaDalta(),
//     };
//   }, [origin?.lat, origin?.lng]);

//   // Memoized animated coordinate
//   const animatedCoordinate = useMemo(() => {
//     return new AnimatedRegion({
//       latitude: mapRegion.latitude ?? getCurrentLocation()?.latitude ?? DEFAULT_REGION.latitude,
//       longitude: mapRegion.longitude ?? getCurrentLocation()?.longitude ?? DEFAULT_REGION.longitude,
//       ...getMpaDalta(),
//     });
//   }, [mapRegion.latitude, mapRegion.longitude, origin?.lat, origin?.lng]);

//   // Single optimized useEffect for origin changes
//   useEffect(() => {
//     if (origin?.lat && origin?.lng && mapRef?.current) {
//       const newCoord = {
//         latitude: Number(origin.lat) ?? getCurrentLocation()?.latitude ?? DEFAULT_REGION.latitude,
//         longitude: Number(origin.lng) ?? getCurrentLocation()?.longitude ?? DEFAULT_REGION.longitude,
//         ...getMpaDalta(),
//       };

//       // Clear any existing timeout
//       if (timeoutRef.current) {
//         clearTimeout(timeoutRef.current);
//       }

//       // Set timeout for delayed animation
//       timeoutRef.current = setTimeout(() => {
//         // Animate marker
//         animatedCoordinate.timing({
//           latitude: newCoord.latitude,
//           longitude: newCoord.longitude,
//           duration: 500,
//           useNativeDriver: false,
//         }).start();

//         // Animate map camera
//         if (mapRef?.current) {
//           mapRef.current.animateToRegion(newCoord, 1000);
//         }
//       }, 1000); // Reduced from 5 seconds to 1 second for better UX
//     } else {
//       animatedCoordinate.timing({
//         latitude: getCurrentLocation()?.latitude ?? DEFAULT_REGION.latitude,
//         longitude: getCurrentLocation()?.latitude ?? DEFAULT_REGION.longitude,
//         duration: 500,
//         useNativeDriver: false,
//       }).start();
//     }
//     // Cleanup timeout on unmount or origin change
//     return () => {
//       if (timeoutRef.current) {
//         clearTimeout(timeoutRef.current);
//       }
//     };
//   }, [origin?.lat, origin?.lng, animatedCoordinate]);

//   // Optimized touch location handler
//   const onTouchLocationData = useCallback((coordinate) => {
//     onTouchLocation(coordinate);
//   }, [onTouchLocation]);

//   // Optimized map ready handler
//   const handleMapReady = useCallback(() => {
//     setIsMapReady(true);
//   }, []);

//   // Cleanup on unmount
//   useEffect(() => {
//     return () => {
//       if (timeoutRef.current) {
//         clearTimeout(timeoutRef.current);
//       }
//     };
//   }, []);

//   // Memoized map props to prevent unnecessary re-renders
//   const mapProps = useMemo(() => ({
//     provider: PROVIDER_GOOGLE,
//     ref: mapRef,
//     style: [styles.mapContainer, mapContainerView],
//     zoomEnabled: true,
//     scrollEnabled: true,
//     showsScale: true,
//     mapType: Platform.OS === 'ios' ? 'mutedStandard' : 'standard', // Changed from 'terrain' for better performance
//     region: mapRegion,
//     zoomTapEnabled: true,
//     rotateEnabled: true,
//     loadingEnabled: true,
//     onPress: (e) => onTouchLocationData(e.nativeEvent.coordinate),
//     onPoiClick: (e) => onTouchLocationData(e.nativeEvent.coordinate),
//     showsCompass: false,
//     showsUserLocation: false,
//     followsUserLocation: false,
//     // Performance optimizations
//     showsBuildings: false,
//     showsTraffic: false,
//     showsIndoors: false,
//     showsMyLocationButton: false,
//     toolbarEnabled: false,
//     onMapReady: handleMapReady,
//   }), [mapRegion, mapContainerView, onTouchLocationData, handleMapReady]);

//   // Memoized marker
//   const marker = useMemo(() => (
//     // animatedCoordinate?.latitude && animatedCoordinate?.longitude && (
//     <Marker.Animated
//       ref={markerRef}
//       coordinate={animatedCoordinate}
//       tracksViewChanges={!isMapReady}
//     >
//       <Image
//         resizeMode="contain"
//         source={appImages.markerImage}
//         style={styles.markerImage}
//       />
//     </Marker.Animated>
//     // )
//   ), [animatedCoordinate, isMapReady]);

//   // Memoized loader
//   const loader = useMemo(() => (
//     !isMapReady && (
//       <AnimatedLoader
//         absolute="relative"
//         type="homeMapLoader"
//         height={height}
//       />
//     )
//   ), [isMapReady, height]);

//   // Only render map when coordinates are valid
//   if (!mapRegion?.latitude || !mapRegion?.longitude) {
//     return (
//       <View style={styles.homeSubContainer}>
//         {loader}
//       </View>
//     );
//   }

//   return (
//     <View
//       pointerEvents={isPendingReq ? 'none' : 'auto'}
//       style={styles.homeSubContainer}
//     >
//       <MapView {...mapProps}>
//         {marker}
//       </MapView>
//       {loader}
//     </View>
//   );
// });

// MapCurrentLocationRoute.displayName = 'MapCurrentLocationRoute';

// export default MapCurrentLocationRoute;

// const styles = StyleSheet.create({
//   homeSubContainer: {
//     alignItems: 'flex-start',
//     justifyContent: 'center',
//     overflow: 'hidden',
//     shadowRadius: 1,
//     shadowOffset: { height: 2, width: 0 },
//   },
//   mapContainer: {
//     alignSelf: 'center',
//     height: hp('35%'),
//     width: wp('100%'),
//     overflow: 'hidden',
//   },
//   markerImage: {
//     height: 30,
//     width: 30,
//     marginTop: Platform.OS === 'ios' ? '25%' : 0,
//   },
// });






