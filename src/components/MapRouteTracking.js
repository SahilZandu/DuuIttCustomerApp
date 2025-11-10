
import React, {
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { StyleSheet, View, Image, Platform, Easing } from 'react-native';
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

   // Calculate heading from movement direction (when GPS heading is not available)
  const calculateHeadingFromMovement = useCallback((prevLat, prevLng, currentLat, currentLng) => {
    if (!prevLat || !prevLng || !currentLat || !currentLng) {
      return null;
    }
    // Calculate bearing from previous position to current position
    const lat1 = (prevLat * Math.PI) / 180;
    const lon1 = (prevLng * Math.PI) / 180;
    const lat2 = (currentLat * Math.PI) / 180;
    const lon2 = (currentLng * Math.PI) / 180;
    const dLon = lon2 - lon1;
    const y = Math.sin(dLon) * Math.cos(lat2);
    const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
    const bearing = Math.atan2(y, x);
    const bearingDeg = (bearing * 180) / Math.PI;
    return (bearingDeg + 360) % 360;
  }, []);

  const onUpdateCutomerLocation = async (order) => {
    try {
      const res = await getCustomerWiseRiderLocation(order);
      console.log("res?.rider?.current_location--", res?.rider);

      const currentLoc = res?.rider?.current_location;
         let actualHeading =  res?.rider?.rider_moment ?? updateHeading;
          if (!actualHeading || isNaN(actualHeading) || actualHeading === 0) {
          const prevPos = prevLocationRef.current;
          if (prevPos) {
            const calculatedHeading = calculateHeadingFromMovement(
              prevPos.lat,
              prevPos.lng,
              currentLoc?.lat,
               currentLoc?.lng,
            );
            if (calculatedHeading !== null) {
              updateHeading = calculatedHeading;
              setHeading(calculatedHeading)
              console.log('📐 Calculated heading from movement:', actualHeading.toFixed(1));
            }else{
                updateHeading = res?.rider?.rider_moment ?? 0;
                 setHeading(res?.rider?.rider_moment ?? 0);
            }
             }else{
           updateHeading = res?.rider?.rider_moment ?? 0;
           setHeading(res?.rider?.rider_moment ?? 0);
            }
         }
     
      // ✅ Corrected: Object.keys (not Object.key)
      if (currentLoc && Object?.keys(currentLoc)?.length > 0 ) {
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
      
         let actualHeading =  data?.rider_moment ?? updateHeading;
          if (!actualHeading || isNaN(actualHeading) || actualHeading === 0) {
          const prevPos = prevLocationRef.current;
          if (prevPos) {
            const calculatedHeading = calculateHeadingFromMovement(
              prevPos.lat,
              prevPos.lng,
              newLocation?.lat,
              newLocation?.lng,
            );
            if (calculatedHeading !== null) {
              updateHeading = calculatedHeading;
              setHeading(calculatedHeading)
              console.log('📐 Calculated heading from movement newLocation:', actualHeading.toFixed(1));
            }else{
               updateHeading = data?.rider_moment
        setHeading(data?.rider_moment)
            }
          }else{
             updateHeading = data?.rider_moment
        setHeading(data?.rider_moment)
          }
         }

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
    // animatedCoordinate.timing({
    //   latitude: Number(newCoordinate?.latitude),
    //   longitude: Number(newCoordinate?.longitude),
    //   duration: 7000,
    //   useNativeDriver: false,
    // }).start();

  if (Platform.OS === 'android') {
      animatedCoordinate.timing({
      latitude: Number(newCoordinate?.latitude),
      longitude: Number(newCoordinate?.longitude),
      duration: 7000,
      useNativeDriver: false,
    }).start();
    
  } else {
    // For iOS, AnimatedRegion works better when using Animated.Value updates
      animatedCoordinate.timing({
      latitude: Number(newCoordinate?.latitude),
      longitude: Number(newCoordinate?.longitude),
      duration: 200,
      easing:Easing.linear,
      useNativeDriver: false,
    }).start();

  }

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
          zoom: 17, // keep zoom fixed
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
            rotation={updateHeading ?? heading}
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
    height:60,  //30,
    width: 60,   //30,
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
// import { Animated } from 'react-native';
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
// import socketServices from '../socketIo/SocketServices';
// import { rootStore } from '../stores/rootStore';
// import { MAP_KEY } from '../halpers/AppLink';
// import PopUpInProgess from './appPopUp/PopUpInProgess';
// import { startBackgroundTask } from '../halpers/BackgroundServices/BackgroundServices';


// let currentLiveRiderLocation =  {}
// let updateTimerValue = 20 // meters
// let updateHeading = 0;
// let showPickDesPopUpModal = false

// const MapRouteTracking = ({ mapContainerView, origin, destination, isPendingReq, riderCustomerDetails,onKmsTime }) => {
//   const { getCustomerWiseRiderLocation } = rootStore.orderStore;
//   const mapRef = useRef(null);
//   const hasAnimatedOnce = useRef(false);
//   const hasAnimatedCameraRef = useRef(false);
//   const cameraAnimationTimeoutRef = useRef(null);
//   const isInitializedRef = useRef(false); // Track if initial state has been set
//   const markerRef = useRef(null);
//   const markerDesRef = useRef(null);
//   const prevLocationRef = useRef(null);
//   const bearingRef = useRef(0);
//   const [coords, setCoords] = useState([]);
//   const [isMapReady, setIsMapReady] = useState(false);
//   const [update, setUpdate] = useState(true);
//   const [heading ,setHeading]=useState(0)
//   const [showPickDesPopUp, setShowPickDesPopUp] = useState(false)
//   const isMountedRef = useRef(true);
//   const fetchAbortControllerRef = useRef(null);
//   const mapReadyTimeoutRef = useRef(null);
//   const socketListenerRef = useRef(null);
//   const rotationAnim = useRef(new Animated.Value(0)).current;
//   const previousBearingRef = useRef(0);
//   const lastRotationRef = useRef(0);
//   const [currentRotation, setCurrentRotation] = useState(0);
//   const riderCustomerDetailsRef = useRef(riderCustomerDetails); // Track riderCustomerDetails in ref
//   const originRef = useRef(origin); // Track origin in ref
//   const destinationRef = useRef(destination); // Track destination in ref
//   const previousStatusRef = useRef(riderCustomerDetails?.status); // Track previous status
  
//   // State to hold clean coordinate values (without delta)
//   const [markerCoordinate, setMarkerCoordinate] = useState({
//     latitude: Number(origin?.lat) || 30.7400,
//     longitude: Number(origin?.lng) || 76.7900,
//   });
  
//   const [destinationCoordinate, setDestinationCoordinate] = useState({
//     latitude: Number(destination?.lat) || 30.7400,
//     longitude: Number(destination?.lng) || 76.7900,
//   });
  
//   // Helper function to compare coordinates by value
//   const areCoordinatesEqual = useCallback((coord1, coord2) => {
//     if (!coord1 || !coord2) return false;
//     const lat1 = Number(coord1?.lat ?? coord1?.latitude);
//     const lng1 = Number(coord1?.lng ?? coord1?.longitude);
//     const lat2 = Number(coord2?.lat ?? coord2?.latitude);
//     const lng2 = Number(coord2?.lng ?? coord2?.longitude);
//     return lat1 === lat2 && lng1 === lng2;
//   }, []);
  
//   // Update refs when props change (without triggering re-renders)
//   useEffect(() => {
//     riderCustomerDetailsRef.current = riderCustomerDetails;
//   }, [riderCustomerDetails]);
  
//   // Update origin and destination refs, but only update markers if coordinates actually changed
//   useEffect(() => {
//     const originChanged = !areCoordinatesEqual(originRef.current, origin);
//     const destinationChanged = !areCoordinatesEqual(destinationRef.current, destination);
//     const statusChanged = previousStatusRef.current !== riderCustomerDetails?.status;
    
//     // Check status change before updating refs
//     if (statusChanged) {
//       console.log('📊 Status changed from', previousStatusRef.current, 'to', riderCustomerDetails?.status);
//     }
    
//     // Update refs
//     originRef.current = origin;
//     destinationRef.current = destination;
//     previousStatusRef.current = riderCustomerDetails?.status;
    
//     // Only update destination marker if coordinates actually changed
//     if (destinationChanged && destination?.lat && destination?.lng && isMountedRef.current) {
//       const destLat = Number(destination.lat);
//       const destLng = Number(destination.lng);
//       if (!isNaN(destLat) && !isNaN(destLng)) {
//         setDestinationCoordinate({
//           latitude: destLat,
//           longitude: destLng,
//         });
//         animatedDesCoordinate.setValue({
//           latitude: destLat,
//           longitude: destLng,
//         });
//         console.log('📍 Destination marker updated:', { lat: destLat, lng: destLng });
        
//         // Fetch new route when destination changes (especially when status changes)
//         if (isInitializedRef.current && origin?.lat && origin?.lng) {
//           // Use current rider location if available, otherwise use origin
//           const routeOrigin = currentLiveRiderLocation?.lat && currentLiveRiderLocation?.lng 
//             ? currentLiveRiderLocation 
//             : origin;
//           fetchRoute(routeOrigin, destination);
//           console.log('🔄 Route updated due to destination change (status:', riderCustomerDetails?.status, ')');
//         }
//       }
//     }
    
//     // Only update origin marker if coordinates actually changed (and not already initialized)
//     if (originChanged && origin?.lat && origin?.lng && isMountedRef.current && !isInitializedRef.current) {
//       const lat = Number(origin.lat);
//       const lng = Number(origin.lng);
//       if (!isNaN(lat) && !isNaN(lng)) {
//         setMarkerCoordinate({
//           latitude: lat,
//           longitude: lng,
//         });
//         animatedCoordinate.setValue({
//           latitude: lat,
//           longitude: lng,
//         });
//         console.log('📍 Origin marker updated:', { lat, lng });
//       }
//     }
    
//     // If status changed but destination coordinates are the same, no route update needed
//     // (This handles edge cases where status changes but destination prop reference changes without coordinate change)
//   }, [origin, destination, riderCustomerDetails?.status, areCoordinatesEqual]);


//     const onUpdateRiderMoveValue = (kms) => {
//     // console.log('kms',kms);
//     if (kms >= 30) {
//       updateTimerValue = 400;
//     } else if (kms >= 25) {
//       updateTimerValue = 300;
//     } else if (kms >= 20) {
//       updateTimerValue = 250;
//     } else if (kms >= 15) {
//       updateTimerValue = 200;
//     } else if (kms >= 10) {
//       updateTimerValue = 150;
//     } else if (kms >= 7) {
//       updateTimerValue = 100;
//     } else if (kms >= 4) {
//       updateTimerValue = 80;
//     } else if (kms >= 2) {
//       updateTimerValue = 50;
//     } else if (kms >= 1) {
//       updateTimerValue = 30;
//     } else if (kms >= 0.5) {
//       updateTimerValue = 20;
//     } else {
//       updateTimerValue = 10;
//     }


//   }

//   useEffect(() => {
//   if (origin && destination) {
//     setUpdate(false);
//     const updateRes = setTimeout(() => {
//       setUpdate(true);
//     }, 1500);

//     // ✅ Proper cleanup
//     return () => clearTimeout(updateRes);
//   }
// }, []);

//   // Use animated regions for smooth marker movement
//   // NOTE: AnimatedRegion for markers should ONLY have latitude and longitude (no delta values)
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
//       latitude: Number(destination?.lat) || 30.7400,
//       longitude: Number(destination?.lng) || 76.7900,
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

//     const getDistanceInMeters = (lat1, lon1, lat2, lon2) => {
//   const R = 6371e3; // radius of Earth in meters
//   const toRad = (x) => (x * Math.PI) / 180;
//   const φ1 = toRad(lat1);
//   const φ2 = toRad(lat2);
//   const Δφ = toRad(lat2 - lat1);
//   const Δλ = toRad(lon2 - lon1);

//   const a =
//     Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
//     Math.cos(φ1) * Math.cos(φ2) *
//     Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
//   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

//   return R * c; // distance in meters
// };

//   // Calculate heading from movement direction (when GPS heading is not available)
//   const calculateHeadingFromMovement = useCallback((prevLat, prevLng, currentLat, currentLng) => {
//     if (!prevLat || !prevLng || !currentLat || !currentLng) {
//       return null;
//     }
//     // Calculate bearing from previous position to current position
//     const lat1 = (prevLat * Math.PI) / 180;
//     const lon1 = (prevLng * Math.PI) / 180;
//     const lat2 = (currentLat * Math.PI) / 180;
//     const lon2 = (currentLng * Math.PI) / 180;
//     const dLon = lon2 - lon1;
//     const y = Math.sin(dLon) * Math.cos(lat2);
//     const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
//     const bearing = Math.atan2(y, x);
//     const bearingDeg = (bearing * 180) / Math.PI;
//     return (bearingDeg + 360) % 360;
//   }, []);

//   // Animate rotation smoothly
//   const animateRotation = useCallback((newHeading) => {
//     if (!isMountedRef.current || newHeading === null || newHeading === undefined || isNaN(newHeading)) {
//       return;
//     }

//     // Normalize heading to 0-360
//     let normalizedHeading = newHeading % 360;
//     if (normalizedHeading < 0) {
//       normalizedHeading += 360;
//     }

//     // Get current rotation value from the animated value or ref
//     const currentRotationValue = rotationAnim._value || lastRotationRef.current || 0;

//     // Calculate shortest rotation path (handle 360/0 wrap-around)
//     let rotationDiff = normalizedHeading - currentRotationValue;
//     if (rotationDiff > 180) {
//       rotationDiff -= 360;
//     } else if (rotationDiff < -180) {
//       rotationDiff += 360;
//     }

//     const targetRotation = currentRotationValue + rotationDiff;

//     // Update ref immediately
//     lastRotationRef.current = normalizedHeading;

//     // Animate rotation smoothly
//     Animated.timing(rotationAnim, {
//       toValue: targetRotation,
//       duration: 500, // Smooth 500ms rotation animation
//       useNativeDriver: false, // Rotation must use native driver false for marker rotation
//     }).start((finished) => {
//       // Ensure final value is correct
//       if (finished && isMountedRef.current) {
//         rotationAnim.setValue(normalizedHeading);
//         lastRotationRef.current = normalizedHeading;
//         setCurrentRotation(normalizedHeading);
//       }
//     });

//     // Update state immediately for responsive UI (don't wait for animation)
//     setCurrentRotation(normalizedHeading);

//     console.log('🔄 Rotating bike marker:', {
//       from: currentRotationValue.toFixed(1) + '°',
//       to: normalizedHeading.toFixed(1) + '°',
//       diff: rotationDiff.toFixed(1) + '°',
//     });
//   }, []);


//   useFocusEffect(
//     useCallback(() => {
//       isMountedRef.current = true;
//       setMapManageRideDaltaInitials();
//       onStartBackgroundTask()
      
//       // Don't reset animation flags if already initialized - preserve state
//       if (!isInitializedRef.current) {
//         hasAnimatedOnce.current = false;
//       }
      
//       // Clear any pending camera animation
//       if (cameraAnimationTimeoutRef.current) {
//         clearTimeout(cameraAnimationTimeoutRef.current);
//         cameraAnimationTimeoutRef.current = null;
//       }
      
//       // Only initialize if not already initialized - prevent resetting to initial state
//       if ((origin && destination) && !isInitializedRef.current) {
//         currentLiveRiderLocation = origin;
//         // Initialize previous location
//         if (!prevLocationRef.current) {
//           prevLocationRef.current = { lat: origin.lat, lng: origin.lng };
//         }
        
//         // Initialize current position
//         currentPositionRef.current = {
//           latitude: Number(origin.lat),
//           longitude: Number(origin.lng),
//         };
        
//         // Set initial marker position immediately (only if not already set)
//         if (isMountedRef.current && origin?.lat && origin?.lng) {
//           const lat = Number(origin.lat);
//           const lng = Number(origin.lng);
//           if (!isNaN(lat) && !isNaN(lng)) {
//             // Only set if marker coordinate is not already valid
//             if (!markerCoordinate || !markerCoordinate.latitude || !markerCoordinate.longitude) {
//               setMarkerCoordinate({
//                 latitude: lat,
//                 longitude: lng,
//               });
//               animatedCoordinate.setValue({
//                 latitude: lat,
//                 longitude: lng,
//               });
//             }
//           }
//         }
//       }

//       // Fixed: Combined location effects to prevent conflicts
//       // Use ref to get current value without causing re-runs
//       let intervalId = null;
//       const currentRiderDetails = riderCustomerDetailsRef.current;
//       if (currentRiderDetails) {
//         // Initialize previous location on focus
//         if (origin && origin.lat && origin.lng) {
//           prevLocationRef.current = { lat: origin.lat, lng: origin.lng };
//           currentPositionRef.current = {
//             latitude: Number(origin.lat),
//             longitude: Number(origin.lng),
//           };
//         }
        
//         // Call immediately, then set up interval
//         // Use ref inside interval to always get latest value
//         onUpdateCutomerLocation(currentRiderDetails);
//         intervalId = setInterval(() => {
//           if (isMountedRef.current) {
//             // Always use the latest riderCustomerDetails from ref
//             const latestRiderDetails = riderCustomerDetailsRef.current;
//             if (latestRiderDetails) {
//               onUpdateCutomerLocation(latestRiderDetails);
//             }
//           }
//         }, 5000);
//       }

//         return () => {
//         isMountedRef.current = false;
//         if (intervalId) {
//           clearInterval(intervalId);
//         }
//         // Cancel any ongoing fetch requests
//         if (fetchAbortControllerRef.current) {
//           fetchAbortControllerRef.current.abort();
//           fetchAbortControllerRef.current = null;
//         }
//         // Clear timeout
//         if (mapReadyTimeoutRef.current) {
//           clearTimeout(mapReadyTimeoutRef.current);
//           mapReadyTimeoutRef.current = null;
//         }
//       };
//     }, [origin, destination]) // Removed riderCustomerDetails from dependencies
//   );


//   const onStartBackgroundTask = async () => {
//     try {
//       // Set rider customer details for background service
//       await startBackgroundTask();
//       console.log('✅ Background task started from MapRouteTracking');
//     } catch (error) {
//       console.log('❌ Error starting background task:', error);
//     }
//   };


//   const onUpdateCutomerLocation = async (order) => {
//     if (!isMountedRef.current) return;
    
//     try {
//       const res = await getCustomerWiseRiderLocation(order);
//       if (!isMountedRef.current) return;
      
//       console.log("res?.rider?.current_location--", res?.rider);

//       const currentLoc = res?.rider?.current_location;
//           updateHeading = res?.rider?.rider_moment ?? 0;
//           if (isMountedRef.current) {
//            setHeading(res?.rider?.rider_moment ?? 0);
//           }
//       // ✅ Corrected: Object.keys (not Object.key)
//       if (currentLoc && Object.keys(currentLoc)?.length > 0 ) {
//         currentLiveRiderLocation = currentLoc;
//          console.log("✅ Rider current location:", currentLoc);
        
//         // Check if location actually changed
//         const hasLocationChanged = !prevLocationRef.current ||
//         prevLocationRef.current?.lat !== currentLoc?.lat ||
//           prevLocationRef.current?.lng !== currentLoc?.lng;
        
//         if (hasLocationChanged) {
//           // Calculate distance for logging
//           const distance = prevLocationRef.current
//             ? getDistanceInMeters(
//                 prevLocationRef.current.lat,
//                 prevLocationRef.current.lng,
//                 currentLoc.lat,
//                 currentLoc.lng
//               )
//             : 0;

//           console.log("distance--customer", distance, "meters");

//           // Always update marker if location changed (even small movements for smooth tracking)
//           if (distance >= (updateTimerValue ?? 0 ) || !prevLocationRef.current) {
//             // Save PREVIOUS location BEFORE updating (needed for heading calculation)
//             const previousLocation = prevLocationRef.current ? { ...prevLocationRef.current } : null;
            
//             // Update heading if available from API - set before animate
//             const headingValue = res?.rider?.rider_moment ?? updateHeading ?? 0;
//             if (headingValue > 0) {
//               updateHeading = headingValue;
//               if (isMountedRef.current) {
//                 setHeading(headingValue);
//               }
//             }
            
//             // Update current position reference for distance calculation
//             currentPositionRef.current = {
//               latitude: Number(currentLoc.lat),
//               longitude: Number(currentLoc.lng),
//             };
            
//             // Animate with new location - pass previous location for heading calculation
//             animate(currentLoc.lat, currentLoc.lng, currentLoc, destination, previousLocation);
            
//             // Save the new location AFTER calling animate (so next time we have the previous location)
//             prevLocationRef.current = { lat: currentLoc.lat, lng: currentLoc.lng };
//       } else {
//             console.log("No movement detected", distance);
//           }
//         } else {
//           console.log("Same location — skipping update", currentLoc, prevLocationRef.current);
//       }
//       } else {
//         console.log("⚠️ No current location found.");
//       }
//     } catch (error) {
//       if (isMountedRef.current) {
//       console.log("❌ Error updating customer location:", error);
//       }
//     }
//   };


// useEffect(() => {
//   if (!isMountedRef.current) return;
  
//   // Only initialize socket if not already connected
//   if (!socketServices.isSocketConnected()) {
//   socketServices.initailizeSocket();
//   }

//   const handleSocketData = (data) => {
//     if (!isMountedRef.current) return;
    
//     console.log('Remaining distance data--:', data, data?.location);

//     const newLocation = data?.location;
//     if (!newLocation?.lat || !newLocation?.lng) return;
//        updateHeading = data?.rider_moment ?? 0;
//         if (isMountedRef.current) {
//           setHeading(data?.rider_moment ?? 0);
//         }

//     // If no previous location, set it immediately and initialize
//     if (!prevLocationRef.current) {
//       prevLocationRef.current = { ...newLocation };
//       currentLiveRiderLocation = newLocation;
//       // Initialize current position for distance calculation
//       currentPositionRef.current = {
//         latitude: Number(newLocation.lat),
//         longitude: Number(newLocation.lng),
//       };
//       // Initialize bearing if heading is available
//       if (updateHeading && updateHeading > 0 && !isNaN(updateHeading)) {
//         const normalizedHeading = (updateHeading + 360) % 360;
//         previousBearingRef.current = normalizedHeading;
//         lastRotationRef.current = normalizedHeading;
//         rotationAnim.setValue(normalizedHeading);
//         setCurrentRotation(normalizedHeading);
//       }
//       // Pass null as previousLocation since this is the first location
//       animate(newLocation?.lat, newLocation?.lng, newLocation, destination, null);
      
//       // Save the new location AFTER calling animate
//       prevLocationRef.current = { ...newLocation };
//       return;
//     }

//     // Calculate distance between previous and current locations
//     const distance = getDistanceInMeters(
//       prevLocationRef?.current?.lat,
//       prevLocationRef?.current?.lng,
//       newLocation?.lat,
//       newLocation?.lng
//     );

//     console.log('Distance moved:', distance, 'meters');

//     // Always update marker if location changed (even small movements for smooth tracking)
//     if (distance > 0 || !prevLocationRef.current) {
//       // Update heading from socket data if available - set before animate
//       if (data?.rider_moment && data.rider_moment > 0) {
//         updateHeading = data.rider_moment;
//         if (isMountedRef.current) {
//           setHeading(data.rider_moment);
//         }
//       }
      
//       // Save PREVIOUS location BEFORE updating (needed for heading calculation)
//       const previousLocation = prevLocationRef.current ? { ...prevLocationRef.current } : null;
      
//       currentLiveRiderLocation = newLocation;
      
//       // Animate with new location - pass previous location for heading calculation
//       animate(newLocation.lat, newLocation.lng, newLocation, destination, previousLocation);
      
//       // Save the new location AFTER calling animate (so next time we have the previous location)
//       prevLocationRef.current = { ...newLocation };
//     } else {
//       console.log("No movement detected socket", distance);
//     }
//   };

//   socketServices.on('getremainingdistance', handleSocketData);
//   socketListenerRef.current = handleSocketData;

//   return () => {
//     if (socketListenerRef.current) {
//       socketServices.removeListener('getremainingdistance', socketListenerRef.current);
//       socketListenerRef.current = null;
//     }
//   };
// }, [destination]);

//   const animate = (latitude, longitude, newLocation, currentDestination, previousLocation = null) => {
//     if (!isMountedRef.current) return;
    
//     // Validate and convert coordinates
//     const lat = Number(latitude);
//     const lng = Number(longitude);
    
//     // Check for NaN or invalid values
//     if (isNaN(lat) || isNaN(lng) || !isFinite(lat) || !isFinite(lng)) {
//       console.warn("⚠️ Invalid coordinates:", { latitude, longitude });
//       return;
//     }
    
//     const newCoordinate = { latitude: lat, longitude: lng };

//     console.log("Animating to:", newCoordinate, "updateHeading:", updateHeading);

//     // Calculate distance for smooth animation duration
//     const currentPos = currentPositionRef.current || {
//       latitude: Number(latitude),
//       longitude: Number(longitude)
//     };
//     const distanceMeters = getDistanceInMeters(
//       currentPos.latitude,
//       currentPos.longitude,
//       Number(latitude),
//       Number(longitude)
//     );

//     // Calculate heading for smooth rotation
//     // Priority: 1) API heading (rider_moment), 2) Calculated bearing from movement, 3) Destination bearing
//     let newHeading = null;
    
//     // Use heading from API if available (most accurate)
//     if (updateHeading && updateHeading > 0 && !isNaN(updateHeading)) {
//       newHeading = updateHeading;
//       console.log("✅ Using API heading:", newHeading.toFixed(1) + "°");
//     } 
//     // Calculate heading from movement direction (when GPS heading is not available)
//     // Use previousLocation parameter if provided, otherwise fall back to prevLocationRef
//     else if (previousLocation && previousLocation.lat && previousLocation.lng) {
//       newHeading = calculateHeadingFromMovement(
//         previousLocation.lat,
//         previousLocation.lng,
//         Number(latitude),
//         Number(longitude)
//       );
//       if (newHeading !== null) {
//         console.log("📍 Calculated heading from movement (previous location):", newHeading.toFixed(1) + "°");
//       }
//     }
//     // Fallback: try prevLocationRef if previousLocation not provided
//     else if (prevLocationRef.current && prevLocationRef.current.lat && prevLocationRef.current.lng) {
//       newHeading = calculateHeadingFromMovement(
//         prevLocationRef.current.lat,
//         prevLocationRef.current.lng,
//         Number(latitude),
//         Number(longitude)
//       );
//       if (newHeading !== null) {
//         console.log("📍 Calculated heading from movement (ref):", newHeading.toFixed(1) + "°");
//       }
//     } 
//     // Last resort: calculate bearing to destination (only if no movement data available)
//     else if (currentDestination && currentDestination.lat && currentDestination.lng) {
//       newHeading = getBearing(
//         { lat: Number(latitude), lng: Number(longitude) },
//         { lat: Number(currentDestination.lat), lng: Number(currentDestination.lng) }
//       );
//       console.log("🎯 Calculated heading to destination (fallback):", newHeading.toFixed(1) + "°");
//     }

//     // Use previous bearing if no valid heading calculated
//     if (newHeading === null || newHeading === undefined || isNaN(newHeading)) {
//       newHeading = previousBearingRef.current || 0;
//       console.log("⚠️ Using previous bearing:", newHeading.toFixed(1) + "°");
//     }

//     // Update previous bearing reference
//     previousBearingRef.current = newHeading;

//     // Calculate animation duration based on distance (speed ~30 km/h = 8.33 m/s)
//     // Use minimum 500ms for very small movements and maximum 7s for smooth animation
//     const speedMps = 8.33; // ~30 km/h
//     const calculatedDuration = Math.max(500, Math.min(7000, (distanceMeters / speedMps) * 1000));

//     console.log("🚗 Animation:", {
//       distance: distanceMeters.toFixed(2) + "m",
//       duration: calculatedDuration + "ms",
//       heading: newHeading.toFixed(1) + "°"
//     });

//     // Fetch new route (non-blocking - don't wait for it)
//     if (newLocation && currentDestination) {
//     fetchRoute(newLocation, currentDestination);
//     }
    
//     // Use AnimatedRegion for both platforms to keep a single code path
//     if (isMountedRef.current) {
//       // Validate coordinates before animating
//       if (!isNaN(newCoordinate.latitude) && !isNaN(newCoordinate.longitude) &&
//           isFinite(newCoordinate.latitude) && isFinite(newCoordinate.longitude)) {
//         // Update state immediately for Marker coordinate
//         setMarkerCoordinate({
//           latitude: newCoordinate.latitude,
//           longitude: newCoordinate.longitude,
//         });
        
//         // Animate marker position smoothly (for any internal animations)
//         animatedCoordinate.timing({
//           latitude: newCoordinate.latitude,
//           longitude: newCoordinate.longitude,
//           duration: calculatedDuration,
//           useNativeDriver: false,
//         }).start();
//       } else {
//         console.warn("⚠️ Skipping animation - invalid coordinates:", newCoordinate);
//       }

//       // Animate rotation smoothly using the improved function
//       // Only update updateHeading if it's from API, don't overwrite with calculated values
//       if (updateHeading && updateHeading > 0 && !isNaN(updateHeading)) {
//         // Keep API heading
//       } else {
//         // For calculated headings, update the heading state for display
//         setHeading(newHeading ?? 0);
//       }
//       animateRotation(newHeading);

//       // Update current position reference immediately for next calculation
//       currentPositionRef.current = {
//         latitude: newCoordinate.latitude,
//         longitude: newCoordinate.longitude,
//       };
      
//       // Camera animation will be triggered by markerCoordinate state change
//       // The useEffect hook will handle it automatically
//     }
//   };

//   // Initialize markers and camera when data is available (only once)
//   // Use coordinate values as dependencies instead of object references
//   const originLat = origin?.lat;
//   const originLng = origin?.lng;
//   const destLat = destination?.lat;
//   const destLng = destination?.lng;
  
//   useEffect(() => {
//     // Check if coordinates actually changed by comparing with refs
//     const currentOrigin = originRef.current;
//     const currentDestination = destinationRef.current;
    
//     const originCoordsChanged = !areCoordinatesEqual(currentOrigin, origin);
//     const destCoordsChanged = !areCoordinatesEqual(currentDestination, destination);
    
//     // If already initialized and coordinates haven't actually changed, skip re-initialization
//     if (isInitializedRef.current && !originCoordsChanged && !destCoordsChanged) {
//       return;
//     }
    
//     // If not initialized yet, proceed with initialization
//     if (!origin || !destination || !isMountedRef.current) return;

//     const lat = Number(origin?.lat);
//     const lng = Number(origin?.lng);
//     const destLatNum = Number(destination?.lat);
//     const destLngNum = Number(destination?.lng);

//     // Validate coordinates
//     if (isNaN(lat) || isNaN(lng) || isNaN(destLatNum) || isNaN(destLngNum)) {
//       console.warn('⚠️ Invalid initial coordinates');
//       return;
//     }

//     // Initialize current position and previous location
//     currentPositionRef.current = { latitude: lat, longitude: lng };
//     if (!prevLocationRef.current) {
//       prevLocationRef.current = { lat, lng };
//     }

//     // Set initial marker positions (only once)
//     if (isMountedRef.current) {
//       // Calculate initial bearing (use API heading if available, otherwise calculate)
//       let initialBearing = 0;
      
//       if (updateHeading && updateHeading > 0 && !isNaN(updateHeading)) {
//         initialBearing = updateHeading;
//       } else {
//         initialBearing = getBearing(
//           { lat, lng },
//           { lat: destLatNum, lng: destLngNum }
//         );
//       }
      
//       // Normalize to 0-360
//       initialBearing = (initialBearing + 360) % 360;
      
//       previousBearingRef.current = initialBearing;
//       lastRotationRef.current = initialBearing;
//       rotationAnim.setValue(initialBearing);
//       setCurrentRotation(initialBearing);

//       // Set initial marker positions immediately (no animation delay)
//       // Only update if not already initialized or if coordinates changed
//       const wasInitialized = isInitializedRef.current;
      
//       if (!wasInitialized || originCoordsChanged) {
//         setMarkerCoordinate({ latitude: lat, longitude: lng });
//         animatedCoordinate.setValue({ latitude: lat, longitude: lng });
//       }
      
//       if (!wasInitialized || destCoordsChanged) {
//         setDestinationCoordinate({ latitude: destLatNum, longitude: destLngNum });
//         animatedDesCoordinate.setValue({ latitude: destLatNum, longitude: destLngNum });
//       }

//       // Mark as initialized to prevent resets
//       isInitializedRef.current = true;

//       // Fetch initial route (only if coordinates changed or not initialized)
//       if (!wasInitialized || originCoordsChanged || destCoordsChanged) {
//         fetchRoute(origin, destination);
//       }
//     }
    
//     return () => {
//       // Cancel any ongoing operations when dependencies change
//       if (fetchAbortControllerRef.current) {
//         fetchAbortControllerRef.current.abort();
//         fetchAbortControllerRef.current = null;
//       }
//     };
//   }, [originLat, originLng, destLat, destLng, areCoordinatesEqual]); // Only depend on actual coordinate values, not object references

//   // Fit map to coordinates when route is loaded (only once)
//  const getBearing = (start, end) => {
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


//   useEffect(() => {
//     if ((coords?.length > 1 && mapRef?.current && !hasAnimatedOnce?.current && isMountedRef.current)) {
//       try {
//         const edgePadding = {
//           top: 50,
//           right: 50,
//           bottom: 50,
//           left: 50,
//         };

//         mapRef.current.fitToCoordinates(coords, {
//           edgePadding,
//           animated: true,
//         });
      
//         hasAnimatedOnce.current = true;
//         console.log('✅ Initial map fit to route completed');
//       } catch (error) {
//         console.log('Error fitting map to coordinates:', error);
//       }
//     }
//   }, [coords]);

//   // Camera animation - follow rider's direction on every location update (throttled)
//   // Only animate if initialized to prevent resetting on initial load
//   useEffect(() => {
//     if (
//       !isInitializedRef.current || // Don't animate camera until initialized
//       !markerCoordinate || 
//       !markerCoordinate.latitude || 
//       !markerCoordinate.longitude ||
//       !mapRef?.current || 
//       !isMountedRef.current ||
//       !isMapReady
//     ) {
//       return;
//     }
    
//     // Clear any pending camera animation
//     if (cameraAnimationTimeoutRef.current) {
//       clearTimeout(cameraAnimationTimeoutRef.current);
//     }
    
//     // Throttle camera animations to avoid excessive updates (every 500ms max)
//     cameraAnimationTimeoutRef.current = setTimeout(() => {
//       if (!isMountedRef.current || !mapRef?.current || !isInitializedRef.current) return;
      
//       try {
//         // Get current heading from state or previous bearing
//         const currentHeading = currentRotation || previousBearingRef.current || 0;
        
//         // Validate coordinates
//         const lat = Number(markerCoordinate.latitude);
//         const lng = Number(markerCoordinate.longitude);
        
//         if (isNaN(lat) || isNaN(lng) || !isFinite(lat) || !isFinite(lng)) {
//           console.warn('⚠️ Invalid coordinates for camera animation');
//           return;
//         }
        
//         // Animate camera to follow rider's position and direction
//         mapRef.current.animateCamera(
//           {
//             center: {
//               latitude: lat,
//               longitude: lng,
//             },
//             heading: currentHeading, // Rotate camera to match rider's direction
//             pitch: 0,
//             zoom: 15.5, // Keep zoom fixed
//             edgePadding: {
//               top: 50,
//               right: 50,
//               bottom: 50,
//               left: 50
//             },
//             animated: true,
//           },
//           { duration: 800 } // Smooth 800ms animation
//         );
        
//         console.log('📷 Camera following rider:', {
//           position: `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
//           heading: currentHeading.toFixed(1) + '°'
//         });
//       } catch (error) {
//         console.log('Error animating camera:', error);
//       }
//     }, 500); // Throttle to 500ms
    
//     return () => {
//       if (cameraAnimationTimeoutRef.current) {
//         clearTimeout(cameraAnimationTimeoutRef.current);
//       }
//     };
//   }, [markerCoordinate, currentRotation, isMapReady]);

  
//   // const fetchRoute = async (sender, receiver) => {
//   //     try {
//   //       const response = await fetch(
//   //         `https://maps.googleapis.com/maps/api/directions/json?origin=${ Number(currentLiveRiderLocation?.lat ??  sender?.lat)},${Number(currentLiveRiderLocation?.lng ?? sender?.lng)}&destination=${Number(receiver?.lat)},${Number(receiver?.lng)}&alternatives=true&key=${MAP_KEY}`
//   //       );
  
//   //       const json = await response?.json();
  
//   //       if (json?.routes?.length > 0) {
//   //         // ✅ Find the shortest route based on total distance
//   //         let shortestRoute = json?.routes[0];
//   //         let minDistance = json?.routes[0]?.legs[0]?.distance?.value; // in meters
  
//   //         json?.routes?.forEach(route => {
//   //           const distance = route?.legs[0]?.distance?.value;
//   //           if (distance < minDistance) {
//   //             minDistance = distance;
//   //             shortestRoute = route;
//   //           }
//   //         });
  
//   //         // ✅ Decode the shortest route polyline
//   //         const points = PolylineDecoder?.decode(shortestRoute?.overview_polyline?.points);
//   //         const routeCoords = points?.map(point => ({
//   //           latitude: point[0],
//   //           longitude: point[1],
//   //         }));
  
//   //         // ✅ Update state
//   //         setCoords(routeCoords);
//   //         console.log(`✅ Shortest route selected customer — ${(minDistance / 1000).toFixed(2)} km`);
//   //       } else {
//   //         console.log('⚠️ No routes found.');
//   //       }
//   //     } catch (error) {
//   //       console.log('❌ Error fetching route:', error);
//   //     }
//   //   };


//     const fetchRoute = async (sender, receiver) => {
//     // Don't cancel previous requests - allow multiple route fetches for continuous updates
//     // This ensures route updates don't block marker movement
    
//     try {
//       const response = await fetch(
//         `https://maps.googleapis.com/maps/api/directions/json?origin=${Number(currentLiveRiderLocation?.lat ?? sender?.lat)},${Number(currentLiveRiderLocation?.lng ?? sender?.lng)}&destination=${Number(receiver?.lat)},${Number(receiver?.lng)}&alternatives=true&key=${MAP_KEY}`
//       );

//       if (!isMountedRef.current) return;

//       const json = await response?.json();
      
//       if (!isMountedRef.current) return;

//       if (json?.routes?.length > 0) {
//         // ✅ Find the shortest route based on total distance
//         let shortestRoute = json?.routes[0];
//         let minDistance = json?.routes[0]?.legs[0]?.distance?.value; // in meters
//         let minDuration = json?.routes[0]?.legs[0]?.duration?.value; // in seconds

//         json?.routes?.forEach(route => {
//           const distance = route?.legs[0]?.distance?.value;
//           if (distance < minDistance) {
//             minDistance = distance;
//             minDuration = route?.legs[0]?.duration?.value;
//             shortestRoute = route;
//           }
//         });

//         // ✅ Decode the shortest route polyline
//         const points = PolylineDecoder?.decode(shortestRoute?.overview_polyline.points);
//         const routeCoords = points?.map(point => ({
//           latitude: point[0],
//           longitude: point[1],
//         }));

//         // ✅ Convert to readable values
//         const distanceInKm = (minDistance / 1000).toFixed(2);
//         const durationInMin = Math.floor(minDuration / 60);
//         const durationInSec = Math.floor(minDuration % 60);

//         console.log(`🚗 Shortest route: ${distanceInKm} km, ⏱️
//          ${durationInMin} min ${durationInSec} sec`);

//         // ✅ Format ETA as "Xm Ys"
//         const eta = `${durationInMin}m ${durationInSec}s`;

//         // ✅ Update state only if component is still mounted
//         if (isMountedRef.current) {
//         // ✅ Update state or send callback
//         // Use ref to get latest riderCustomerDetails value
//         const latestRiderDetails = riderCustomerDetailsRef.current;
//         if ((distanceInKm <= 0.20 && !showPickDesPopUpModal && latestRiderDetails?.status == 'picked')) {
//           showPickDesPopUpModal = true;
//           setShowPickDesPopUp(true);
//         }
//         setCoords(routeCoords);
//         onUpdateRiderMoveValue(distanceInKm)
//         onKmsTime?.(distanceInKm, eta);
//         }

//       } else {
//         console.log('⚠️ No routes found.');
//       }
//     } catch (error) {
//       if (error.name === 'AbortError') {
//         console.log('Route fetch cancelled');
//       } else if (isMountedRef.current) {
//       console.log('❌ Error fetching route:', error);
//       }
//     }
//   };

 

//   const handleMapReady = () => {
//     // Clear any existing timeout
//     if (mapReadyTimeoutRef.current) {
//       clearTimeout(mapReadyTimeoutRef.current);
//     }
    
//     mapReadyTimeoutRef.current = setTimeout(() => {
//       if (isMountedRef.current) {
//       setIsMapReady(true);
//       }
//     }, 1000);
//   };

//   // Set up rotation animation listener for smooth updates
//   useEffect(() => {
//     const rotationListener = rotationAnim.addListener(({ value }) => {
//       if (isMountedRef.current) {
//         // Normalize the value to 0-360
//         const normalizedValue = ((value % 360) + 360) % 360;
//         setCurrentRotation(normalizedValue);
//       }
//     });

//     return () => {
//       if (rotationListener) {
//         rotationAnim.removeListener(rotationListener);
//       }
//     };
//   }, []);

//   // Component unmount cleanup
//   useEffect(() => {
//     return () => {
//       isMountedRef.current = false;
//       // Reset initialization flag on unmount so it can reinitialize if needed
//       isInitializedRef.current = false;
//       // Cancel any ongoing fetch requests
//       if (fetchAbortControllerRef.current) {
//         fetchAbortControllerRef.current.abort();
//         fetchAbortControllerRef.current = null;
//       }
//       // Clear timeout
//       if (mapReadyTimeoutRef.current) {
//         clearTimeout(mapReadyTimeoutRef.current);
//         mapReadyTimeoutRef.current = null;
//       }
//       // Clear camera animation timeout
//       if (cameraAnimationTimeoutRef.current) {
//         clearTimeout(cameraAnimationTimeoutRef.current);
//         cameraAnimationTimeoutRef.current = null;
//       }
//       // Remove socket listener
//       if (socketListenerRef.current) {
//         socketServices.removeListener('getremainingdistance', socketListenerRef.current);
//         socketListenerRef.current = null;
//       }
//     };
//   }, []);

//   // if(update){

//   return (
//     <View
//       pointerEvents={isPendingReq ? 'none' : 'auto'}
//       style={styles.homeSubContainer}
//     >
//       {/* {(origin && destination) ? */}
//         <MapView
//           provider={PROVIDER_GOOGLE}
//           ref={mapRef}
//           style={[styles.mapContainer, mapContainerView]}
//           mapType={Platform.OS === 'ios' ? 'standard' : 'standard'}
//           customMapStyle={DuuittMapTheme}
//           region={{
//             latitude: Number(origin?.lat) || 30.7400,
//             longitude: Number(origin?.lng) || 76.7900,
//             latitudeDelta: 0.005,
//             longitudeDelta: 0.005
//           }}
//           zoomEnabled={true}
//           scrollEnabled={true}
//           rotateEnabled={true}
//           loadingEnabled={true}
//           showsCompass={false}
//           minZoomLevel={10}
//           maxZoomLevel={18}
//           showsBuildings={false}
//           //  showsUserLocation={true}
//           followsUserLocation={true}
//           showsTraffic={false}
//           onMapReady={handleMapReady}
//           onRegionChangeComplete={(region) => {
//             if (isMountedRef.current && region) {
//               try {
//             setMapManageRideDalta(region);
//             setMpaDalta(region);
//               } catch (error) {
//                 console.log('Error updating map region:', error);
//               }
//             }
//           }}
//         >

//           {/* Origin Marker */}
//           <Marker.Animated
//             ref={markerRef}
//             coordinate={markerCoordinate}
//             tracksViewChanges={!isMapReady}
//             centerOffset={{ x: 0, y: -10 }}
//             anchor={{ x: 0.5, y: 0.5 }}
//             rotation={updateHeading ?? heading ?? currentRotation}
//           >
//             <Image
//               resizeMode='contain'
//               source={appImages.moveBike}
//               style={styles.markerBikeImage}
//             />
//           </Marker.Animated>

//           {/* Destination Marker */}
//           <Marker.Animated
//             ref={markerDesRef}
//             coordinate={destinationCoordinate}
//             tracksViewChanges={!isMapReady}
//              centerOffset={{ x: 0, y: -10 }} // Adjust Y offset to position properly
//              anchor={{ x: 0.5, y: 0.5 }}
//           >
//             <Image
//               resizeMode="contain"
//               source={appImages.markerImage}
//               style={styles.markerImage}
//             />
//           </Marker.Animated>

//           {/* Route Polyline */}
//           {/* {(Object.keys(currentLiveRiderLocation ?? origin)?.length > 0 &&
//            Object.keys(destination)?.length > 0) &&  (<MapViewDirections
//           origin={{
//             latitude: Number(currentLiveRiderLocation?.lat ?? origin?.lat) || 30.7400,
//             longitude: Number(currentLiveRiderLocation?.lng ?? origin?.lng) || 76.7900,
//             latitudeDelta: 0.005,
//             longitudeDelta: 0.005
//           }}
//           destination={
//              {latitude: Number(destination?.lat),
//              longitude: Number(destination?.lng)}
//            }
//           apikey={MAP_KEY}
//           strokeWidth={6}
//           strokeColor={colors.main}
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
//                   // right: 50,
//                   // bottom: 50,
//                   // left: 50,
//                   // top: 50,
//                 },
//               });
//           }}
//           onError={(errorMessage) => {
//             console.log('GOT AN ERROR',errorMessage);
//           }}
//         />)} */}
//           {coords?.length > 0 && (
//             <Polyline
//               coordinates={coords}
//               strokeWidth={4}
//               strokeColor={colors.main}
//             />
//           )}
//         </MapView>
//          {/* :
//         <View style={[styles.mapContainer, mapContainerView]}>
//         </View>}  */}
//           <PopUpInProgess
//             topIcon={false}
//             CTATitle={'ok'}
//            visible={showPickDesPopUp}
//           type={'Error'}
//         onClose={() => { setShowPickDesPopUp(false), showPickDesPopUpModal = true }}
//         title={riderCustomerDetails?.status == 'picked' ? "Dropped Location" : "Pickup Location"}
//         text={
//           riderCustomerDetails?.status == 'picked' ? "Rider has reached and completed the ride at the destination" : "Rider has arrived at the pickup location"
//         }
//               />
//     </View>
//   );
// // }else{
// //   return null
// // }
// };

// export default MapRouteTracking;

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
//     height:60,  //30,
//     width: 60,   //30,
//     marginTop: Platform.OS === 'ios' ? '25%' : 0,
//   },
// });
