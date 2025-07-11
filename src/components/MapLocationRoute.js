// import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
// import {
//   StyleSheet,
//   View,
//   Image,
//   Platform,
//   Dimensions,
//   Text,
//   Alert,
// } from 'react-native';
// import {
//   heightPercentageToDP as hp,
//   widthPercentageToDP as wp,
// } from 'react-native-responsive-screen';
// import { appImages } from '../commons/AppImages';
// import MapView, { Marker, Polygon, Polyline, PROVIDER_GOOGLE, AnimatedRegion } from 'react-native-maps';
// import AnimatedLoader from './AnimatedLoader/AnimatedLoader';
// import { getMpaDalta, setMpaDalta } from './GeoCodeAddress';
// import { colors } from '../theme/colors';
// import { useFocusEffect } from '@react-navigation/native';
// import { getCurrentLocation } from './GetAppLocation';

// let currentLocation = {
//   lat: 30.7400,
//   lng: 76.7900,
// };

// const MapLocationRoute = ({
//   mapContainerView,
//   origin,
//   isPendingReq,
//   onTouchLocation,
//   height,
// }) => {
//   const mapRef = useRef(null);
//   const markerRef = useRef(null);
//   const debounceTimeout = useRef(null);
//   const [mapRegion, setMapRegion] = useState({
//     latitude: Number(origin?.lat) || getCurrentLocation()?.latitude || 30.7400,
//     longitude: Number(origin?.lng) || getCurrentLocation()?.longitude || 76.7900,
//     ...getMpaDalta(),
//     //   latitudeDelta: getMpaDalta().latitudeDelta,
//     //   longitudeDelta: getMpaDalta().longitudeDelta,
//   });
//   const [isMapReady, setIsMapReady] = useState(false);

//   const [animatedCoordinate] = useState(
//     new AnimatedRegion({
//       latitude: Number(origin?.lat) || null,
//       longitude: Number(origin?.lng) || null,
//       ...getMpaDalta(),
//       //     latitudeDelta: getMpaDalta().latitudeDelta,
//       //     longitudeDelta: getMpaDalta().longitudeDelta,
//     })
//   );



//   console.log('origin---11', origin, mapRegion);
//   const mohaliChandigarhBounds = {
//     north: 30.8258,
//     south: 30.6600,
//     west: 76.6600,
//     east: 76.8500,
//   };

//   const isWithinBounds = (latitude, longitude) => {
//     return (
//       latitude <= mohaliChandigarhBounds.north &&
//       latitude >= mohaliChandigarhBounds.south &&
//       longitude >= mohaliChandigarhBounds.west &&
//       longitude <= mohaliChandigarhBounds.east
//     );
//   };

//   const handleRegionChangeComplete = (region) => {
//     console.log('Updated region:', region);
//     // if (!isWithinBounds(region.latitude, region.longitude)) {
//     //   // Recenter map if user tries to go out of bounds
//     // mapRef.current?.animateToRegion({
//     //   latitude: Number(mapRegion?.latitude) ?? 30.7400,
//     //   longitude: Number(mapRegion?.longitude) ?? 76.7900,
//     //   latitudeDelta: getMpaDalta().latitudeDelta,
//     //   longitudeDelta: getMpaDalta().longitudeDelta,
//     // });
//     //   Alert.alert("Restricted Area", "You can only explore within Mohali & Chandigarh.");
//     // }

//     if (debounceTimeout.current) {
//       clearTimeout(debounceTimeout.current);
//     }

//     debounceTimeout.current = setTimeout(() => {
//       if (!isWithinBounds(region.latitude, region.longitude)) {
//         mapRef.current?.animateToRegion({
//           latitude: Number(30.7400 ?? mapRegion?.latitude) ?? 30.7400,
//           longitude: Number(76.7900 ?? mapRegion?.longitude) ?? 76.7900,
//           latitudeDelta: getMpaDalta().latitudeDelta,
//           longitudeDelta: getMpaDalta().longitudeDelta,
//         });
//         Alert.alert("Restricted Area", "You can only explore within Mohali & Chandigarh.");
//       }
//     }, 2000); // Delay in milliseconds


