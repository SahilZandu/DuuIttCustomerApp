// import React, {
//   memo,
//   useCallback,
//   useEffect,
//   useMemo,
//   useRef,
//   useState,
// } from 'react';
// import { StyleSheet, View, Image, Platform, Dimensions, Alert } from 'react-native';
// import {
//   heightPercentageToDP as hp,
//   widthPercentageToDP as wp,
// } from 'react-native-responsive-screen';
// import { appImages } from '../commons/AppImages';
// import MapView, { Marker, AnimatedRegion, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
// import PolylineDecoder from '@mapbox/polyline';
// import { colors } from '../theme/colors';
// import { getMapManageRideDalta, setMapManageRideDalta, setMapManageRideDaltaInitials, setMpaDalta, } from './GeoCodeAddress';
// import { useFocusEffect } from '@react-navigation/native';
// import { getDistance } from 'geolib';

// const API_KEY = 'AIzaSyAGYLXByGkajbYglfVPK4k7VJFOFsyS9EA'; // Add your Google Maps API key here

// const MapRoute = ({ mapContainerView, origin, destination, isPendingReq }) => {
//   const mapRef = useRef(null);
//   const bearingRef = useRef(0);
//   const debounceTimeout = useRef(null);
//   const markerRef = useRef(null);
//   const markerDesRef = useRef(null);
//   const hasAnimatedOnce = useRef(false);

//   useFocusEffect(
//     useCallback(() => {
//       setMapManageRideDaltaInitials();
//       // const distance = getDistance(
//       //   { latitude: Number(origin?.lat), longitude: Number(origin?.lng) },
//       //   { latitude: Number(destination?.lat), longitude: Number(destination?.lng) }
//       // );
//       // console.log(`Distance: ${distance} meters`);
//     }, [origin])
//   )
//   const [destinationLocation, setDestinationLocation] = useState({
//     lat: null,
//     lng: null,
//   });
//   const [coords, setCoords] = useState([]);
//   // const [region, setRegion] = useState({
//   const [mapRegion, setMapRegion] = useState({
//     latitude: Number(origin?.lat) || 30.7400,
//     longitude: Number(origin?.lng) || 76.7900,
//     ...getMapManageRideDalta(getDistance(
//       { latitude: Number(origin?.lat), longitude: Number(origin?.lng) },
//       { latitude: Number(destination?.lat), longitude: Number(destination?.lng) }
//     )),
//   });

//   const [isMapReady, setIsMapReady] = useState(false);
//   const [animatedCoordinate] = useState(
//     new AnimatedRegion({
//       latitude: Number(origin?.lat) || null,
//       longitude: Number(origin?.lng) || null,
//       ...getMapManageRideDalta(
//         getDistance(
//           { latitude: Number(origin?.lat), longitude: Number(origin?.lng) },
//           { latitude: Number(destination?.lat), longitude: Number(destination?.lng) }
//         )
//       ),
//     })
//   );

//   const [animatedDesCoordinate] = useState(
//     new AnimatedRegion({
//       latitude: Number(destination?.lat) || null,
//       longitude: Number(destination?.lng) || null,
//       ...getMapManageRideDalta(getDistance(
//         { latitude: Number(origin?.lat), longitude: Number(origin?.lng) },
//         { latitude: Number(destination?.lat), longitude: Number(destination?.lng) }
//       )
//       ),
//     })
//   );

//   // const mohaliChandigarhBounds = {
//   //   north: 30.8258,
//   //   south: 30.6600,
//   //   west: 76.6600,
//   //   east: 76.8500,
//   // };

//   // const isWithinBounds = (latitude, longitude) => {
//   //   return (
//   //     latitude <= mohaliChandigarhBounds.north &&
//   //     latitude >= mohaliChandigarhBounds.south &&
//   //     longitude >= mohaliChandigarhBounds.west &&
//   //     longitude <= mohaliChandigarhBounds.east
//   //   );
//   // };

//   // const handleRegionChangeComplete = (region) => {
//   //   if (debounceTimeout.current) {
//   //     clearTimeout(debounceTimeout.current);
//   //   }

//   //   debounceTimeout.current = setTimeout(() => {
//   //     if (!isWithinBounds(region.latitude, region.longitude)) {
//   //       mapRef.current?.animateToRegion({
//   //         latitude: Number(30.7400 ?? mapRegion?.latitude) ?? 30.7400,
//   //         longitude: Number(76.7900 ?? mapRegion?.longitude) ?? 76.7900,
//   //         latitudeDelta: getMpaDalta().latitudeDelta,
//   //         longitudeDelta: getMpaDalta().longitudeDelta,
//   //       });
//   //       Alert.alert("Restricted Area", "You can only explore within Mohali & Chandigarh.");
//   //     }
//   //   }, 50); // Delay in milliseconds


//   // };


//   // Update latitude and longitude based on origin
//   useEffect(() => {
//     console.log('origin--MapRoute', origin, destination);
//     if (Object?.keys(origin || {})?.length > 0 && mapRef?.current) {
//       const newRegion = {
//         latitude: Number(origin?.lat) || 30.7400,
//         longitude: Number(origin?.lng) || 76.7900,
//         ...getMapManageRideDalta(getDistance(
//           { latitude: Number(origin?.lat), longitude: Number(origin?.lng) },
//           { latitude: Number(destination?.lat), longitude: Number(destination?.lng) }
//         )),
//       };
//       if (mapRegion?.latitude !== newRegion?.latitude) {
//         setMapRegion(newRegion);
//       }

//       // // Only animate the first time
//       // if (!hasAnimatedOnce?.current && mapRef?.current) {
//       //   mapRef?.current?.animateToRegion(newRegion, 1000);
//       //   hasAnimatedOnce.current = true; // Prevent further automatic animations
//       // }

