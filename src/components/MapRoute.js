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
import MapViewDirections from 'react-native-maps-directions';
import socketServices from '../socketIo/SocketServices';
import { rootStore } from '../stores/rootStore';
import { object } from 'yup';
import { MAP_KEY } from '../halpers/AppLink';



const MapRoute = ({ mapContainerView, origin, destination, isPendingReq }) => {
  const { getCustomerWiseRiderLocation } = rootStore.orderStore;
  const mapRef = useRef(null);
  const hasAnimatedOnce = useRef(false);
  const hasAnimatedCameraRef = useRef(false)
  const markerRef = useRef(null);
  const markerDesRef = useRef(null);
  const bearingRef = useRef(0);
  const [coords, setCoords] = useState([]);
  const [isMapReady, setIsMapReady] = useState(false);

  // Use animated regions for smooth marker movement
  const [animatedCoordinate] = useState(
    new AnimatedRegion({
      latitude: Number(origin?.lat) || 30.7400,
      longitude: Number(origin?.lng) || 76.7900,
      latitudeDelta: 0.005,
      longitudeDelta: 0.005,
    })
  );

  const [animatedDesCoordinate] = useState(
    new AnimatedRegion({
      latitude: Number(destination?.lat) || null,
      longitude: Number(destination?.lng) || null,
      latitudeDelta: 0.005,
      longitudeDelta: 0.005,
    })
  );

  // Real-time tracking interval reference
  const trackingIntervalRef = useRef(null);
  const currentPositionRef = useRef({
    latitude: Number(origin?.lat) || 30.7400,
    longitude: Number(origin?.lng) || 76.7900,
  });

  useFocusEffect(
    useCallback(() => {
      setMapManageRideDaltaInitials();
      if ((origin && destination)) {
        animate(origin?.lat, origin?.lng, origin, destination)
      }

      // Fixed: Combined location effects to prevent conflicts
      // if (riderCustomerDetails) {
      //   onUpdateCutomerLocation(riderCustomerDetails);

      //   const intervalId = setInterval(() => {
      //     onUpdateCutomerLocation(riderCustomerDetails);
      //   }, 6000);

      //   return () => {
      //     clearInterval(intervalId);
      //   };
      // }

    }, [origin, destination])
  );

  // const onUpdateCutomerLocation = async (order) => {
  //   try {
  //     const res = await getCustomerWiseRiderLocation(order);
  //     console.log("res?.rider?.current_location--", res?.rider);

  //     const currentLoc = res?.rider?.current_location;

  //     // ✅ Corrected: Object.keys (not Object.key)
  //     if (currentLoc && Object.keys(currentLoc)?.length > 0) {
  //       console.log("✅ Rider current location:", currentLoc);
  //       animate(currentLoc?.lat, currentLoc?.lng, currentLoc, destination);
  //       // alert('yes1')
  //     } else {
  //       console.log("⚠️ No current location found.");
  //     }
  //   } catch (error) {
  //     console.log("❌ Error updating customer location:", error);
  //   }
  // };


  // const onUpdateCutomerLocation = async (order) => {

  //   const res = await getCustomerWiseRiderLocation(order);
  //   console.log("res?.rider?.current_location--", res?.rider);

  //   if (Object.key(res?.rider?.current_location)?.length > 0) {
  //     // console.log("res?.rider?.current_location--", res?.rider?.current_location);
  //     alert("yes1")
  //     animate(res?.rider?.current_location?.lat, res?.rider?.current_location?.lng, res?.rider?.current_location, destination)
  //   } else {
  //     alert("yes2")
  //   }

  // }




  useEffect(() => {
    socketServices.initailizeSocket();

    socketServices.on('getremainingdistance', data => {
      console.log('Remaining distance data--:', data, data?.location);
      if ((data && data?.location && data?.location?.lat)) {
        animate(data?.location?.lat, data?.location?.lng, data?.location, destination)
      }
    });
  }, [])

  // const animate = (latitude, longitude, newLocation, currentDestination) => {
  //   const newCoordinate = { latitude, longitude };
  //   console.log("newCoordinate--", newCoordinate, latitude, longitude);
  //   fetchRoute(newLocation, currentDestination);
  //   if (Platform.OS == 'android') {
  //     if (markerRef?.current) {
  //       markerRef.current.animateMarkerToCoordinate(newCoordinate, 7000);
  //       fetchRoute(newLocation, currentDestination);
  //     }
  //   } else {
  //     animatedCoordinate.timing(newCoordinate).start();
  //     fetchRoute(newLocation, currentDestination);
  //   }
  // }


  const animate = (latitude, longitude, newLocation, currentDestination) => {
    const newCoordinate = { latitude, longitude };

    console.log("Animating to:", newCoordinate);

    // Fetch new route (if needed)
    fetchRoute(newLocation, currentDestination);
    // Use AnimatedRegion for both platforms to keep a single code path
    animatedCoordinate.timing({
      latitude: Number(newCoordinate?.latitude),
      longitude: Number(newCoordinate?.longitude),
      duration: 7000,
      useNativeDriver: false,
    }).start();
  };


  // Fetch route when origin/destination changes
  // useEffect(() => {
  //   if (origin && destination) {
  //     fetchRoute(origin, destination);
  //   }
  // }, [origin, destination]);

  // Initialize markers and camera when data is available
  useEffect(() => {
    if (!origin || !destination) return;

    const lat = Number(origin?.lat);
    const lng = Number(origin?.lng);
    const destLat = Number(destination?.lat);
    const destLng = Number(destination?.lng);

    // if (isNaN(lat) || isNaN(lng) || isNaN(destLat) || isNaN(destLng)) return;

    // Initialize current position
    currentPositionRef.current = { latitude: lat, longitude: lng };

    // Set initial marker positions
    animatedCoordinate.timing({
      latitude: lat,
      longitude: lng,
      duration: 500,
      useNativeDriver: false,
    }).start();

    animatedDesCoordinate.timing({
      latitude: destLat,
      longitude: destLng,
      duration: 500,
      useNativeDriver: false,
    }).start();

    fetchRoute(origin, destination);

    // if (!hasAnimatedCameraRef?.current) {
    //   const timeout = setTimeout(() => {
    //     const bearing = getBearing({ lat, lng }, { lat: destLat, lng: destLng });
    //     bearingRef.current = bearing;

    //     const camera = {
    //       center: { latitude: lat, longitude: lng },
    //       heading: bearing,
    //       pitch: 30,
    //       zoom: 17,
    //       altitude: 300,
    //     };

    //     mapRef.current?.animateCamera(camera, { duration: 1000 });
    //     hasAnimatedCameraRef.current = true; // ✅ prevent re-triggering
    //   }, 60000)
    //   return () => clearTimeout(timeout);
    // }
  }, [origin, destination]);

  // Fit map to coordinates when route is loaded (only once)
  useEffect(() => {
    if (coords?.length > 1 && mapRef?.current) {
      const edgePadding = {
        top: 50,
        right: 50,
        bottom: 50, // Increased bottom padding
        left: 50,
      };

      mapRef.current.fitToCoordinates(coords, {
        edgePadding,
        animated: true,
      });

      hasAnimatedOnce.current = true;
    }
  }, [coords]);

  // Fetch the route from Google Directions API
  // const fetchRoute = async (origin, destination) => {
  //   try {
  //     const response = await fetch(
  //       `https://maps.googleapis.com/maps/api/directions/json?origin=${Number(origin?.lat)},${Number(origin?.lng)}&destination=${Number(destination?.lat)},${Number(destination?.lng)}&key=${MAP_KEY}`,
  //     );
  //     const json = await response?.json();

  //     if (json?.routes?.length) {
  //       const points = PolylineDecoder?.decode(
  //         json?.routes[0]?.overview_polyline?.points,
  //       );
  //       const routeCoords = points?.map(point => ({
  //         latitude: point[0],
  //         longitude: point[1],
  //       }));
  //       setCoords(routeCoords);
  //     }
  //   } catch (error) {
  //     console.log('Error fetching route: ', error);
  //   }
  // };
  const fetchRoute = async (origin, destination) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/directions/json?origin=${Number(origin?.lat)},${Number(origin?.lng)}&destination=${Number(destination?.lat)},${Number(destination?.lng)}&alternatives=true&key=${MAP_KEY}`
      );

      const json = await response?.json();

      if (json?.routes?.length > 0) {
        // ✅ Find the shortest route based on total distance
        let shortestRoute = json?.routes[0];
        let minDistance = json?.routes[0]?.legs[0]?.distance?.value; // in meters

        json?.routes?.forEach(route => {
          const distance = route?.legs[0]?.distance?.value;
          if (distance < minDistance) {
            minDistance = distance;
            shortestRoute = route;
          }
        });

        // ✅ Decode the shortest route polyline
        const points = PolylineDecoder?.decode(shortestRoute?.overview_polyline?.points);
        const routeCoords = points?.map(point => ({
          latitude: point[0],
          longitude: point[1],
        }));

        // ✅ Update state
        setCoords(routeCoords);
        console.log(`✅ Shortest route selected — ${(minDistance / 1000).toFixed(2)} km`);
      } else {
        console.log('⚠️ No routes found.');
      }
    } catch (error) {
      console.log('❌ Error fetching route:', error);
    }
  };

  const getBearing = (start, end) => {
    const lat1 = (start.lat * Math.PI) / 180;
    const lon1 = (start.lng * Math.PI) / 180;
    const lat2 = (end.lat * Math.PI) / 180;
    const lon2 = (end.lng * Math.PI) / 180;
    const dLon = lon2 - lon1;
    const y = Math.sin(dLon) * Math.cos(lat2);
    const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
    const bearing = Math.atan2(y, x);
    const bearingDeg = (bearing * 180) / Math.PI;
    return (bearingDeg + 360) % 360;
  };

  const handleMapReady = () => {
    setTimeout(() => {
      setIsMapReady(true);
    }, 1000);
  };

  return (
    <View
      pointerEvents={isPendingReq ? 'none' : 'auto'}
      style={styles.homeSubContainer}
    >
      {/* {(origin && destination) ? */}
      <MapView
        provider={PROVIDER_GOOGLE}
        ref={mapRef}
        style={[styles.mapContainer, mapContainerView]}
        mapType={Platform.OS === 'ios' ? 'standard' : 'standard'}
        customMapStyle={DuuittMapTheme}
        region={{
          latitude: Number(origin?.lat) || 30.7400,
          longitude: Number(origin?.lng) || 76.7900,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005
        }}
        zoomEnabled={true}
        scrollEnabled={true}
        rotateEnabled={false}
        loadingEnabled={true}
        showsCompass={false}
        minZoomLevel={10}
        maxZoomLevel={18}
        showsBuildings={false}
        //  showsUserLocation={true}
        followsUserLocation={true}
        showsTraffic={false}
        onMapReady={handleMapReady}
        onRegionChangeComplete={(region) => {
          setMapManageRideDalta(region);
          setMpaDalta(region);
        }}
      >

        {/* Origin Marker */}
        <Marker.Animated
          ref={markerRef}
          coordinate={animatedCoordinate}
          tracksViewChanges={!isMapReady}
          centerOffset={{ x: 0, y: -10 }} // Adjust Y offset to position properly
          anchor={{ x: 0.5, y: 0.5 }}
        >
          <Image
            resizeMode="cover"
            source={appImages.markerRideImage}
            style={styles.markerBikeImage}
          />
        </Marker.Animated>

        {/* Destination Marker */}
        <Marker.Animated
          ref={markerDesRef}
          coordinate={animatedDesCoordinate}
          tracksViewChanges={!isMapReady}
          centerOffset={{ x: 0, y: -10 }} // Adjust Y offset to position properly
          anchor={{ x: 0.5, y: 0.5 }}
        >
          <Image
            resizeMode="contain"
            source={appImages.markerImage}
            style={styles.markerImage}
          />
        </Marker.Animated>

        {/* Route Polyline */}
        {/* {(Object.keys(origin)?.length > 0 &&
         Object.keys(destination)?.length > 0)
         && (<MapViewDirections
          origin={{
            latitude: Number(origin?.lat) || 30.7400,
            longitude: Number(origin?.lng) || 76.7900,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005
          }}
          destination={
            {
              latitude: Number(destination?.lat),
              longitude: Number(destination?.lng)
            }
          }
          apikey={MAP_KEY}
          strokeWidth={6}
          strokeColor={colors.main}
          optimizeWaypoints={true}
          onStart={(params) => {
            console.log(`Started routing between "${params.origin}" and "${params.destination}"`);
          }}
          onReady={result => {
            console.log(`Distance: ${result.distance} km`)
            console.log(`Duration: ${result.duration} min.`)
            // fetchTime(result.distance, result.duration),
            mapRef.current.fitToCoordinates(result?.coordinates, {
              edgePadding: {
                right: 50,
                bottom: 50,
                left: 50,
                top: 50,
              },
            });
          }}
          onError={(errorMessage) => {
            console.log('GOT AN ERROR', errorMessage);
          }}
        />)} */}
        {coords?.length > 0 && (
          <Polyline
            coordinates={coords}
            strokeWidth={4}
            strokeColor={colors.main}
          />
        )}
      </MapView>
      {/* :
        <View style={[styles.mapContainer, mapContainerView]}>
        </View>} */}
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












// import React, {
//   memo,
//   useCallback,
//   useEffect,
//   useRef,
//   useState,
// } from 'react';
// import { StyleSheet, View, Image, Platform } from 'react-native';
// import {
//   heightPercentageToDP as hp,
//   widthPercentageToDP as wp,
// } from 'react-native-responsive-screen';
// import { appImages } from '../commons/AppImages';
// import MapView, { Marker, AnimatedRegion, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
// import PolylineDecoder from '@mapbox/polyline';
// import { colors } from '../theme/colors';
// import { getMapManageRideDalta, setMapManageRideDalta, setMapManageRideDaltaInitials, setMpaDalta } from './GeoCodeAddress';
// import { useFocusEffect } from '@react-navigation/native';
// import { getDistance } from 'geolib';
// import { DuuittMapTheme } from './DuuittMapTheme';
// import MapViewDirections from 'react-native-maps-directions';
// import { MAP_KEY } from '../halpers/AppLink';


// const MapRoute = ({ mapContainerView, origin, destination, isPendingReq }) => {
//   const mapRef = useRef(null);
//   const hasAnimatedOnce = useRef(false);
//   const hasAnimatedCameraRef = useRef(false)
//   const markerRef = useRef(null);
//   const markerDesRef = useRef(null);
//   const bearingRef = useRef(0);
//   const [coords, setCoords] = useState([]);
//   const [isMapReady, setIsMapReady] = useState(false);

//   // Use animated regions for smooth marker movement
//   const [animatedCoordinate] = useState(
//     new AnimatedRegion({
//       latitude: Number(origin?.lat) || 30.7400,
//       longitude: Number(origin?.lng) || 76.7900,
//       latitudeDelta: 0.005,
//       longitudeDelta: 0.005,
//     })
//   );

//   const [animatedDesCoordinate] = useState(
//     new AnimatedRegion({
//       latitude: Number(destination?.lat) || null,
//       longitude: Number(destination?.lng) || null,
//       latitudeDelta: 0.005,
//       longitudeDelta: 0.005,
//     })
//   );

//   // Real-time tracking interval reference
//   const trackingIntervalRef = useRef(null);
//   const currentPositionRef = useRef({
//     latitude: Number(origin?.lat) || 30.7400,
//     longitude: Number(origin?.lng) || 76.7900,
//   });

//   useFocusEffect(
//     useCallback(() => {
//       setMapManageRideDaltaInitials();
//       if ((origin && destination)) {
//         startRealTimeTracking();
//       }

//       return () => {
//         stopRealTimeTracking();
//       };
//     }, [origin, destination])
//   );

//   // Start real-time tracking
//   const startRealTimeTracking = () => {
//     // Clear any existing interval
//     // stopRealTimeTracking();
//     if (!origin || !destination) return;
//     // Update location every 5 seconds
//     // const updateLocation = setInterval(() => {
//     updateRealTimeLocation(origin, destination);
//     // }, 5000);

//     // return (
//     //   clearInterval(updateLocation)
//     // )
//   };

//   // Stop real-time tracking
//   const stopRealTimeTracking = () => {
//     if (trackingIntervalRef.current) {
//       clearInterval(trackingIntervalRef.current);
//       trackingIntervalRef.current = null;
//     }
//   };

//   // Improved real-time location updates
//   const updateRealTimeLocation = (newLocation, currentDestination) => {

//     if (!newLocation || !currentDestination) return;

//     // const { latitude: lat, longitude: lng } = newLocation;
//     // const destLat = Number(currentDestination.lat);
//     // const destLng = Number(currentDestination.lng);

//     // // Validate coordinates
//     // if (isNaN(lat) || isNaN(lng) || isNaN(destLat) || isNaN(destLng)) return;

//     // // Stop if close to destination (less than ~5 meters)
//     // const distanceLat = destLat - lat;
//     // const distanceLng = destLng - lng;
//     // const distance = Math.sqrt(distanceLat ** 2 + distanceLng ** 2);

//     // if (distance < 0.00005) {
//     //   console.log('✅ Reached destination, stopping updates');
//     //   return;
//     // }

//     // Update current position ref
//     // currentPositionRef.current = { latitude: lat, longitude: lng };
//     // alert(newLocation?.lat)
//     // Animate marker smoothly
//     animatedCoordinate.timing({
//       latitude: newLocation?.lat,
//       longitude: newLocation?.lng,
//       duration: 1000,
//       useNativeDriver: false,
//     }).start(() => {
//       console.log('🎯 Marker updated to:', newLocation);
//     });

//     fetchRoute(newLocation, currentDestination);

//     // Optionally update camera to follow marker
//     // if (mapRef?.current) {
//     //   mapRef.current.animateCamera(
//     //     {
//     //       center: { latitude: lat, longitude: lng },
//     //       heading: bearingRef.current,
//     //       pitch: 30,
//     //       zoom: 17,
//     //       altitude: 300,
//     //     },
//     //     { duration: 3000 }
//     //   );
//     // }
//   };

//   // const updateRealTimeLocation = (newLocation) => {
//   //   if (!newLocation || !newLocation?.latitude || !newLocation?.longitude) return;

//   //   currentPositionRef.current = newLocation;

//   //   animatedCoordinate.timing({
//   //     latitude: newLocation?.latitude,
//   //     longitude: newLocation?.longitude,
//   //     duration: 1000,
//   //     useNativeDriver: false,
//   //   }).start();

//   //   // if (mapRef?.current) {
//   //   //   mapRef.current.animateCamera({
//   //   //     center: newLocation,
//   //   //     zoom: 17,
//   //   //     heading: bearingRef.current,
//   //   //     pitch: 30,
//   //   //     altitude: 300,
//   //   //   }, { duration: 3000 });
//   //   // }

//   // };


//   // Fetch route when origin/destination changes
//   useEffect(() => {
//     if (origin && destination) {
//       fetchRoute(origin, destination);
//     }
//   }, [origin, destination]);

//   // Initialize markers and camera when data is available
//   useEffect(() => {
//     if (!origin || !destination || !mapRef?.current) return;

//     const lat = Number(origin?.lat);
//     const lng = Number(origin?.lng);
//     const destLat = Number(destination?.lat);
//     const destLng = Number(destination?.lng);

//     // if (isNaN(lat) || isNaN(lng) || isNaN(destLat) || isNaN(destLng)) return;

//     // Initialize current position
//     currentPositionRef.current = { latitude: lat, longitude: lng };

//     // Set initial marker positions
//     animatedCoordinate.timing({
//       latitude: lat,
//       longitude: lng,
//       duration: 500,
//       useNativeDriver: false,
//     }).start();

//     animatedDesCoordinate.timing({
//       latitude: destLat,
//       longitude: destLng,
//       duration: 500,
//       useNativeDriver: false,
//     }).start();

//     // Set initial camera position
//     // const timeout = setTimeout(() => {
//     //   const bearing = getBearing({ lat, lng }, { lat: destLat, lng: destLng });
//     //   bearingRef.current = bearing;

//     //   const camera = {
//     //     center: { latitude: lat, longitude: lng },
//     //     heading: bearing,
//     //     pitch: 30,
//     //     zoom: 17,
//     //     altitude: 300,
//     //   };

//     //   if (mapRef?.current) {
//     //     mapRef.current.animateCamera(camera, { duration: 1000 });
//     //   }

//     // }, 60000);

//     // return () => clearTimeout(timeout);
//     if (!hasAnimatedCameraRef?.current) {
//       const timeout = setTimeout(() => {
//         const bearing = getBearing({ lat, lng }, { lat: destLat, lng: destLng });
//         bearingRef.current = bearing;

//         const camera = {
//           center: { latitude: lat, longitude: lng },
//           heading: bearing,
//           pitch: 30,
//           zoom: 17,
//           altitude: 300,
//         };

//         mapRef.current?.animateCamera(camera, { duration: 1000 });
//         hasAnimatedCameraRef.current = true; // ✅ prevent re-triggering
//       }, 60000)
//       return () => clearTimeout(timeout);
//     }
//   }, [origin, destination]);

//   // Fit map to coordinates when route is loaded (only once)
//   useEffect(() => {
//     if (coords?.length > 1 && mapRef?.current && !hasAnimatedOnce?.current) {
//       const edgePadding = {
//         top: 50,
//         right: 50,
//         bottom: 50, // Increased bottom padding
//         left: 50,
//       };

//       mapRef.current.fitToCoordinates(coords, {
//         edgePadding,
//         animated: true,
//       });

//       hasAnimatedOnce.current = true;
//     }
//   }, [coords]);

//   // Fetch the route from Google Directions API
//   const fetchRoute = async (origin, destination) => {
//     try {
//       const response = await fetch(
//         `https://maps.googleapis.com/maps/api/directions/json?origin=${Number(origin?.lat)},${Number(origin?.lng)}&destination=${Number(destination?.lat)},${Number(destination?.lng)}&key=${MAP_KEY}`,
//       );
//       const json = await response?.json();

//       if (json?.routes?.length) {
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

//   const getBearing = (start, end) => {
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
//   };

//   const handleMapReady = () => {
//     setTimeout(() => {
//       setIsMapReady(true);
//     }, 1000);
//   };

//   return (
//     <View
//       pointerEvents={isPendingReq ? 'none' : 'auto'}
//       style={styles.homeSubContainer}
//     >
//       <MapView
//         provider={PROVIDER_GOOGLE}
//         ref={mapRef}
//         style={[styles.mapContainer, mapContainerView]}
//         mapType={Platform.OS === 'ios' ? 'standard' : 'standard'}
//         customMapStyle={DuuittMapTheme}
//         region={{
//           latitude: Number(origin?.lat) || 30.7400,
//           longitude: Number(origin?.lng) || 76.7900,
//           latitudeDelta: 0.005,
//           longitudeDelta: 0.005
//         }}
//         zoomEnabled={true}
//         scrollEnabled={true}
//         rotateEnabled={true}
//         loadingEnabled={true}
//         showsCompass={false}
//         minZoomLevel={10}
//         maxZoomLevel={18}
//         showsBuildings={false}
//         //  showsUserLocation={true}
//         followsUserLocation={true}
//         showsTraffic={false}
//         onMapReady={handleMapReady}
//         onRegionChangeComplete={(region) => {
//           setMapManageRideDalta(region);
//           setMpaDalta(region);
//         }}
//       >

//         {/* Origin Marker */}
//         <Marker.Animated
//           ref={markerRef}
//           coordinate={animatedCoordinate}
//           tracksViewChanges={!isMapReady}
//         >
//           <Image
//             resizeMode="cover"
//             source={appImages.markerRideImage}
//             style={styles.markerBikeImage}
//           />
//         </Marker.Animated>

//         {/* Destination Marker */}
//         <Marker.Animated
//           ref={markerDesRef}
//           coordinate={animatedDesCoordinate}
//           tracksViewChanges={!isMapReady}
//         >
//           <Image
//             resizeMode="contain"
//             source={appImages.markerImage}
//             style={styles.markerImage}
//           />
//         </Marker.Animated>

//         {/* Route Polyline */}
//         {/* {Object.keys(destination)?.length > 0 && (<MapViewDirections
//           origin={{
//             latitude: Number(origin?.lat) || 30.7400,
//             longitude: Number(origin?.lng) || 76.7900,
//             latitudeDelta: 0.005,
//             longitudeDelta: 0.005
//           }}
//           destination={
//              {latitude: Number(destination?.lat),
//             longitude: Number(destination?.lng)}
//           }
//           apikey={API_KEY}
//           strokeWidth={6}
//           strokeColor="red"
//           optimizeWaypoints={true}
//           onStart={(params) => {
//             console.log(`Started routing between "${params.origin}" and "${params.destination}"`);
//           }}
//           onReady={result => {
//             console.log(`Distance: ${result.distance} km`)
//             console.log(`Duration: ${result.duration} min.`)
//             // fetchTime(result.distance, result.duration),
//               mapRef.current.fitToCoordinates(result.coordinates, {
//                 edgePadding: {
//                   // right: 30,
//                   // bottom: 300,
//                   // left: 30,
//                   // top: 100,
//                 },
//               });
//           }}
//           onError={(errorMessage) => {
//             // console.log('GOT AN ERROR');
//           }}
//         />)} */}
//         {coords?.length > 0 && (
//           <Polyline
//             coordinates={coords}
//             strokeWidth={4}
//             strokeColor={colors.main}
//           />
//         )}
//       </MapView>
//     </View>
//   );
// };

// export default memo(MapRoute);

// const styles = StyleSheet.create({
//   homeSubContainer: {
//     alignItems: 'flex-start',
//     justifyContent: 'center',
//     overflow: 'hidden',
//   },
//   mapContainer: {
//     alignSelf: 'center',
//     height: hp('35%'),
//     width: wp('100%'),
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