//   };

//   // Update region when origin changes

//   useEffect(() => {
//     if (origin?.lat && origin?.lng) {
//       const newCoord = {
//         latitude: Number(origin.lat),
//         longitude: Number(origin.lng),
//       };

//       currentLocation = newCoord;

//       setMapRegion({
//         ...newCoord,
//         ...getMpaDalta(),
//       });

//       animatedCoordinate.timing({
//         ...newCoord,
//         duration: Platform.OS == 'ios'? 1:100,
//         useNativeDriver: false,
//       }).start();

//       if (mapRef.current) {
//         mapRef.current.animateToRegion(
//           {
//             ...newCoord,
//             ...getMpaDalta(),
//           },
//           2000
//         );
//       }
//     }
//   }, [origin, isMapReady]);

//   // useEffect(() => {
//   //   if (origin) {
//   //     // currentLocation = origin;
//   //     currentLocation = {
//   //       lat: getLocation('lat') ?? origin?.lat ?? currentLocation?.lat,
//   //       lng: getLocation('lng') ?? origin?.lng ?? currentLocation?.lng,
//   //     }

//   //     setMapRegion(prev => ({
//   //       ...prev,
//   //       latitude: origin?.lat?.toString()?.length > 0
//   //         ? Number(origin?.lat)
//   //         : Number(currentLocation?.lat),
//   //       longitude: origin?.lat?.toString()?.length > 0
//   //         ? Number(origin?.lng)
//   //         : Number(currentLocation?.lng),
//   //       latitudeDelta: getMpaDalta().latitudeDelta,
//   //       longitudeDelta: getMpaDalta().longitudeDelta,
//   //     }));

//   //     const lat = Number(origin?.lat);
//   //     const lng = Number(origin?.lng);
//   //     const newCoord = { latitude: lat, longitude: lng };

//   //     animatedCoordinate.timing({
//   //       ...newCoord,
//   //       duration: 500,
//   //       useNativeDriver: false,
//   //     }).start();

//   //     if (mapRef?.current) {
//   //       mapRef?.current.animateToRegion({
//   //         latitude: origin && origin?.lat?.toString()?.length > 0 ? Number(origin?.lat) : Number(currentLocation?.lat),
//   //         longitude: origin && origin?.lat?.toString()?.length > 0 ? Number(origin?.lng) : Number(currentLocation?.lng),
//   //         latitudeDelta: getMpaDalta().latitudeDelta,
//   //         longitudeDelta: getMpaDalta().longitudeDelta,
//   //       }, 2000); // smooth zoom
//   //     }
//   //   }
//   // }, [origin, isMapReady]);


//   // useEffect(() => {
//   //   setTimeout(() => {
//   //     setIsMapReady(currentLocation?.lat?.toString()?.length > 0 ? true : false)
//   //   }, 300)
//   // }, [currentLocation,origin])

//   // const onTouchLocationData = useCallback(
//   //   coordinate => {
//   //     // console.log('coordinate---', coordinate);
//   //     if (debounceTimeout.current) {
//   //       clearTimeout(debounceTimeout.current);
//   //     }
//   //     debounceTimeout.current = setTimeout(() => {
//   //       if (!isWithinBounds(coordinate.latitude, coordinate.longitude)) {
//   //         mapRef.current?.animateToRegion({
//   //           latitude: Number(30.7400 ?? coordinate?.latitude) ?? 30.7400,
//   //           longitude: Number(76.7900 ?? coordinate?.longitude) ?? 76.7900,
//   //           latitudeDelta: getMpaDalta().latitudeDelta,
//   //           longitudeDelta: getMpaDalta().longitudeDelta,
//   //         });
//   //         Alert.alert("Restricted Area", "You can only explore within Mohali & Chandigarh.");
//   //       } else {
//   //         setMapRegion(prev => ({
//   //           ...prev,
//   //           latitude: Number(coordinate?.latitude),
//   //           longitude: Number(coordinate?.longitude),
//   //           latitudeDelta: getMpaDalta().latitudeDelta,
//   //           longitudeDelta: getMpaDalta().longitudeDelta,
//   //         }));
//   //         // handleRegionChangeComplete(coordinate)
//   //         onTouchLocation(coordinate);
//   //       }
//   //     }, 50); // Delay in milliseconds

