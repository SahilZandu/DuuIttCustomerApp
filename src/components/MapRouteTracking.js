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
import { MAP_KEY } from '../halpers/AppLink';
import PopUpInProgess from './appPopUp/PopUpInProgess';


let currentLiveRiderLocation =  {}
let updateTimerValue = 20 // meters
let updateHeading = 0;
let showPickDesPopUpModal = false

const MapRouteTracking = ({ mapContainerView, origin, destination, isPendingReq, riderCustomerDetails,onKmsTime }) => {
  const { getCustomerWiseRiderLocation } = rootStore.orderStore;
  const mapRef = useRef(null);
  const hasAnimatedOnce = useRef(false);
  const hasAnimatedCameraRef = useRef(false)
  const markerRef = useRef(null);
  const markerDesRef = useRef(null);
  const prevLocationRef = useRef(null);
  const bearingRef = useRef(0);
  const [coords, setCoords] = useState([]);
  const [isMapReady, setIsMapReady] = useState(false);
  const [update, setUpdate] = useState(true);
  const [heading ,setHeading]=useState(0)
  const [showPickDesPopUp, setShowPickDesPopUp] = useState(false)


    const onUpdateRiderMoveValue = (kms) => {
    // console.log('kms',kms);
    if (kms >= 30) {
      updateTimerValue = 400;
    } else if (kms >= 25) {
      updateTimerValue = 300;
    } else if (kms >= 20) {
      updateTimerValue = 250;
    } else if (kms >= 15) {
      updateTimerValue = 200;
    } else if (kms >= 10) {
      updateTimerValue = 150;
    } else if (kms >= 7) {
      updateTimerValue = 100;
    } else if (kms >= 4) {
      updateTimerValue = 80;
    } else if (kms >= 2) {
      updateTimerValue = 50;
    } else if (kms >= 1) {
      updateTimerValue = 30;
    } else if (kms >= 0.5) {
      updateTimerValue = 20;
    } else {
      updateTimerValue = 10;
    }


  }

  useEffect(() => {
  if (origin && destination) {
    setUpdate(false);
    const updateRes = setTimeout(() => {
      setUpdate(true);
    }, 1500);

    // ✅ Proper cleanup
    return () => clearTimeout(updateRes);
  }
}, []);

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

    const getDistanceInMeters = (lat1, lon1, lat2, lon2) => {
  const R = 6371e3; // radius of Earth in meters
  const toRad = (x) => (x * Math.PI) / 180;
  const φ1 = toRad(lat1);
  const φ2 = toRad(lat2);
  const Δφ = toRad(lat2 - lat1);
  const Δλ = toRad(lon2 - lon1);

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) *
    Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // distance in meters
};


  useFocusEffect(
    useCallback(() => {
      setMapManageRideDaltaInitials();
      if ((origin && destination)) {
        currentLiveRiderLocation = origin ;
         prevLocationRef.current = origin
        animate(origin?.lat, origin?.lng, origin, destination)
      }

      // Fixed: Combined location effects to prevent conflicts
      if (riderCustomerDetails) {
        onUpdateCutomerLocation(riderCustomerDetails);

        const intervalId = setInterval(() => {
          onUpdateCutomerLocation(riderCustomerDetails);
        }, 5000);

        return () => {
          clearInterval(intervalId);
        };
      }
      showPickDesPopUpModal = false

    }, [origin, destination, riderCustomerDetails])
  );

  const onUpdateCutomerLocation = async (order) => {
    try {
      const res = await getCustomerWiseRiderLocation(order);
      console.log("res?.rider?.current_location--", res?.rider);

      const currentLoc = res?.rider?.current_location;
          updateHeading = res?.rider?.rider_moment ?? 0;
           setHeading(res?.rider?.rider_moment ?? 0);
      // ✅ Corrected: Object.keys (not Object.key)
      if (currentLoc && Object.keys(currentLoc)?.length > 0 ) {
        currentLiveRiderLocation = currentLoc
         console.log("✅ Rider current location:", currentLoc);
         if (
        !prevLocationRef.current ||
        prevLocationRef.current?.lat !== currentLoc?.lat ||
        prevLocationRef.current?.lng !== currentLoc?.lng
      ) {
        
     const distance = getDistanceInMeters(
      prevLocationRef?.current?.lat,
      prevLocationRef?.current?.lng,
      currentLoc?.lat,
      currentLoc?.lng
      );

     console.log("distance--customer",distance,updateTimerValue ,distance >=  updateTimerValue);
             // Only update if moved more than 50 meters
         if (distance >=  updateTimerValue ?? 50) {
          animate(currentLoc?.lat, currentLoc?.lng, currentLoc, destination);
          // Save the new location for next comparison
         prevLocationRef.current = { lat: currentLoc?.lat, lng: currentLoc?.lng };
         }else{
           console.log("Your are not cover the 50 meter distance",distance);
         }
      } else {
        console.log("Same location — skipping update",currentLoc, prevLocationRef.current);
      }
      } else {
        console.log("⚠️ No current location found.");
      }
    } catch (error) {
      console.log("❌ Error updating customer location:", error);
    }
  };