//       if (mapRef?.current) {
//         mapRef?.current?.animateToRegion(newRegion, 1000);
//       }
//     }
//   }, [origin, destination]);

//   useEffect(() => {
//     let intervalId;
//     if (origin && origin?.lat && origin?.lng) {
//       const newRegion = {
//         latitude: Number(origin.lat) || 30.7076,
//         longitude: Number(origin.lng) || 76.7151,
//         ...getMapManageRideDalta(
//           getDistance(
//             { latitude: Number(origin?.lat), longitude: Number(origin?.lng) },
//             { latitude: Number(destination?.lat), longitude: Number(destination?.lng) }
//           )
//         ),
//       };
//       if (mapRegion?.latitude !== newRegion?.latitude) {
//         setMapRegion(newRegion);
//       }
//       intervalId = setTimeout(() => {
//         if (mapRegion?.latitude !== newRegion?.latitude) {
//           setMapRegion(newRegion);
//         }
//         // if (mapRef?.current) {
//         //   mapRef?.current?.animateToRegion(newRegion, 1000);
//         // }
//       }, 5000); // 5 seconds
//     }

//     // Cleanup interval on unmount or origin change
//     return () => {
//       if (intervalId) {
//         clearTimeout(intervalId);
//       }
//     };
//   }, [coords]);


//   useEffect(() => {
//     if ((coords?.length > 1 && mapRef?.current && !hasAnimatedOnce?.current)) {
//       const edgePadding = {
//         top: 30,
//         right: 20,
//         bottom: 10, // 👈 Increase bottom padding significantly
//         left: 20,
//       };
//       mapRef?.current.fitToCoordinates(coords, {
//         edgePadding,
//         animated: true,
//       });

//       hasAnimatedOnce.current = true; // Prevent further automatic animations
//       // Optional: second adjustment after a delay

//       const timeout = setTimeout(() => {
//         mapRef?.current?.fitToCoordinates(coords, {
//           edgePadding,
//           animated: true,
//         });
//       }, 6000);
//       return () => clearTimeout(timeout);

//     }

//   }, [coords]);



//   // const originMarker = useMemo(
//   //   () => ({
//   //     latitude: Number(origin?.lat),
//   //     longitude: Number(origin?.lng),
//   //   }),
//   //   [origin],
//   // );

//   // const destinationMarker = useMemo(
//   //   () => ({
//   //     latitude: Number(destinationLocation?.lat),
//   //     longitude: Number(destinationLocation?.lng),
//   //   }),
//   //   [destinationLocation],
//   // );

//   const handleMapReady = () => {
//     // console.log('Map is ready');
//     if (
//       animatedDesCoordinate?.latitude?.toString()?.length > 0 &&
//       animatedCoordinate?.latitude?.toString()?.length > 0
//     ) {
//       setTimeout(() => {
//         setIsMapReady(true);
//       }, 300);
//     } else {
//       setTimeout(() => {
//         setIsMapReady(true);
//       }, 1000);
//     }
//   };

//   const getBearing = (start, end) => {
//     const lat1 = (start.lat * Math.PI) / 180;
//     const lon1 = (start.lng * Math.PI) / 180;
//     const lat2 = (end.lat * Math.PI) / 180;
//     const lon2 = (end.lng * Math.PI) / 180;
//     const dLon = lon2 - lon1;
//     const y = Math.sin(dLon) * Math.cos(lat2);
//     const x =
//       Math.cos(lat1) * Math.sin(lat2) -
//       Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);

//     const bearing = Math.atan2(y, x);
//     const bearingDeg = (bearing * 180) / Math.PI;
//     return (bearingDeg + 360) % 360;
//   };

//   useEffect(() => {
//     if (!origin || !destination || !mapRef?.current) return;

//     // Ensure lat/lng are numbers
//     const lat = Number(origin?.lat);
//     const lng = Number(origin?.lng);
//     const destLat = Number(destination?.lat);
//     const destLng = Number(destination?.lng);

//     const newCoord = { latitude: lat, longitude: lng };
//     const newDesCoord = { latitude: destLat, longitude: destLng };
//     animatedCoordinate.timing({
//       ...newCoord,
//       duration: 500,
//       useNativeDriver: false,
//     }).start();


//     animatedDesCoordinate.timing({
//       ...newDesCoord,
//       duration: 500,
//       useNativeDriver: false,
//     }).start();


//     setTimeout(() => {
//       mapRef.current?.animateToRegion({
//         ...newCoord,
//         // latitudeDelta: 0.0322,
//         // longitudeDelta: 0.0321,
//       }, 500);
//     }, Platform.OS === 'ios' ? 100 : 0);

//     // If any value is NaN, don't proceed
//     if (isNaN(lat) || isNaN(lng) || isNaN(destLat) || isNaN(destLng)) return;
//     // const timeout = setInterval(() => {
//     const timeout = setTimeout(() => {
//       const bearing = getBearing({ lat, lng }, { lat: destLat, lng: destLng });

//       const camera = {
//         center: {
//           latitude: lat,
//           longitude: lng,
//         },
//         // heading: bearing || 0,
//         heading: bearingRef.current || bearing, // Keep the same heading
//         pitch: 30,
//         zoom: 17,
//         altitude: 300,
//       };
//       if (mapRef?.current) {
//         mapRef.current.animateCamera(camera, { duration: 1000 });
//       }
//     }, 60000);

//     // return () => clearInterval(timeout);
//     return () => clearTimeout(timeout);

//   }, [origin, destination]);




//   // useEffect(() => {
//   //   if (!origin || !destination || !mapRef.current) return;

//   //   // Ensure lat/lng are numbers
//   //   const lat = Number(origin?.lat);
//   //   const lng = Number(origin?.lng);
//   //   const destLat = Number(destination?.lat);
//   //   const destLng = Number(destination?.lng);