//   //   },
//   //   [onTouchLocation],
//   // );

//   const onTouchLocationData = useCallback(
//     coordinate => {
//       // console.log('coordinate---', coordinate)

//       setMapRegion(prev => ({
//         ...prev,
//         latitude: Number(coordinate?.latitude),
//         longitude: Number(coordinate?.longitude),
//         ...getMpaDalta(),
//         // latitudeDelta: getMpaDalta().latitudeDelta,
//         // longitudeDelta: getMpaDalta().longitudeDelta,
//       }));
//       // handleRegionChangeComplete(coordinate)
//       onTouchLocation(coordinate);

//     },
//     [onTouchLocation],
//   );

//   const handleMapReady = () => {
//     // console.log('Map is ready');
//     if (origin?.lat?.toString()?.length > 0
//       // && mapRegion?.latitude?.toString()?.length > 0 
//       && animatedCoordinate?.latitude?.toString()?.length > 0
//     ) {
//       setTimeout(() => {
//         setIsMapReady(true);
//       }, 2000);
//     } else {
//       setTimeout(() => {
//         setIsMapReady(true);
//       }, 5000);
//     }
//   };

//   return (
//     <View
//       pointerEvents={isPendingReq ? 'none' : 'auto'}
//       style={styles.homeSubContainer}>
//       {(mapRegion?.latitude && mapRegion?.latitude?.toString()?.length > 0 &&
//         mapRegion?.longitude && mapRegion?.longitude?.toString()?.length > 0) &&
//         <MapView
//           provider={PROVIDER_GOOGLE}
//           onRegionChange={e => {
//             setMpaDalta(e);
//             // console.log('e---onRegionChange', e);
//             // handleRegionChangeComplete(e);
//           }}
//           ref={mapRef}
//           style={[styles.mapContainer, mapContainerView]}
//           zoomEnabled
//           scrollEnabled={true}
//           showsScale
//           mapType={Platform.OS === 'ios' ? 'mutedStandard' : 'terrain'}
//           // initialRegion={mapRegion}
//           region={mapRegion}
//           zoomTapEnabled
//           rotateEnabled
//           loadingEnabled
//           showsCompass={false}
//           showsUserLocation={false}
//           followsUserLocation={false}
//           onMapReady={handleMapReady}
//           onPress={e => onTouchLocationData(e.nativeEvent.coordinate)}
//           onPoiClick={e => onTouchLocationData(e.nativeEvent.coordinate)}
//         >
//           {/* {(mapRegion?.latitude?.toString()?.length > 0 &&
//             mapRegion?.longitude?.toString()?.length > 0) && ( 
//              <Marker
//               coordinate={{
//                 latitude: Number(mapRegion?.latitude),
//                 longitude: Number(mapRegion?.longitude),
//               }}
//               tracksViewChanges={!isMapReady}
//             >
//               <Image
//                 resizeMode="contain"
//                 source={appImages.markerImage}
//                 style={styles.markerImage}
//               />
//             </Marker>
//              )} */}

//           {animatedCoordinate?.latitude && animatedCoordinate?.longitude && (
//             <Marker.Animated
//               ref={markerRef}
//               coordinate={animatedCoordinate}
//               tracksViewChanges={!isMapReady}
//             >
//               <Image
//                 resizeMode="contain"
//                 source={appImages.markerImage}
//                 style={styles.markerImage}
//               />

//             </Marker.Animated>


//           )}