useEffect(() => {
  socketServices.initailizeSocket();

  socketServices.on('getremainingdistance', data => {
    console.log('Remaining distance data--:', data, data?.location);

    const newLocation = data?.location;
    if (!newLocation?.lat || !newLocation?.lng) return;
       updateHeading = data?.rider_moment
        setHeading(data?.rider_moment)

    // If no previous location, set it immediately
    if (!prevLocationRef.current) {
      prevLocationRef.current = newLocation;
      currentLiveRiderLocation = newLocation;
      animate(newLocation?.lat, newLocation?.lng, newLocation, destination);
      return;
    }

    // Calculate distance between previous and current locations
    const distance = getDistanceInMeters(
      prevLocationRef?.current?.lat,
      prevLocationRef?.current?.lng,
      newLocation?.lat,
      newLocation?.lng
    );

    console.log('Distance moved:', distance, 'meters');

    // Only update if moved more than 50 meters
    if (distance >= updateTimerValue ?? 50) {
      prevLocationRef.current = newLocation;
      currentLiveRiderLocation = newLocation;
      animate(newLocation.lat, newLocation.lng, newLocation, destination);
    }else{
     console.log("Your are not cover the 50 meter distance socket",distance);
    }
  });

  return () => {
    socketServices.removeListener('getremainingdistance');
  };
}, []);

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

  // Initialize markers and camera when data is available
  useEffect(() => {
    if (!origin || !destination) return;

    const lat = Number(origin?.lat);
    const lng = Number(origin?.lng);
    const destLat = Number(destination?.lat);
    const destLng = Number(destination?.lng);

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
    
  }, [origin, destination]);

  // Fit map to coordinates when route is loaded (only once)
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


  useEffect(() => {
    if ((coords?.length > 1 && mapRef?.current && !hasAnimatedOnce?.current)) {
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

   useEffect(() => {
    if (currentLiveRiderLocation && destination && mapRef?.current && coords) {
      const bearing = getBearing(currentLiveRiderLocation ?? origin, destination);
      // const lastCoord = coords[(coords?.length) / 2 - 1];
      const lastCoord = coords[0];
      mapRef?.current?.animateCamera(
        {
          center: lastCoord,
          // { latitude: currentLiveRiderLocation?.lat ?? origin?.lat, longitude: currentLiveRiderLocation?.lng ?? origin?.lng },
          heading: bearing, // rotate toward destination
          pitch: 0,
          zoom: 15.5, // keep zoom fixed
          edgePadding: {
            top: 50,
            right: 50,
            bottom: 50,
            left: 50
          },
          animated: true,
        },
        { duration: 500 }
      );
    }
  }, [currentLiveRiderLocation, coords]);

  
  // const fetchRoute = async (sender, receiver) => {
  //     try {
  //       const response = await fetch(
  //         `https://maps.googleapis.com/maps/api/directions/json?origin=${ Number(currentLiveRiderLocation?.lat ??  sender?.lat)},${Number(currentLiveRiderLocation?.lng ?? sender?.lng)}&destination=${Number(receiver?.lat)},${Number(receiver?.lng)}&alternatives=true&key=${MAP_KEY}`
  //       );
  
  //       const json = await response?.json();
  
  //       if (json?.routes?.length > 0) {
  //         // ✅ Find the shortest route based on total distance
  //         let shortestRoute = json?.routes[0];
  //         let minDistance = json?.routes[0]?.legs[0]?.distance?.value; // in meters
  
  //         json?.routes?.forEach(route => {
  //           const distance = route?.legs[0]?.distance?.value;
  //           if (distance < minDistance) {
  //             minDistance = distance;
  //             shortestRoute = route;
  //           }
  //         });
  
  //         // ✅ Decode the shortest route polyline
  //         const points = PolylineDecoder?.decode(shortestRoute?.overview_polyline?.points);
  //         const routeCoords = points?.map(point => ({
  //           latitude: point[0],
  //           longitude: point[1],
  //         }));
  
  //         // ✅ Update state
  //         setCoords(routeCoords);
  //         console.log(`✅ Shortest route selected customer — ${(minDistance / 1000).toFixed(2)} km`);
  //       } else {
  //         console.log('⚠️ No routes found.');
  //       }
  //     } catch (error) {
  //       console.log('❌ Error fetching route:', error);
  //     }
  //   };


    const fetchRoute = async (sender, receiver) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/directions/json?origin=${Number(currentLiveRiderLocation?.lat ?? sender?.lat)},${Number(currentLiveRiderLocation?.lng ?? sender?.lng)}&destination=${Number(receiver?.lat)},${Number(receiver?.lng)}&alternatives=true&key=${MAP_KEY}`
      );

      const json = await response?.json();

      if (json?.routes?.length > 0) {
        // ✅ Find the shortest route based on total distance
        let shortestRoute = json?.routes[0];
        let minDistance = json?.routes[0]?.legs[0]?.distance?.value; // in meters
        let minDuration = json?.routes[0]?.legs[0]?.duration?.value; // in seconds

        json?.routes?.forEach(route => {
          const distance = route?.legs[0]?.distance?.value;
          if (distance < minDistance) {
            minDistance = distance;
            minDuration = route?.legs[0]?.duration?.value;
            shortestRoute = route;
          }
        });

        // ✅ Decode the shortest route polyline
        const points = PolylineDecoder?.decode(shortestRoute?.overview_polyline.points);
        const routeCoords = points?.map(point => ({
          latitude: point[0],
          longitude: point[1],
        }));

        // ✅ Convert to readable values
        const distanceInKm = (minDistance / 1000).toFixed(2);
        const durationInMin = Math.floor(minDuration / 60);
        const durationInSec = Math.floor(minDuration % 60);

        console.log(`🚗 Shortest route: ${distanceInKm} km, ⏱️
         ${durationInMin} min ${durationInSec} sec`);

        // ✅ Format ETA as "Xm Ys"
        const eta = `${durationInMin}m ${durationInSec}s`;

        // console.log(`🚗 Shortest route: ${distanceInKm} km, ⏱️ ${eta}`);

        // ✅ Update state or send callback
        if ((distanceInKm <= 0.20 && !showPickDesPopUpModal && riderCustomerDetails?.status == 'picked')) {
          showPickDesPopUpModal = true;
          setShowPickDesPopUp(true);
        }
        setCoords(routeCoords);
        onUpdateRiderMoveValue(distanceInKm)
        onKmsTime?.(distanceInKm, eta);


      } else {
        console.log('⚠️ No routes found.');
      }
    } catch (error) {
      console.log('❌ Error fetching route:', error);
    }
  };

 

  const handleMapReady = () => {
    setTimeout(() => {
      setIsMapReady(true);
    }, 1000);
  };

  // if(update){

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
          rotateEnabled={true}
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
            rotation={ updateHeading ?? heading}
          >
            <Image
              resizeMode='contain'
                  // resizeMode="cover"
                 source={appImages.moveBike
                  // markerRideImage
                }
              //  source={appImages.markerMoveImage}
              style={[styles.markerBikeImage,
                  //  { transform: [{ rotate: `${70}deg` }] }
                 ]}
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
          {/* {(Object.keys(currentLiveRiderLocation ?? origin)?.length > 0 &&
           Object.keys(destination)?.length > 0) &&  (<MapViewDirections
          origin={{
            latitude: Number(currentLiveRiderLocation?.lat ?? origin?.lat) || 30.7400,
            longitude: Number(currentLiveRiderLocation?.lng ?? origin?.lng) || 76.7900,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005
          }}
          destination={
             {latitude: Number(destination?.lat),
             longitude: Number(destination?.lng)}
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
              mapRef.current.fitToCoordinates(result.coordinates, {
                edgePadding: {
                  // right: 50,
                  // bottom: 50,
                  // left: 50,
                  // top: 50,
                },
              });
          }}
          onError={(errorMessage) => {
            console.log('GOT AN ERROR',errorMessage);
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
        </View>}  */}
          <PopUpInProgess
            topIcon={false}
            CTATitle={'ok'}
           visible={showPickDesPopUp}
          type={'Error'}
        onClose={() => { setShowPickDesPopUp(false), showPickDesPopUpModal = true }}
        title={riderCustomerDetails?.status == 'picked' ? "Dropped Location" : "Pickup Location"}
        text={
          riderCustomerDetails?.status == 'picked' ? "Rider has reached and completed the ride at the destination" : "Rider has arrived at the pickup location"
        }
              />
    </View>
  );
// }else{
//   return null
// }
};

export default MapRouteTracking;

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
    height:70,  //30,
    width: 70,   //30,
    marginTop: Platform.OS === 'ios' ? '25%' : 0,
  },
});









// import React, { useState, useRef, useEffect, useCallback } from 'react';
// import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Image, Platform } from 'react-native';
// import MapView, { Marker, AnimatedRegion, PROVIDER_GOOGLE } from 'react-native-maps';
// import MapViewDirections from 'react-native-maps-directions';
// import { appImages } from '../commons/AppImages';
// import { DuuittMapTheme } from './DuuittMapTheme';
// import {
//     heightPercentageToDP as hp,
//     widthPercentageToDP as wp,
// } from 'react-native-responsive-screen';
// import { colors } from '../theme/colors';

// import { locationPermission, getCurrentLocation } from '../halpers/helperFunction';
// import socketServices from '../socketIo/SocketServices';
// import { rootStore } from '../stores/rootStore';

// const screen = Dimensions.get('window');
// const ASPECT_RATIO = screen.width / screen.height;
// const LATITUDE_DELTA = 0.04;
// const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
// const GOOGLE_MAP_KEY = 'AIzaSyAGYLXByGkajbYglfVPK4k7VJFOFsyS9EA'; // Consider moving this to env variables

// const MapRouteTracking = ({ origin, destination, mapContainerView, riderCustomerDetails }) => {
//     const mapRef = useRef()
//     const markerRef = useRef()
//     const updateTimeoutRef = useRef(null);
//     const [isMapReady, setIsMapReady] = useState(false);

//     const [state, setState] = useState({
//         curLoc: {
//             latitude: 30.4766,
//             longitude: 76.5905,
//         },
//         destinationCords: {
//             latitude: destination?.lat || 30.7046, // Fixed: Added fallback
//             longitude: destination?.lng || 76.7179, // Fixed: Added fallback
//         },
//         isLoading: false,
//         coordinate: new AnimatedRegion({
//             latitude: origin?.lat ?? 30.4766,
//             longitude: origin?.lng ?? 76.5905,
//             latitudeDelta: LATITUDE_DELTA,
//             longitudeDelta: LONGITUDE_DELTA
//         }),
//         time: 0,
//         distance: 0,
//         heading: 0
//     })

//     const { curLoc, time, distance, destinationCords, isLoading, coordinate, heading } = state

//     const updateState = (data) => setState((state) => ({ ...state, ...data }));


//     // Fixed: Handle origin updates properly
//     // useEffect(() => {
//     //     if (origin?.lat && origin?.lng) {
//     //         const { lat: latitude, lng: longitude } = origin;
//     //         setTimeout(() => {
//     //             setState({
//     //                 ...state,
//     //                 curLoc: { latitude, longitude },
//     //                 coordinate: new AnimatedRegion({
//     //                     latitude: latitude,
//     //                     longitude: longitude,
//     //                     latitudeDelta: LATITUDE_DELTA,
//     //                     longitudeDelta: LONGITUDE_DELTA
//     //                 })
//     //             })
//     //             animate(latitude, longitude);
//     //             updateState({
//     //                 curLoc: { latitude, longitude },
//     //                 coordinate: new AnimatedRegion({
//     //                     latitude: latitude,
//     //                     longitude: longitude,
//     //                     latitudeDelta: LATITUDE_DELTA,
//     //                     longitudeDelta: LONGITUDE_DELTA
//     //                 })
//     //             });
//     //         }, 500)
//     //     }
//     // }, [origin])


//     // Add these at the top of your component


// // Memoize the update function
// const updateOriginLocation = useCallback((latitude, longitude) => {
//     const newCoordinate = new AnimatedRegion({
//         latitude: latitude,
//         longitude: longitude,
//         latitudeDelta: LATITUDE_DELTA,
//         longitudeDelta: LONGITUDE_DELTA
//     });

//     updateState({
//         curLoc: { latitude, longitude },
//         coordinate: newCoordinate
//     });

//     animate(latitude, longitude);
// }, [LATITUDE_DELTA, LONGITUDE_DELTA]); // Add dependencies if needed

// // Updated useEffect
// useEffect(() => {
//     if (origin?.lat && origin?.lng) {
//         const { lat: latitude, lng: longitude } = origin;
        
//         // Clear previous timeout
//         if (updateTimeoutRef?.current) {
//             clearTimeout(updateTimeoutRef.current);
//         }

//         // Set new timeout
//         updateTimeoutRef.current = setTimeout(() => {
//             updateOriginLocation(latitude, longitude);
//         }, 2000);
//     }

//     // Cleanup function
//     return () => {
//         if (updateTimeoutRef?.current) {
//             clearTimeout(updateTimeoutRef.current);
//         }
//     };
// }, [origin?.lat, origin?.lng, updateOriginLocation]);





//     // Fixed: Combined location effects to prevent conflicts
//     // useEffect(() => {
//     //     socketServices.initailizeSocket();
//     //     let intervalId;
//     //     const initializeLocation = async () => {
//     //         const hasPermission = await locationPermission();
//     //         if (hasPermission) {
//     //             const { latitude, longitude, heading } = await getCurrentLocation();

//     //             animate(latitude, longitude);
//     //             getSocketLocation(latitude, longitude);
//     //             updateState({
//     //                 curLoc: { latitude, longitude },
//     //                 coordinate: new AnimatedRegion({
//     //                     latitude: latitude,
//     //                     longitude: longitude,
//     //                     latitudeDelta: LATITUDE_DELTA,
//     //                     longitudeDelta: LONGITUDE_DELTA
//     //                 }),
//     //                 heading,
//     //             });
//     //         }
//     //     };

//     //     initializeLocation();

//     //     // Set up interval for live location updates
//     //     intervalId = setInterval(initializeLocation, 6000);

//     //     return () => {
//     //         if (intervalId) clearInterval(intervalId);
//     //     };
//     // }, []);


//     useEffect(() => {
//         socketServices.initailizeSocket();

//         socketServices.on('getremainingdistance', data => {
//             console.log('Remaining distance data--:', data, data?.location);
//             alert("yes")
//             if ((data && data?.location && data?.location?.lat)) {
//                 alert("yes1")
//                 const { lat: latitude, lng: longitude } = data?.location;
//                 animate(latitude, longitude);
//                 updateState({
//                     curLoc: { latitude, longitude },
//                     coordinate: new AnimatedRegion({
//                         latitude: latitude,
//                         longitude: longitude,
//                         latitudeDelta: LATITUDE_DELTA,
//                         longitudeDelta: LONGITUDE_DELTA
//                     }),
//                 });
//             }
//         });
//     }, [])



//     // Fixed: Handle destination updates properly
//     useEffect(() => {
//         if (destination?.lat && destination?.lng) {
//             setTimeout(() => {
//                 updateState({
//                     destinationCords: {
//                         latitude: destination.lat,
//                         longitude: destination.lng,
//                     }
//                 });
//             }, 1000)
//         }
//     }, [destination])

//     const animate = (latitude, longitude) => {
//         const newCoordinate = { latitude, longitude };
//         if (Platform.OS == 'android') {
//             if (markerRef?.current) {
//                 markerRef.current.animateMarkerToCoordinate(newCoordinate, 7000);
//             }
//         } else {
//             coordinate.timing(newCoordinate).start();
//         }
//     }


//     const fetchTime = (d, t) => {
//         updateState({
//             distance: d,
//             time: t
//         })
//     }

//     const handleMapReady = () => {
//         setIsMapReady(true);
//     };

//     // Fixed: Check if coordinates are valid before rendering map components
//     const hasValidCoordinates = coordinate &&
//         coordinate?.latitude &&
//         coordinate?.longitude &&
//         destinationCords &&
//         destinationCords?.latitude &&
//         destinationCords?.longitude;


//     const getBearing = (start, end) => {
//         const lat1 = (start.lat * Math.PI) / 180;
//         const lon1 = (start.lng * Math.PI) / 180;
//         const lat2 = (end.lat * Math.PI) / 180;
//         const lon2 = (end.lng * Math.PI) / 180;
//         const dLon = lon2 - lon1;
//         const y = Math.sin(dLon) * Math.cos(lat2);
//         const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
//         const bearing = Math.atan2(y, x);
//         const bearingDeg = (bearing * 180) / Math.PI;
//         return (bearingDeg + 360) % 360;
//     };

//     return (
//         <View style={styles.container}>
//             {distance !== 0 && time !== 0 && (
//                 <View style={{ alignItems: 'center', marginVertical: 16 }}>
//                     <Text>Time left: {time.toFixed(0)} min</Text>
//                     <Text>Distance left: {distance.toFixed(2)} km</Text>
//                 </View>
//             )}

//             {hasValidCoordinates ? (
//                 <View style={{ flex: 1 }}>
//                     <MapView
//                         provider={PROVIDER_GOOGLE}
//                         ref={mapRef}
//                         mapType="standard"
//                         style={[styles.mapContainer, mapContainerView]}
//                         customMapStyle={DuuittMapTheme}
//                         initialRegion={{
//                             ...curLoc,
//                             latitudeDelta: LATITUDE_DELTA,
//                             longitudeDelta: LONGITUDE_DELTA,
//                         }}
//                         onMapReady={handleMapReady}
//                         showsUserLocation={false} // Fixed: Use custom marker instead
//                     >
//                         {/* Current Location Marker - Fixed conditional rendering */}
//                         <Marker.Animated
//                             ref={markerRef}
//                             coordinate={coordinate}
//                         // tracksViewChanges={!isMapReady}
//                         >
//                             <Image
//                                 source={appImages.markerRideImage}
//                                 style={{
//                                     width: 30,
//                                     height: 30,
//                                     // transform: [{ rotate: `${heading}deg` }]
//                                 }}
//                                 resizeMode="contain"
//                             />
//                         </Marker.Animated>

//                         {/* Destination Marker - Fixed conditional rendering */}
//                         {destinationCords.latitude && destinationCords.longitude && (
//                             <Marker
//                                 coordinate={destinationCords}
//                                 tracksViewChanges={!isMapReady}
//                             //  image={appImages?.markerImage}

//                             >
//                                 <Image
//                                     resizeMode="contain"
//                                     source={appImages.markerImage}
//                                     style={styles.markerImage}
//                                 />
//                             </Marker>
//                         )}

//                         {/* Directions - Fixed conditional rendering */}
//                         {destinationCords?.latitude && destinationCords?.longitude && (
//                             <MapViewDirections
//                                 origin={curLoc}
//                                 destination={destinationCords}
//                                 apikey={GOOGLE_MAP_KEY}
//                                 strokeWidth={4}
//                                 strokeColor={colors.green}
//                                 optimizeWaypoints={true}
//                                 resetOnChange={false} // Important: Prevent reset on changes
//                                 onStart={(params) => {
//                                     console.log(`Started routing between "${params?.origin}" and "${params?.destination}"`);
//                                 }}
//                                 onReady={result => {
//                                     console.log("result----:", result, result.coordinates);

//                                     console.log(`Distance: ${result.distance} km`)
//                                     console.log(`Duration: ${result.duration} min.`)
//                                     fetchTime(result?.distance, result?.duration);

//                                     if (mapRef?.current && result?.coordinates) {
//                                         mapRef.current.fitToCoordinates(result.coordinates, {
//                                             edgePadding: {
//                                                 right: 30,
//                                                 bottom: 100,
//                                                 left: 30,
//                                                 top: 100,
//                                             },
//                                         });
//                                         // const bearing = getBearing({ lat: result.coordinates[0]?.latitude, lng: result.coordinates[1]?.longitude }, { lat: destinationCords?.latitude, lng: destinationCords?.longitude });
//                                         // const camera = {
//                                         //     center: { latitude: result.coordinates[0]?.latitude, longitude: result.coordinates[1]?.longitude },
//                                         //     heading: bearing,
//                                         //     pitch: 30,
//                                         //     zoom: 17,
//                                         //     altitude: 100,
//                                         // };

//                                         // mapRef.current.animateCamera(camera, { duration: 1000 });

//                                     }
//                                 }}
//                                 onError={(errorMessage) => {
//                                     console.log('Directions error:', errorMessage);
//                                 }}
//                             />
//                         )}
//                     </MapView>


//                 </View>
//             ) : (
//                 <View style={[styles.mapContainer, mapContainerView, { justifyContent: 'center', alignItems: 'center' }]}>
//                     <Text>Loading map...</Text>
//                 </View>
//             )}

//         </View>
//     );
// };

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//     },
//     mapContainer: {
//         alignSelf: 'center',
//         height: hp('35%'),
//         width: wp('100%'),
//     },
//     markerImage: {
//         height: 30,
//         width: 30,
//         marginTop: Platform.OS === 'ios' ? '25%' : 0,
//     },
// });

// export default MapRouteTracking;