//   //   // If any value is NaN, don't proceed
//   //   if (isNaN(lat) || isNaN(lng) || isNaN(destLat) || isNaN(destLng)) return;
//   //   const timeout = setTimeout(() => {
//   //     const bearing = getBearing({lat, lng}, {lat: destLat, lng: destLng});

//   //     const camera = {
//   //       center: {
//   //         latitude: lat,
//   //         longitude: lng,
//   //       },
//   //       // heading: bearing || 0,
//   //       heading: bearingRef.current || bearing, // Keep the same heading
//   //       pitch: 30,
//   //       zoom: 17,
//   //       altitude: 300,
//   //     };
//   //     if (mapRef.current) {
//   //       mapRef.current.animateCamera(camera, {duration: 1000});
//   //     }
//   //   }, 2000);

//   //   return () => clearTimeout(timeout);
//   // }, [origin, destination]);

//   // Fetch and set route only when both origin and destination are defined

//   useEffect(() => {
//     if (
//       origin &&
//       origin?.lat &&
//       origin?.lng &&
//       destination &&
//       destination?.lat &&
//       destination?.lng
//     ) {
//       setDestinationLocation(destination);
//       fetchRoute(origin, destination);
//     }
//   }, [origin, destination]);

//   // Fetch the route from Google Directions API
//   const fetchRoute = async (origin, destination) => {
//     try {
//       const response = await fetch(
//         `https://maps.googleapis.com/maps/api/directions/json?origin=${origin?.lat
//         },${origin?.lng}&destination=${Number(destination?.lat)},${Number(
//           destination?.lng,
//         )}&key=${API_KEY}`,
//       );
//       const json = await response.json();

//       if (json.routes?.length) {
//         const points = PolylineDecoder.decode(
//           json.routes[0].overview_polyline.points,
//         );
//         const routeCoords = points?.map(point => ({
//           latitude: point[0],
//           longitude: point[1],
//         }));
//         setCoords(routeCoords);
//       }
//     } catch (error) {
//       console.log('Error fetching route: ', error);
//     }
//   };


//   return (
//     <View
//       pointerEvents={isPendingReq ? 'none' : 'auto'}
//       style={styles.homeSubContainer}>
//       {mapRegion?.latitude?.toString()?.length > 0 &&
//         <MapView
//           provider={PROVIDER_GOOGLE}
//           onRegionChange={e => {
//             setMapManageRideDalta(e);
//             setMpaDalta(e);
//             // console.log('e---onRegionChange', e);
//             // handleRegionChangeComplete(e)
//           }}
//           ref={mapRef}
//           style={[styles.mapContainer, mapContainerView]}
//           zoomEnabled={true}
//           scrollEnabled={true}
//           showsScale={true}
//           // mapType={Platform.OS === 'ios' ? 'mutedStandard' : 'terrain'}
//           mapType={Platform.OS === 'ios' ? 'mutedStandard' : 'standard'}
//           region={mapRegion}
//           // initialRegion={mapRegion}
//           zoomTapEnabled={true}
//           rotateEnabled={false}
//           loadingEnabled={true}
//           showsCompass={false}
//           cacheEnabled={false}
//           followsUserLocation={false}
//           showsUserLocation={false}
//           // 👇 Set Zoom Limits
//           minZoomLevel={10}  // prevent zooming out too far
//           maxZoomLevel={18}  // prevent zooming in too much
//           // Performance optimizations
//           showsBuildings={false}
//           showsTraffic={false}
//           showsIndoors={false}
//           showsMyLocationButton={false}
//           toolbarEnabled={false}
//           onMapReady={handleMapReady}
//         >
//           {/* Origin Marker */}
//           {animatedCoordinate?.latitude && animatedCoordinate?.longitude && (
//             <Marker.Animated
//               ref={markerRef}
//               coordinate={animatedCoordinate}
//               tracksViewChanges={!isMapReady}
//             >
//               <Image
//                 resizeMode="cover"
//                 source={appImages.markerRideImage}
//                 style={styles.markerBikeImage}
//               />
//             </Marker.Animated>
//           )}
//           {/* {originMarker?.latitude && originMarker?.longitude && (
//           <Marker 
//           // tracksViewChanges={!isMapReady}
//           coordinate={originMarker} 
//           >
//             <Image
//               resizeMode="cover"
//               source={appImages.markerRideImage}
//               style={styles.markerBikeImage}
//             />
//           </Marker>
//         )} */}

//           {/* Destination Marker */}
//           {animatedDesCoordinate?.latitude && animatedDesCoordinate?.longitude && (
//             <Marker.Animated
//               ref={markerDesRef}
//               coordinate={animatedDesCoordinate}
//               tracksViewChanges={!isMapReady}
//             >
//               <Image
//                 resizeMode="contain"
//                 source={appImages.markerImage}
//                 style={styles.markerImage}
//               />
//             </Marker.Animated>
//           )}
//           {/* {destinationLocation?.lat && destinationLocation?.lng && ( 
//           <Marker
//             coordinate={destinationMarker}
//             tracksViewChanges={!isMapReady}
//           >
//             <Image
//               resizeMode="contain"
//               source={appImages.markerImage}
//               style={styles.markerImage}
//             />
//           </Marker>
//         )} */}

//           {/* Polyline for the Route */}
//           {coords?.length > 0 && (
//             <Polyline
//               coordinates={coords}
//               strokeWidth={4}
//               strokeColor={colors.main}
//             />
//           )}
//         </MapView>
//       }
//     </View>
//   );
// };

// export default MapRoute;

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
//   markerBikeImage: {
//     height: 30,
//     width: 30,
//     marginTop: Platform.OS === 'ios' ? '25%' : 0,
//   },
// });