//           {/* <Polygon
//           coordinates={[
//             // { latitude: 30.8258, longitude: 76.6600 }, // NW
//             // { latitude: 30.8258, longitude: 76.8500 }, // NE
//             // { latitude: 30.6600, longitude: 76.8500 }, // SE
//             // { latitude: 30.6600, longitude: 76.6600 }, // SW
//             { latitude: 30.8258, longitude: 76.7550 }, // top center
//             { latitude: 30.8100, longitude: 76.8050 },
//             { latitude: 30.7900, longitude: 76.8350 },
//             { latitude: 30.7550, longitude: 76.8500 }, // mid-right
//             { latitude: 30.7200, longitude: 76.8350 },
//             { latitude: 30.6900, longitude: 76.8050 },
//             { latitude: 30.6600, longitude: 76.7550 }, // bottom center
//             { latitude: 30.6750, longitude: 76.7100 },
//             { latitude: 30.7000, longitude: 76.6800 },
//             { latitude: 30.7400, longitude: 76.6600 }, // mid-left
//             { latitude: 30.7800, longitude: 76.6800 },
//             { latitude: 30.8050, longitude: 76.7100 },
//           ]}
//           strokeColor={colors.black}
//           fillColor="rgba(0, 150, 255, 0)"
//           strokeWidth={2}
//         /> */}
//         </MapView>
//       }
//       {isMapReady == false && (
//         // <View style={{position: 'absolute'}}>
//         <AnimatedLoader
//           absolute={'relative'}
//           type={'homeMapLoader'}
//           height={height}
//         />
//         // </View>
//       )}
//     </View>
//   );
// };

// export default MapLocationRoute;

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








import React, { useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, View, Image, Platform, Alert } from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { appImages } from '../commons/AppImages';
import { getMpaDalta, setMpaDalta } from './GeoCodeAddress';
import AnimatedLoader from './AnimatedLoader/AnimatedLoader';
import { colors } from '../theme/colors';

const mohaliChandigarhBounds = {
  north: 30.8258,
  south: 30.6600,
  west: 76.6600,
  east: 76.8500,
};

const isWithinBounds = (latitude, longitude) => {
  return (
    latitude <= mohaliChandigarhBounds.north &&
    latitude >= mohaliChandigarhBounds.south &&
    longitude >= mohaliChandigarhBounds.west &&
    longitude <= mohaliChandigarhBounds.east
  );
};

const MapLocationRoute = ({
  mapContainerView,
  origin,
  isPendingReq,
  onTouchLocation,
  height,
}) => {
  const mapRef = useRef(null);
  const debounceTimeout = useRef(null);
  const debounceRef = useRef(null);
  const [mapRegion, setMapRegion] = useState({
    latitude: (origin && Number(origin?.lat)) ? Number(origin?.lat) : 30.7400 ,
    longitude: (origin && Number(origin?.lng)) ?Number(origin?.lng) : 76.7900,
    ...getMpaDalta(),
  });
  const [isMapReady, setIsMapReady] = useState(false);

  useEffect(() => {
    if (origin?.lat && origin?.lng) {
      const newRegion = {
        latitude: Number(origin?.lat),
        longitude: Number(origin?.lng),
        ...getMpaDalta(),
      };
      setTimeout(() => {
        if (mapRegion?.latitude !== newRegion?.latitude) {
          setMapRegion(newRegion);
        }
        if (mapRef?.current && mapRegion?.latitude !== newRegion?.latitude) {
          mapRef.current?.animateToRegion(newRegion, 1000);
        }
      },500)
    }

  }, [origin]);


  // const handleRegionChangeComplete = region => {

  //   setMapRegion(region);
  //   onTouchLocation({
  //     latitude: region?.latitude,
  //     longitude: region?.longitude,
  //   });
  // Optional bounds check
  // if (!isWithinBounds(region?.latitude, region?.longitude)) {
  //   Alert.alert("Restricted Area", "You can only explore within Mohali & Chandigarh.");
  //   const fallbackRegion = {
  //     latitude: 30.7400,
  //     longitude: 76.7900,
  //     ...getMpaDalta(),
  //   };
  //   mapRef.current?.animateToRegion(fallbackRegion, 1000);
  // }
  // };

  const handleRegionChangeComplete = useCallback((region) => {

    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(() => {
      setMapRegion(region);
      onTouchLocation({
        latitude: region?.latitude,
        longitude: region?.longitude,
      });
      // Optional bounds check
      // if (!isWithinBounds(region?.latitude, region?.longitude)) {
      //   Alert.alert("Restricted Area", "You can only explore within Mohali & Chandigarh.");
      //   const fallbackRegion = {
      //     latitude: 30.7400,
      //     longitude: 76.7900,
      //     ...getMpaDalta(),
      //   };
      //   mapRef.current?.animateToRegion(fallbackRegion, 1000);
      // }
    }, Platform.OS == 'ios' ? 50 : 500);
    // Adjust delay if needed
  }, [onTouchLocation]);


  const handleMapReady = () => {
    // console.log('Map is ready');
    if (origin?.lat?.toString()?.length > 0
      && mapRegion?.latitude?.toString()?.length > 0
    ) {
      setIsMapReady(true);
      setTimeout(() => {
        setIsMapReady(true);
      }, 1000);
    } else {
      setTimeout(() => {
        setIsMapReady(true);
      }, 5000);
    }
  };


  //   const onTouchLocationData = useCallback(
  //   coordinate => {
  //     console.log('coordinate---', coordinate)

  //     // setMapRegion(prev => ({
  //     //   ...prev,
  //     //   latitude: Number(coordinate?.latitude),
  //     //   longitude: Number(coordinate?.longitude),
  //     //   ...getMpaDalta(),
  //     //   // latitudeDelta: getMpaDalta().latitudeDelta,
  //     //   // longitudeDelta: getMpaDalta().longitudeDelta,
  //     // }));
  //     // handleRegionChangeComplete(coordinate)
  //     // onTouchLocation(coordinate);

  //   },
  //   [],
  // );


  return (
    <View pointerEvents={isPendingReq ? 'none' : 'auto'} style={styles.homeSubContainer}>
      {/* {(mapRegion?.latitude && mapRegion?.latitude?.toString()?.length > 0 &&
        mapRegion?.longitude && mapRegion?.longitude?.toString()?.length > 0) &&
        <> */}
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={[styles.mapContainer, mapContainerView]}
        initialRegion={mapRegion}
        // region={mapRegion}
        onRegionChange={(e) => { setMpaDalta(e) }}
        onRegionChangeComplete={(e) => { handleRegionChangeComplete(e) }}
        onMapReady={handleMapReady}
        mapType={Platform.OS === 'ios' ? 'mutedStandard' : 'terrain'}
        showsCompass={false}
        showsUserLocation={false}
        followsUserLocation={false}
        loadingEnabled
        zoomEnabled
        scrollEnabled
        rotateEnabled
        zoomTapEnabled
      />

      {/* Static marker overlay */}
      {isMapReady &&
        <Image
          source={appImages.markerImage}
          style={styles.centerMarker}
          resizeMode="contain"
        />}
      {/* </>} */}

      {!isMapReady && (
        <AnimatedLoader absolute="relative" type="homeMapLoader" height={height} />
      )}
    </View>
  );
};

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







// import React, { useCallback, useEffect, useRef, useState } from 'react';
// import {
//   View,
//   StyleSheet,
//   Image,
//   Alert,
//   Platform,
// } from 'react-native';
// import MapView, {
//   Marker,
//   PROVIDER_GOOGLE,
//   AnimatedRegion,
//   MarkerAnimated,
// } from 'react-native-maps';
// import { appImages } from '../commons/AppImages';
// import { getMpaDalta, setMpaDalta } from './GeoCodeAddress';
// import { getCurrentLocation } from './GetAppLocation';

// const MOHALI_CHD_BOUNDS = {
//   north: 30.8258,
//   south: 30.6600,
//   west: 76.6600,
//   east: 76.8500,
// };

// const isWithinBounds = (lat, lng) => (
//   lat <= MOHALI_CHD_BOUNDS.north &&
//   lat >= MOHALI_CHD_BOUNDS.south &&
//   lng >= MOHALI_CHD_BOUNDS.west &&
//   lng <= MOHALI_CHD_BOUNDS.east
// );

// const MapLocationRoute = ({
//   mapContainerView,
//   origin,
//   isPendingReq,
//   onTouchLocation,
// }) => {
//   const mapRef = useRef(null);
//   const markerRef = useRef(null);
//   const debounceTimeout = useRef(null);