import React, {
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { StyleSheet, View, Image, Platform } from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { appImages } from '../commons/AppImages';
import MapView, { Marker, AnimatedRegion, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import PolylineDecoder from '@mapbox/polyline';
import { colors } from '../theme/colors';
import { getMapManageRideDalta, setMapManageRideDalta, setMapManageRideDaltaInitials, setMpaDalta } from './GeoCodeAddress';
import { useFocusEffect } from '@react-navigation/native';
import { getDistance } from 'geolib';
import { DuuittMapTheme } from './DuuittMapTheme';

const API_KEY = 'AIzaSyAGYLXByGkajbYglfVPK4k7VJFOFsyS9EA';

const MapRoute = ({ mapContainerView, origin, destination, isPendingReq }) => {
  const mapRef = useRef(null);
  const hasAnimatedOnce = useRef(false);
  const markerRef = useRef(null);
  const markerDesRef = useRef(null);
  const bearingRef = useRef(0);
  const [coords, setCoords] = useState([]);
  const [isMapReady, setIsMapReady] = useState(false);
  const [currentLocation, setCurrentLocation] = useState({
    latitude: Number(origin?.lat) || 30.7400,
    longitude: Number(origin?.lng) || 76.7900,
  });

  // Real-time tracking interval reference
  const trackingIntervalRef = useRef(null);

  useFocusEffect(
    useCallback(() => {
      setMapManageRideDaltaInitials();
      startRealTimeTracking();

      return () => {
        stopRealTimeTracking();
      };
    }, [origin, destination])
  );

  // Start real-time tracking
  const startRealTimeTracking = () => {
    // Clear any existing interval
    stopRealTimeTracking();

    if (!origin || !destination) return;

    // Update location every 5 seconds (adjust as needed)
    trackingIntervalRef.current = setInterval(() => {
      updateRealTimeLocation();
    }, 5000);
  };

  const [animatedCoordinate] = useState(
    new AnimatedRegion({
      latitude: Number(origin?.lat) || null,
      longitude: Number(origin?.lng) || null,
      ...getMapManageRideDalta(
        getDistance(
          { latitude: Number(origin?.lat), longitude: Number(origin?.lng) },
          { latitude: Number(destination?.lat), longitude: Number(destination?.lng) }
        )
      ),
    })
  );

  const [animatedDesCoordinate] = useState(
    new AnimatedRegion({
      latitude: Number(destination?.lat) || null,
      longitude: Number(destination?.lng) || null,
      ...getMapManageRideDalta(getDistance(
        { latitude: Number(origin?.lat), longitude: Number(origin?.lng) },
        { latitude: Number(destination?.lat), longitude: Number(destination?.lng) }
      )
      ),
    })
  );

  const getBearing = (start, end) => {
    const lat1 = (start.lat * Math.PI) / 180;
    const lon1 = (start.lng * Math.PI) / 180;
    const lat2 = (end.lat * Math.PI) / 180;
    const lon2 = (end.lng * Math.PI) / 180;
    const dLon = lon2 - lon1;
    const y = Math.sin(dLon) * Math.cos(lat2);
    const x =
      Math.cos(lat1) * Math.sin(lat2) -
      Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);

    const bearing = Math.atan2(y, x);
    const bearingDeg = (bearing * 180) / Math.PI;
    return (bearingDeg + 360) % 360;
  };

  // Stop real-time tracking
  const stopRealTimeTracking = () => {
    if (trackingIntervalRef.current) {
      clearInterval(trackingIntervalRef.current);
      trackingIntervalRef.current = null;
    }
  };

  // Simulate real-time location updates
  const updateRealTimeLocation = () => {
    if (!origin || !destination || !mapRef.current) return;

    // Simulate movement towards destination (replace this with actual GPS data)
    const newLat = currentLocation.latitude + (Math.random() * 0.0001 - 0.00005);
    const newLng = currentLocation.longitude + (Math.random() * 0.0001 - 0.00005);

    const updatedLocation = {
      latitude: newLat,
      longitude: newLng,
    };

    setCurrentLocation(updatedLocation);

    // Ensure lat/lng are numbers
    const lat = Number(origin?.lat);
    const lng = Number(origin?.lng);
    const destLat = Number(destination?.lat);
    const destLng = Number(destination?.lng);

    const newCoord = { latitude: lat, longitude: lng };
    const newDesCoord = { latitude: destLat, longitude: destLng };

    animatedCoordinate.timing({
      ...newCoord,
      duration: 500,
      useNativeDriver: false,
    }).start();


    animatedDesCoordinate.timing({
      ...newDesCoord,
      duration: 500,
      useNativeDriver: false,
    }).start();

    // Animate map to new location
    // if (mapRef?.current) {
    //   mapRef.current.animateToRegion({
    //     ...updatedLocation,
    //     ...getMapManageRideDalta(getDistance(
    //       updatedLocation,
    //       { latitude: Number(destination?.lat), longitude: Number(destination?.lng) }
    //     )),
    //   }, 1000);
    // }


    // Update polyline with new coordinates
    setCoords(prevCoords => [...prevCoords, updatedLocation]);
  };


  useEffect(() => {
    if (!origin || !destination || !mapRef?.current) return;

    // Ensure lat/lng are numbers
    const lat = Number(origin?.lat);
    const lng = Number(origin?.lng);
    const destLat = Number(destination?.lat);
    const destLng = Number(destination?.lng);

    const newCoord = { latitude: lat, longitude: lng };
    const newDesCoord = { latitude: destLat, longitude: destLng };
    animatedCoordinate.timing({
      ...newCoord,
      duration: 500,
      useNativeDriver: false,
    }).start();


    animatedDesCoordinate.timing({
      ...newDesCoord,
      duration: 500,
      useNativeDriver: false,
    }).start();

    setTimeout(() => {
      mapRef.current?.animateToRegion({
        ...newCoord,
        // latitudeDelta: 0.0322,
        // longitudeDelta: 0.0321,
      }, 500);
    }, Platform.OS === 'ios' ? 100 : 0);

    // If any value is NaN, don't proceed
    if (isNaN(lat) || isNaN(lng) || isNaN(destLat) || isNaN(destLng)) return;
    // const timeout = setInterval(() => {
    const timeout = setTimeout(() => {
      const bearing = getBearing({ lat, lng }, { lat: destLat, lng: destLng });

      const camera = {
        center: {
          latitude: lat,
          longitude: lng,
        },
        // heading: bearing || 0,
        heading: bearingRef.current || bearing, // Keep the same heading
        pitch: 30,
        zoom: 17,
        altitude: 300,
      };
      if (mapRef?.current) {
        mapRef.current.animateCamera(camera, { duration: 1000 });
      }
    }, 5000);

    // return () => clearInterval(timeout);
    return () => clearTimeout(timeout);

  }, [origin, destination]);

  // Update region when origin changes
  useEffect(() => {
    if (origin?.lat && origin?.lng && mapRef.current) {
      const newRegion = {
        latitude: Number(origin.lat),
        longitude: Number(origin.lng),
        ...getMapManageRideDalta(getDistance(
          { latitude: Number(origin.lat), longitude: Number(origin.lng) },
          { latitude: Number(destination?.lat), longitude: Number(destination?.lng) }
        )),
      };

      setCurrentLocation({
        latitude: Number(origin.lat),
        longitude: Number(origin.lng),
      });
      // // Only animate the first time
      if (!hasAnimatedOnce?.current && mapRef?.current) {
        mapRef?.current?.animateToRegion(newRegion, 1000);
        hasAnimatedOnce.current = true; // Prevent further automatic animations
      }
    }
  }, [origin, destination]);

  // Fetch route when origin/destination changes
  useEffect(() => {
    if (origin?.lat && origin?.lng && destination?.lat && destination?.lng) {
      fetchRoute(origin, destination);
    }
  }, [origin, destination]);

  // Fit map to coordinates when route is loaded
  useEffect(() => {
    if ((coords?.length > 1 && mapRef?.current && !hasAnimatedOnce?.current)) {
      const edgePadding = {
        top: 50,
        right: 50,
        bottom: 50, // 👈 Increase bottom padding significantly
        left: 50,
      };
      mapRef?.current.fitToCoordinates(coords, {
        edgePadding,
        animated: true,
      });

      hasAnimatedOnce.current = true; // Prevent further automatic animations
      // Optional: second adjustment after a delay

      const timeout = setTimeout(() => {
        mapRef?.current?.fitToCoordinates(coords, {
          edgePadding,
          animated: true,
        });
      }, 6000);
      return () => clearTimeout(timeout);

    }

  }, [coords]);



  const fetchRoute = async (origin, destination) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/directions/json?origin=${origin?.lat},${origin?.lng}&destination=${destination?.lat},${destination?.lng}&key=${API_KEY}`
      );
      const json = await response?.json();

      if (json?.routes?.length > 0) {
        const points = PolylineDecoder.decode(
          json?.routes[0]?.overview_polyline?.points
        );
        const routeCoords = points?.map(point => ({
          latitude: point[0],
          longitude: point[1],
        }));
        setCoords(routeCoords);
      }
    } catch (error) {
      console.log('Error fetching route: ', error);
    }
  };

  // const handleMapReady = () => {
  //   setIsMapReady(true);
  // };


  const handleMapReady = () => {
    // console.log('Map is ready');
    if (
      animatedDesCoordinate?.latitude?.toString()?.length > 0 &&
      animatedCoordinate?.latitude?.toString()?.length > 0
    ) {
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
      style={styles.homeSubContainer}
    >
      {currentLocation?.latitude && (
        <MapView
          provider={PROVIDER_GOOGLE}
          ref={mapRef}
          style={[styles.mapContainer, mapContainerView]}
          mapType={Platform.OS === 'ios' ? 'standard' : 'standard'}
          customMapStyle={DuuittMapTheme}
          region={{
            ...currentLocation,
            ...getMapManageRideDalta(getDistance(
              currentLocation,
              { latitude: Number(destination?.lat), longitude: Number(destination?.lng) }
            )),
          }}
          zoomEnabled={true}
          scrollEnabled={true}
          rotateEnabled={true}
          loadingEnabled={true}
          showsCompass={false}
          minZoomLevel={10}
          maxZoomLevel={18}
          showsBuildings={false}
          showsTraffic={false}
          onMapReady={handleMapReady}
          onRegionChangeComplete={(region) => {
            setMapManageRideDalta(region);
            setMpaDalta(region);
          }}
        >
          {/* Current Location Marker (Moving Marker) */}
          {/* <Marker
            coordinate={currentLocation}
            tracksViewChanges={!isMapReady}
          >
            <Image
              resizeMode="cover"
              source={appImages.markerRideImage}
              style={styles.markerBikeImage}
            />
          </Marker> */}

          {/* Origin Marker */}
          {animatedCoordinate?.latitude && animatedCoordinate?.longitude && (
            <Marker.Animated
              ref={markerRef}
              coordinate={animatedCoordinate}
              tracksViewChanges={!isMapReady}
            >
              <Image
                resizeMode="cover"
                source={appImages.markerRideImage}
                style={styles.markerBikeImage}
              />
            </Marker.Animated>
          )}

          {/* Destination Marker */}
          {animatedDesCoordinate?.latitude && animatedDesCoordinate?.longitude && (
            <Marker.Animated
              ref={markerDesRef}
              coordinate={animatedDesCoordinate}
              tracksViewChanges={!isMapReady}
            >
              <Image
                resizeMode="contain"
                source={appImages.markerImage}
                style={styles.markerImage}
              />
            </Marker.Animated>
          )}
          {/* {destinationLocation?.lat && destinationLocation?.lng && ( 
          <Marker
            coordinate={destinationMarker}
            tracksViewChanges={!isMapReady}
          >
            <Image
              resizeMode="contain"
              source={appImages.markerImage}
              style={styles.markerImage}
            />
          </Marker>
        )} */}

          {/* Destination Marker */}
          {/* {destination?.lat && destination?.lng && (
            <Marker
              coordinate={{
                latitude: Number(destination?.lat),
                longitude: Number(destination?.lng),
              }}
            >
              <Image
                resizeMode="contain"
                source={appImages.markerImage}
                style={styles.markerImage}
              />
            </Marker>
          )} */}

          {/* Route Polyline */}
          {coords?.length > 0 && (
            <Polyline
              coordinates={coords}
              strokeWidth={4}
              strokeColor={colors.main}
              lineCap="round"
              lineJoin="round"
            />
          )}
        </MapView>
      )}
    </View>
  );
};

export default memo(MapRoute);

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
  markerImage: {
    height: 30,
    width: 30,
    marginTop: Platform.OS === 'ios' ? '25%' : 0,
  },
  markerBikeImage: {
    height: 30,
    width: 30,
    marginTop: Platform.OS === 'ios' ? '25%' : 0,
  },
});









// import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
// import { StyleSheet, View, Image, Platform } from 'react-native';
// import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
// import { appImages } from '../commons/AppImages';
// import MapView, { Marker, AnimatedRegion, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
// import PolylineDecoder from '@mapbox/polyline';
// import { colors } from '../theme/colors';
// import { getMapManageRideDalta, setMapManageRideDalta } from './GeoCodeAddress';
// import { getDistance } from 'geolib';
// import { useFocusEffect } from '@react-navigation/native';

// const API_KEY = 'AIzaSyAGYLXByGkajbYglfVPK4k7VJFOFsyS9EA';

// // Constants outside component to prevent recreation
// const DEFAULT_REGION = {
//   latitude: 30.7400,
//   longitude: 76.7900,
//   latitudeDelta: 0.0322,
//   longitudeDelta: 0.0321,
// };

// const MOHALI_CHD_BOUNDS = {
//   north: 30.8258,
//   south: 30.6600,
//   west: 76.6600,
//   east: 76.8500,
// };

// const MapRoute = React.memo(({ mapContainerView, origin, destination, isPendingReq }) => {
//   const mapRef = useRef(null);
//   const bearingRef = useRef(0);
//   const debounceTimeout = useRef(null);
//   const markerRef = useRef(null);
//   const markerDesRef = useRef(null);
//   const hasAnimatedOnce = useRef(false);
//   const timeoutRef = useRef(null);

//   const [destinationLocation, setDestinationLocation] = useState({ lat: null, lng: null });
//   const [coords, setCoords] = useState([]);
//   const [isMapReady, setIsMapReady] = useState(false);

//   const [animatedCoordinate] = useState(
//     new AnimatedRegion({
//       latitude: DEFAULT_REGION.latitude,
//       longitude: DEFAULT_REGION.longitude,
//       latitudeDelta: DEFAULT_REGION.latitudeDelta,
//       longitudeDelta: DEFAULT_REGION.longitudeDelta,
//     })
//   );

//   const [animatedDesCoordinate] = useState(
//     new AnimatedRegion({
//       latitude: DEFAULT_REGION.latitude,
//       longitude: DEFAULT_REGION.longitude,
//       latitudeDelta: DEFAULT_REGION.latitudeDelta,
//       longitudeDelta: DEFAULT_REGION.longitudeDelta,
//     })
//   );

//   // 🔹 Update when origin changes
//   useEffect(() => {
//     if (origin?.lat && origin?.lng) {
//       animatedCoordinate.timing({
//         latitude: Number(origin.lat),
//         longitude: Number(origin.lng),
//         duration: 500,
//         useNativeDriver: false,
//       }).start();
//     }
//     else {
//       animatedCoordinate.timing({
//         latitude: Number(origin.lat) ?? DEFAULT_REGION.latitude,
//         longitude: Number(origin.lng) ?? DEFAULT_REGION.longitude,
//         duration: 500,
//         useNativeDriver: false,
//       }).start();
//     }
//   }, [origin, animatedCoordinate]);

//   // 🔹 Update when destination changes
//   useEffect(() => {
//     if (destination?.lat && destination?.lng) {
//       animatedDesCoordinate.timing({
//         latitude: Number(destination.lat),
//         longitude: Number(destination.lng),
//         duration: 500,
//         useNativeDriver: false,
//       }).start();
//     }
//     else {
//       animatedDesCoordinate.timing({
//         latitude: Number(destination.lat) ?? DEFAULT_REGION.latitude,
//         longitude: Number(destination.lng) ?? DEFAULT_REGION.longitude,
//         duration: 500,
//         useNativeDriver: false,
//       }).start();
//     }
//   }, [destination, animatedDesCoordinate]);

//   // Memoized map region to prevent unnecessary re-renders
//   const mapRegion = useMemo(() => {
//     if (origin?.lat && origin?.lng) {
//       const distance = getDistance(
//         { latitude: Number(origin?.lat), longitude: Number(origin?.lng) },
//         { latitude: Number(destination?.lat || 0), longitude: Number(destination?.lng || 0) }
//       );
//       return {
//         latitude: Number(origin?.lat),
//         longitude: Number(origin?.lng),
//         ...getMapManageRideDalta(distance),
//       };
//     }
//     return DEFAULT_REGION;
//   }, [origin?.lat, origin?.lng, destination?.lat, destination?.lng]);

//   // Memoized animated coordinates to prevent recreation
//   // const animatedCoordinate = useMemo(() => {
//   //   if (origin?.lat && origin?.lng) {
//   //     const distance = getDistance(
//   //       { latitude: Number(origin.lat), longitude: Number(origin.lng) },
//   //       { latitude: Number(destination?.lat || 0), longitude: Number(destination?.lng || 0) }
//   //     );
//   //     return new AnimatedRegion({
//   //       latitude: Number(origin.lat),
//   //       longitude: Number(origin.lng),
//   //       ...getMapManageRideDalta(distance),
//   //     });
//   //   }
//   //   return null;
//   // }, [origin?.lat, origin?.lng, destination?.lat, destination?.lng]);

//   // const animatedDesCoordinate = useMemo(() => {
//   //   if (destination?.lat && destination?.lng) {
//   //     const distance = getDistance(
//   //       { latitude: Number(origin?.lat || 0), longitude: Number(origin?.lng || 0) },
//   //       { latitude: Number(destination.lat), longitude: Number(destination.lng) }
//   //     );
//   //     return new AnimatedRegion({
//   //       latitude: Number(destination.lat),
//   //       longitude: Number(destination.lng),
//   //       ...getMapManageRideDalta(distance),
//   //     });
//   //   }
//   //   return null;
//   // }, [origin?.lat, origin?.lng, destination?.lat, destination?.lng]);

//   // Memoized bounds check function
//   const isWithinBounds = useCallback((latitude, longitude) => {
//     return (
//       latitude <= MOHALI_CHD_BOUNDS.north &&
//       latitude >= MOHALI_CHD_BOUNDS.south &&
//       longitude >= MOHALI_CHD_BOUNDS.west &&
//       longitude <= MOHALI_CHD_BOUNDS.east
//     );
//   }, []);

//   // Optimized region change handler with debouncing
//   const handleRegionChangeComplete = useCallback((region) => {
//     if (debounceTimeout.current) {
//       clearTimeout(debounceTimeout.current);
//     }

//     debounceTimeout.current = setTimeout(() => {
//       if (!isWithinBounds(region.latitude, region.longitude)) {
//         mapRef.current?.animateToRegion({
//           latitude: 30.7400,
//           longitude: 76.7900,
//           ...getMapManageRideDalta(1000),
//         });
//       }
//     }, 100);
//   }, [isWithinBounds]);

//   // Single optimized useEffect for origin changes
//   useEffect(() => {
//     if (origin?.lat && origin?.lng && mapRef?.current && !hasAnimatedOnce.current) {
//       const newRegion = {
//         latitude: Number(origin.lat),
//         longitude: Number(origin.lng),
//         ...getMapManageRideDalta(
//           getDistance(
//             { latitude: Number(origin.lat), longitude: Number(origin.lng) },
//             { latitude: Number(destination?.lat || 0), longitude: Number(destination?.lng || 0) }
//           )
//         ),
//       };

//       mapRef.current.animateToRegion(newRegion, 1000);
//       hasAnimatedOnce.current = true;
//     }
//   }, [origin?.lat, origin?.lng, destination?.lat, destination?.lng]);

//   // Optimized route fitting
//   useEffect(() => {
//     if (coords?.length > 1 && mapRef?.current && !hasAnimatedOnce.current) {
//       const edgePadding = { top: 30, right: 20, bottom: 10, left: 20 };

//       mapRef.current.fitToCoordinates(coords, { edgePadding, animated: true });
//       hasAnimatedOnce.current = true;
//     }
//   }, [coords]);

//   // Optimized map ready handler
//   const handleMapReady = useCallback(() => {
//     setIsMapReady(true);
//   }, []);

//   // Memoized bearing calculation
//   const getBearing = useCallback((start, end) => {
//     const lat1 = (start.lat * Math.PI) / 180;
//     const lon1 = (start.lng * Math.PI) / 180;
//     const lat2 = (end.lat * Math.PI) / 180;
//     const lon2 = (end.lng * Math.PI) / 180;
//     const dLon = lon2 - lon1;
//     const y = Math.sin(dLon) * Math.cos(lat2);
//     const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
//     const bearing = Math.atan2(y, x);
//     const bearingDeg = (bearing * 180) / Math.PI;
//     return (bearingDeg + 360) % 360;
//   }, []);

//   // Optimized camera animation
//   useEffect(() => {
//     if (!origin || !destination || !mapRef?.current) return;

//     const lat = Number(origin.lat);
//     const lng = Number(origin.lng);
//     const destLat = Number(destination.lat);
//     const destLng = Number(destination.lng);

//     if (isNaN(lat) || isNaN(lng) || isNaN(destLat) || isNaN(destLng)) return;

//     // Animate markers
//     if (animatedCoordinate) {
//       animatedCoordinate.timing({
//         latitude: lat,
//         longitude: lng,
//         duration: 500,
//         useNativeDriver: false,
//       }).start();
//     }

//     if (animatedDesCoordinate) {
//       animatedDesCoordinate.timing({
//         latitude: destLat,
//         longitude: destLng,
//         duration: 500,
//         useNativeDriver: false,
//       }).start();
//     }

//     // Animate map region
//     setTimeout(() => {
//       mapRef.current?.animateToRegion({
//         latitude: lat,
//         longitude: lng,
//         ...getMapManageRideDalta(
//           getDistance(
//             { latitude: lat, longitude: lng },
//             { latitude: destLat, longitude: destLng }
//           )
//         ),
//       }, 500);
//     }, Platform.OS === 'ios' ? 100 : 0);

//     // Animate camera with bearing
//     timeoutRef.current = setTimeout(() => {
//       const bearing = getBearing({ lat, lng }, { lat: destLat, lng: destLng });
//       const camera = {
//         center: { latitude: lat, longitude: lng },
//         heading: bearingRef.current || bearing,
//         pitch: 30,
//         zoom: 17,
//         altitude: 300,
//       };
//       mapRef.current?.animateCamera(camera, { duration: 1000 });
//     }, 2000);

//     return () => {
//       if (timeoutRef.current) {
//         clearTimeout(timeoutRef.current);
//       }
//     };
//   }, [origin, destination, animatedCoordinate, animatedDesCoordinate, getBearing]);

//   // Fetch route when both locations are available
//   useEffect(() => {
//     if (origin?.lat && origin?.lng && destination?.lat && destination?.lng) {
//       setDestinationLocation(destination);
//       fetchRoute(origin, destination);
//     }
//   }, [origin?.lat, origin?.lng, destination?.lat, destination?.lng]);

//   // Memoized route fetching function
//   const fetchRoute = useCallback(async (origin, destination) => {
//     try {
//       const response = await fetch(
//         `https://maps.googleapis.com/maps/api/directions/json?origin=${origin?.lat},${origin?.lng}&destination=${destination?.lat},${destination?.lng}&key=${API_KEY}`
//       );
//       const json = await response.json();

//       if (json.routes?.length) {
//         const points = PolylineDecoder.decode(json.routes[0].overview_polyline.points);
//         const routeCoords = points.map(point => ({
//           latitude: point[0],
//           longitude: point[1],
//         }));
//         setCoords(routeCoords);
//       }
//     } catch (error) {
//       console.log('Error fetching route:', error);
//     }
//   }, []);

//   // Cleanup on unmount
//   useEffect(() => {
//     return () => {
//       if (debounceTimeout.current) {
//         clearTimeout(debounceTimeout.current);
//       }
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
//     showsCompass: false,
//     cacheEnabled: false,
//     followsUserLocation: false,
//     showsUserLocation: false,
//     onMapReady: handleMapReady,
//     onRegionChange: setMapManageRideDalta,
//     onRegionChangeComplete: handleRegionChangeComplete,
//     // Performance optimizations
//     showsBuildings: false,
//     showsTraffic: false,
//     showsIndoors: false,
//     showsMyLocationButton: false,
//     toolbarEnabled: false,
//   }), [mapRegion, mapContainerView, handleMapReady, handleRegionChangeComplete]);

//   // // Memoized markers
//   // const originMarker = useMemo(() => (
//   //   animatedCoordinate?.latitude && animatedCoordinate?.longitude && (
//   //     <Marker.Animated
//   //       ref={markerRef}
//   //       coordinate={animatedCoordinate}
//   //       tracksViewChanges={!isMapReady}
//   //     >
//   //       <Image
//   //         resizeMode="cover"
//   //         source={appImages.markerRideImage}
//   //         style={styles.markerBikeImage}
//   //       />
//   //     </Marker.Animated>
//   //   )
//   // ), [animatedCoordinate, isMapReady,origin]);

//   // const destinationMarker = useMemo(() => (
//   //   animatedDesCoordinate?.latitude && animatedDesCoordinate?.longitude && (
//   //     <Marker.Animated
//   //       ref={markerDesRef}
//   //       coordinate={animatedDesCoordinate}
//   //       tracksViewChanges={!isMapReady}
//   //     >
//   //       <Image
//   //         resizeMode="contain"
//   //         source={appImages.markerImage}
//   //         style={styles.markerImage}
//   //       />
//   //     </Marker.Animated>
//   //   )
//   // ), [animatedDesCoordinate, isMapReady,destination]);


//   // ✅ Destination Marker
//   const destinationMarker = useMemo(() => {
//     if (!animatedDesCoordinate) return null;

//     const { latitude, longitude } = animatedDesCoordinate.__getValue();
//     if (!latitude || !longitude) return null;

//     return (
//       <Marker.Animated
//         ref={markerDesRef}
//         coordinate={animatedDesCoordinate}
//         tracksViewChanges={!isMapReady}
//       >
//         <Image
//           resizeMode="contain"
//           source={appImages.markerImage}
//           style={styles.markerImage}
//         />
//       </Marker.Animated>
//     );
//   }, [animatedDesCoordinate, isMapReady, destination]);

//   // ✅ Origin Marker
//   const originMarker = useMemo(() => {
//     if (!animatedCoordinate) return null;
//     const { latitude, longitude } = animatedCoordinate.__getValue();
//     if (!latitude || !longitude) return null;

//     return (
//       <Marker.Animated
//         ref={markerRef}
//         coordinate={animatedCoordinate
//           ?? {
//           latitude: origin?.lat,
//           longitude: origin?.lng,
//         }}
//         tracksViewChanges={!isMapReady}
//       >
//         {animatedCoordinate ?
//           <Image
//             resizeMode='contain'
//             source={appImages.markerRideImage}
//             style={styles.markerBikeImage}
//           /> :
//           <Image
//             resizeMode="contain"
//             source={appImages.markerImage}
//             style={styles.markerImage}
//           />

//         }
//       </Marker.Animated>
//     );
//   }, [animatedCoordinate, isMapReady, origin]);



//   // Memoized polyline
//   const routePolyline = useMemo(() => (
//     coords?.length > 0 && (
//       <Polyline
//         coordinates={coords}
//         strokeWidth={3}
//         strokeColor={colors.main}
//       />
//     )
//   ), [coords]);

//   // Only render map when coordinates are valid
//   if (!mapRegion?.latitude || !mapRegion?.longitude) {
//     return (
//       <View style={styles.homeSubContainer}>
//         <View style={[styles.mapContainer, mapContainerView]} />
//       </View>
//     );
//   }

//   return (
//     <View
//       pointerEvents={isPendingReq ? 'none' : 'auto'}
//       style={styles.homeSubContainer}
//     >
//       <MapView {...mapProps}>

//         {originMarker}
//         {destinationMarker}
//         {routePolyline}
//       </MapView>
//     </View>
//   );
// });

// MapRoute.displayName = 'MapRoute';

// export default MapRoute;

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
//   markerBikeImage: {
//     height: 30,
//     width: 28,
//     marginTop: Platform.OS === 'ios' ? '25%' : 0,
//   },
// });