//   const [isMapReady, setIsMapReady] = useState(false);
//   const [mapRegion, setMapRegion] = useState({
//     latitude: origin?.lat || getCurrentLocation()?.latitude || 30.7400,
//     longitude: origin?.lng || getCurrentLocation()?.longitude || 76.7900,
//     ...getMpaDalta(),
//   });

//   const [animatedCoordinate] = useState(
//     new AnimatedRegion({
//       latitude: origin?.lat || 30.7400,
//       longitude: origin?.lng || 76.7900,
//       ...getMpaDalta(),
//     })
//   );

//   useEffect(() => {
//     if (origin?.lat && origin?.lng) {
//       const newCoord = {
//         latitude: Number(origin.lat),
//         longitude: Number(origin.lng),
//       };

//       setMapRegion({
//         ...newCoord,
//         ...getMpaDalta(),
//       });

//       animatedCoordinate.timing({
//         ...newCoord,
//         duration: 500,
//         useNativeDriver: false,
//       }).start();

//       if (mapRef.current) {
//         mapRef.current.animateToRegion(
//           {
//             ...newCoord,
//             ...getMpaDalta(),
//           },
//           2000
//         );
//       }
//     }
//   }, [origin]);

//   const onTouchLocationData = useCallback((coordinate) => {
//     const { latitude, longitude } = coordinate;

//     if (debounceTimeout.current) {
//       clearTimeout(debounceTimeout.current);
//     }

//     debounceTimeout.current = setTimeout(() => {
//       if (!isWithinBounds(latitude, longitude)) {
//         Alert.alert("Restricted Area", "You can only explore within Mohali & Chandigarh.");
//         mapRef.current?.animateToRegion({
//           latitude: 30.7400,
//           longitude: 76.7900,
//           ...getMpaDalta(),
//         });
//       } else {
//         setMapRegion({
//           latitude,
//           longitude,
//           ...getMpaDalta(),
//         });
//         onTouchLocation(coordinate);
//       }
//     }, 100); // debounced for quick taps
//   }, [onTouchLocation]);

//   const handleMapReady = () => {
//     setTimeout(() => setIsMapReady(true), 1000);
//   };

//   return (
//     <View pointerEvents={isPendingReq ? 'none' : 'auto'} style={styles.homeSubContainer}>
//       <MapView
//         provider={PROVIDER_GOOGLE}
//         ref={mapRef}
//         style={[styles.mapContainer, mapContainerView]}
//         mapType={Platform.OS === 'ios' ? 'mutedStandard' : 'terrain'}
//         region={mapRegion}
//         zoomEnabled
//         scrollEnabled
//         showsScale
//         zoomTapEnabled
//         rotateEnabled
//         loadingEnabled
//         onMapReady={handleMapReady}
//         onRegionChange={(region) => setMpaDalta(region)}
//         onPress={e => onTouchLocationData(e.nativeEvent.coordinate)}
//         onPoiClick={e => onTouchLocationData(e.nativeEvent.coordinate)}
//       >
//         <Marker.Animated
//           ref={markerRef}
//           coordinate={animatedCoordinate}
//           tracksViewChanges={!isMapReady}
//         >
//           <Image
//             resizeMode="contain"
//             source={appImages.markerImage}
//             style={styles.markerImage}
//           />
//         </Marker.Animated>
//       </MapView>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   homeSubContainer: {
//     flex: 1,
//   },
//   mapContainer: {
//     flex: 1,
//   },
//   markerImage: {
//     width: 40,
//     height: 40,
//   },
// });

// export default MapLocationRoute;


// import React, {useCallback, useEffect, useRef, useState} from 'react';
// import {StyleSheet, View, Image, Platform, Dimensions} from 'react-native';
// import {
//   heightPercentageToDP as hp,
//   widthPercentageToDP as wp,
// } from 'react-native-responsive-screen';
// import {appImages} from '../commons/AppImages';
// import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';

// const {width, height} = Dimensions.get('window');
// const ASPECT_RATIO = width / height;
// const LATITUDE_DELTA = 0.005; // Zoom level (smaller = closer)
// const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

// const MapLocationRoute = ({
//   mapContainerView,
//   origin,
//   isPendingReq,
//   onTouchLocation,
// }) => {
//   const mapRef = useRef(null);
//   const [isMapReady, setIsMapReady] = useState(false);
//   const [mapRegion, setMapRegion] = useState({
//     latitude: origin?.lat ? Number(origin?.lat) : 0,
//     longitude: origin?.lng ? Number(origin?.lng) : 0,
//     latitudeDelta: LATITUDE_DELTA,
//     longitudeDelta: LONGITUDE_DELTA,
//   });

//   // Animate map to origin whenever it changes
//   useEffect(() => {
//     if (origin?.lat && origin?.lng && mapRef?.current) {
//       const newRegion = {
//         latitude: Number(origin.lat),
//         longitude: Number(origin.lng),
//         latitudeDelta: LATITUDE_DELTA,
//         longitudeDelta: LONGITUDE_DELTA,
//       };
//       mapRef.current.animateToRegion(newRegion, 1000); // smooth zoom
//       setMapRegion(newRegion);
//     }
//   }, [origin]);

//   const onTouchLocationData = useCallback(
//     coordinate => {
//       const newRegion = {
//         latitude: Number(coordinate?.latitude),
//         longitude: Number(coordinate?.longitude),
//         latitudeDelta: LATITUDE_DELTA,
//         longitudeDelta: LONGITUDE_DELTA,
//       };
//       if (mapRef.current) {
//         mapRef.current.animateToRegion(newRegion, 1000); // smooth zoom
//       }
//       setMapRegion(newRegion);
//       onTouchLocation(coordinate);
//     },
//     [onTouchLocation],
//   );

//   const handleMapReady = () => {
//     setIsMapReady(true);
//   };

//   return (
//     <View
//       pointerEvents={isPendingReq ? 'none' : 'auto'}
//       style={styles.homeSubContainer}>
//       <MapView
//         provider={PROVIDER_GOOGLE}
//         ref={mapRef}
//         style={[styles.mapContainer, mapContainerView]}
//         zoomEnabled
//         scrollEnabled
//         showsScale
//         mapType={Platform.OS === 'ios' ? 'mutedStandard' : 'terrain'}
//         initialRegion={mapRegion} // use initialRegion instead of region
//         zoomTapEnabled
//         rotateEnabled
//         loadingEnabled
//         onMapReady={handleMapReady}
//         onPress={e => onTouchLocationData(e.nativeEvent.coordinate)}
//         onPoiClick={e => onTouchLocationData(e.nativeEvent.coordinate)}
//         showsCompass>
//         {mapRegion?.latitude && mapRegion?.longitude && (
//           <Marker
//             coordinate={{
//               latitude: Number(mapRegion.latitude),
//               longitude: Number(mapRegion.longitude),
//             }}
//             tracksViewChanges={!isMapReady}
//             useLegacyPinView={true}>
//             <Image
//               resizeMode="contain"
//               source={appImages.markerImage}
//               style={styles.markerImage}
//             />
//           </Marker>
//         )}
//       </MapView>
//     </View>
//   );
// };

// export default React.memo(MapLocationRoute);

// const styles = StyleSheet.create({
//   homeSubContainer: {
//     alignItems: 'flex-start',
//     justifyContent: 'center',
//     overflow: 'hidden',
//     shadowRadius: 1,
//     shadowOffset: {height: 2, width: 0},
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

// import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
// import {StyleSheet, View, Image, Platform, Dimensions} from 'react-native';
// import {
//   heightPercentageToDP as hp,
//   widthPercentageToDP as wp,
// } from 'react-native-responsive-screen';
// import {appImages} from '../commons/AppImages';
// import MapView, {Marker, Polyline, PROVIDER_GOOGLE} from 'react-native-maps';

// const {width, height} = Dimensions.get('window');
// const ASPECT_RATIO = width / height;
// const LATITUDE_DELTA = 0.0922;
// const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

// const MapLocationRoute = ({mapContainerView, origin,isPendingReq,onTouchLocation}) => {
//   const mapRef = useRef(null);
//   const [lat, setLat] = useState(origin?.lat ? Number(origin?.lat) : null);
//   const [long, setLong] = useState(
//     origin?.lng ? Number(origin?.lng) :null,
//   );
//   const [delta ,setDelta]=useState({
//     latitudeDelta: LATITUDE_DELTA,
//     longitudeDelta: LONGITUDE_DELTA,
//   })

//   // Update latitude and longitude based on origin
//   useEffect(() => {
//     console.log('origin--',origin);
//     if (Object?.keys(origin || {})?.length > 0) {
//       setLat(Number(origin?.lat));
//       setLong(Number(origin?.lng));
//     }
//   }, [origin]);

//   const region = useMemo(
//     () => ({
//       latitude: lat,
//       longitude: long,
//       latitudeDelta:delta?.latitudeDelta,
//       longitudeDelta:delta?.longitudeDelta,
//     }),
//     [lat, long,delta],
//   );

//     const handleRegionChangeComplete = (region) => {
//       console.log("Updated region:", region);
//       setTimeout(()=>{
//         setDelta({
//           latitudeDelta: region?.latitudeDelta,
//           longitudeDelta: region?.longitudeDelta,
//         },5000)
//       })

//     };

//     const onTouchLocationData =(coordinate)=>{
//         setLong(Number(coordinate?.longitude))
//         setLat(Number(coordinate?.latitude))
//         onTouchLocation(coordinate)
//     }

//   return (
//     <View
//       pointerEvents={isPendingReq ? 'none' : 'auto'}
//       style={styles.homeSubContainer}>
//       <MapView
//         provider={PROVIDER_GOOGLE}
//         ref={mapRef}
//         style={[styles.mapContainer, mapContainerView]}
//         zoomEnabled
//         scrollEnabled={false}
//         showsScale
//         mapType={Platform.OS === 'ios' ? 'mutedStandard' : 'terrain'}
//         region={region}
//         zoomTapEnabled
//         rotateEnabled
//         loadingEnabled
//         onRegionChangeComplete={handleRegionChangeComplete} // Listen for zoom changes
//         onPress={(e) =>{
//            console.log('e.nativeEvent',e.nativeEvent)
//            const coordinate =e.nativeEvent?.coordinate
//             onTouchLocationData(coordinate)
//       }}

//       onPoiClick={(e) =>{
//         console.log('e.nativeEvent onPoiClick',e.nativeEvent)
//         const coordinate =e.nativeEvent?.coordinate
//         onTouchLocationData(coordinate)
//    }}
//   //  onPanDrag={(e) =>{
//   //       console.log('e.nativeEvent onPanDrag',e.nativeEvent)
//   //       const coordinate =e.nativeEvent?.coordinate
//   //       setTimeout(()=>{
//   //         setLong(Number(coordinate?.longitude))
//   //         setLat(Number(coordinate?.latitude))
//   //       },500)
//   //  }}

//         showsCompass>
//         {/* Origin Marker */}
//          {origin?.lat && origin?.lng && (
//         <Marker
//           key={`origin-${lat}-${long}`} // Add key prop to prevent flickering
//           coordinate={{latitude: lat, longitude: long}}>
//           <Image
//             resizeMode="contain"
//             source={appImages.markerImage}
//             style={styles.markerImage}
//           />
//         </Marker>)}
//       </MapView>
//     </View>
//   );
// };

// export default MapLocationRoute;

// const styles = StyleSheet.create({
//   homeSubContainer: {
//     alignItems: 'flex-start',
//     justifyContent: 'center',
//     overflow: 'hidden',
//     shadowRadius: 1,
//     shadowOffset: {height: 2, width: 0},
//   },
//   mapContainer: {
//     alignSelf: 'center',
//     height: hp('35%'),
//     width: wp('100%'),
//     overflow: 'hidden',
//   },
//   markerImage: {
//     height: 35,
//     width: 35,
//     marginTop: Platform.OS === 'ios' ? '25%' : 0,
//   },
// });
