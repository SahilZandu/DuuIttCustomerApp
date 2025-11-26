import React, {
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { StyleSheet, View, Image, Platform, Easing, Animated, AppState, DeviceEventEmitter } from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { appImages } from '../commons/AppImages';
import MapView, { Marker, AnimatedRegion, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import PolylineDecoder from '@mapbox/polyline';
import { colors } from '../theme/colors';
import { setMapManageRideDalta, setMapManageRideDaltaInitials, setMpaDalta } from './GeoCodeAddress';
import { useFocusEffect } from '@react-navigation/native';
import { DuuittMapTheme } from './DuuittMapTheme';
import MapViewDirections from 'react-native-maps-directions';
import socketServices from '../socketIo/SocketServices';
import { rootStore } from '../stores/rootStore';
import { MAP_KEY } from '../halpers/AppLink';
import PopUpInProgess from './appPopUp/PopUpInProgess';
import haversine from "haversine-distance";
import { startKeepAwakeScreen, stopKeepAwakeScreen } from './ScreenKeepAlive';
import { getCurrentLocation, locationPermission } from './helperFunction';



let currentLiveRiderLocation = {}
let updateTimerValue = 5 // 20 meters
let updateHeading = 0;
let showPickDesPopUpModal = false
let kmValue = 0
let coordinateRoute = []


const MapRouteTracking = ({ mapContainerView, origin, destination,
  isPendingReq, riderCustomerDetails, onKmsTime }) => {
  const { getCustomerWiseRiderLocation, ordersDirectionGooglemapHit } = rootStore.orderStore;
  const mapRef = useRef(null);
  const hasAnimatedOnce = useRef(false);
  const isMountedRef = useRef(true);
  const appStateRef = useRef(AppState.currentState);
  const cameraAnimationTimeoutRef = useRef(null);
  const isCameraAnimatingRef = useRef(false);
  const hasDirectionApiCalling = useRef(null)
  const animatedRotation = useRef(new Animated.Value(0)).current;
  const markerRef = useRef(null);
  const markerDesRef = useRef(null);
  const prevLocationRef = useRef(null);
  const bearingRef = useRef(0);
  const lastRotationRef = useRef(0);
  const [coords, setCoords] = useState([]);
  const [isMapReady, setIsMapReady] = useState(false);
  const [update, setUpdate] = useState(true);
  const [heading, setHeading] = useState(0)
  const [showPickDesPopUp, setShowPickDesPopUp] = useState(false)

  const onUpdateRiderMoveValue = (kms) => {
    // console.log('kms', kms);
    kmValue = kms
    if (kms >= 30) {
      // updateTimerValue = 400;
      updateTimerValue = 40;
    } else if (kms >= 25) {
      // updateTimerValue = 300;
      updateTimerValue = 35;
    } else if (kms >= 20) {
      // updateTimerValue = 250;
      updateTimerValue = 30;
    } else if (kms >= 15) {
      // updateTimerValue = 200;
      updateTimerValue = 25;
    } else if (kms >= 10) {
      // updateTimerValue = 150;
      updateTimerValue = 20;
    } else if (kms >= 7) {
      // updateTimerValue = 100;
      updateTimerValue = 20;
    } else if (kms >= 4) {
      // updateTimerValue = 80;
      updateTimerValue = 10;
    } else if (kms >= 2) {
      // updateTimerValue = 50;
      updateTimerValue = 10;
    } else if (kms >= 1) {
      // updateTimerValue = 30;
      updateTimerValue = 10;
    } else if (kms >= 0.5) {
      // updateTimerValue = 20;
      updateTimerValue = 5;
    } else {
      // updateTimerValue = 10;
      updateTimerValue = 5;
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



  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener('picked', data => {
      console.log('picked data--MapRouteTracking-- ', data);

      if (data?.order_type === 'ride') {
        coordinateRoute = [];
        setCoords([]);
        setTimeout(() => {
          fetchRoute(data?.rider?.geo_location ?? data?.sender_address?.geo_location ?? origin, data?.receiver_address?.geo_location ?? destination);
          animatedCoordinate.timing({
            latitude: data?.rider?.geo_location?.lat ?? data?.sender_address?.geo_location?.lat ?? origin?.lat,
            longitude: data?.rider?.geo_location?.lng ?? data?.sender_address?.geo_location?.lng ?? origin?.lng,
            duration: 500,
            useNativeDriver: false,
          }).start();

          animatedDesCoordinate.timing({
            latitude: data?.receiver_address?.geo_location?.lat ?? destination?.lat,
            longitude: data?.receiver_address?.geo_location?.lng ?? destination?.lng,
            duration: 500,
            useNativeDriver: false,
          }).start();
        }, 1000)

      } else if (data?.order_type == 'parcel') {
        coordinateRoute = [];
        setCoords([]);
        setTimeout(() => {
          fetchRoute(data?.rider?.geo_location ?? origin, data?.receiver_address?.geo_location ?? destination);
          animatedCoordinate.timing({
            latitude: data?.rider?.geo_location?.lat ?? origin?.lat,
            longitude: data?.rider?.geo_location?.lng ?? origin?.lng,
            duration: 500,
            useNativeDriver: false,
          }).start();

          animatedDesCoordinate.timing({
            latitude: data?.receiver_address?.geo_location?.lat ?? destination?.lat,
            longitude: data?.receiver_address?.geo_location?.lng ?? destination?.lng,
            duration: 500,
            useNativeDriver: false,
          }).start();
        }, 1000)

      }
    });
    return () => {
      subscription.remove();
    };
  }, []);

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
      startKeepAwakeScreen()// Keep screen awake on mount
      setMapManageRideDaltaInitials();
      if ((origin && destination)) {
        currentLiveRiderLocation = origin;
        prevLocationRef.current = origin
        animate(origin?.lat, origin?.lng, origin, destination)
      }
      // Fixed: Combined location effects to prevent conflicts

      if (riderCustomerDetails) {
        onUpdateCutomerLocation(riderCustomerDetails);

        const intervalId = setInterval(() => {
          onUpdateCutomerLocation(riderCustomerDetails);
        }, 60000);

        return () => {
          clearInterval(intervalId);
        };
      }
      showPickDesPopUpModal = false

      return () => {
        stopKeepAwakeScreen(); // Allow screen to sleep when unmounting
      };

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


  // Animate rotation smoothly
  const animateRotation = useCallback((newHeading) => {
    console.log("newHeading--animateRotation", newHeading);

    if (!isMountedRef.current || newHeading === null || newHeading === undefined || isNaN(newHeading)) {
      return;
    }

    // Normalize heading to 0-360
    let normalizedHeading = newHeading % 360;
    if (normalizedHeading < 0) {
      normalizedHeading += 360;
    }

    // Get current rotation value
    const currentRotation = lastRotationRef.current;

    // Calculate shortest rotation path (handle 360/0 wrap-around)
    let rotationDiff = normalizedHeading - currentRotation;
    if (rotationDiff > 180) {
      rotationDiff -= 360;
    } else if (rotationDiff < -180) {
      rotationDiff += 360;
    }

    const targetRotation = currentRotation + rotationDiff;

    // Update ref
    lastRotationRef.current = normalizedHeading;

    // Animate rotation smoothly
    Animated.timing(animatedRotation, {
      toValue: targetRotation,
      duration: 500, // Smooth 500ms rotation animation
      useNativeDriver: false, // Rotation must use native driver false for marker rotation
    }).start(() => {
      // Ensure final value is correct
      if (isMountedRef.current) {
        animatedRotation.setValue(normalizedHeading);
        lastRotationRef.current = normalizedHeading;
      }
    });

    console.log('🔄 Rotating bike marker:', {
      from: currentRotation.toFixed(1),
      to: normalizedHeading.toFixed(1),
      diff: rotationDiff.toFixed(1),
    });
  }, [animatedRotation]);



  const onUpdateCutomerLocation = async (order) => {
    // if(!socketServices.isSocketConnected()){
    try {
      const res = await getCustomerWiseRiderLocation(order);
      // console.log("res?.rider?.current_location--1", res?.rider,
      //   res?.rider?.current_location?.root_coordinates
      // );
      // alert("yes--");
      if (res?.rider?.current_location?.root_coordinates?.length > 0) {
        if ((res?.rider?.current_location?.distancekm <= 0.20 && !showPickDesPopUpModal && riderCustomerDetails?.status == 'picked')) {
          showPickDesPopUpModal = true;
          setShowPickDesPopUp(true);
        }
        setCoords(res?.rider?.current_location?.root_coordinates)
        coordinateRoute = res?.rider?.current_location?.root_coordinates
        onUpdateRiderMoveValue(res?.rider?.current_location?.distancekm)
        onKmsTime(res?.rider?.current_location?.distancekm, res?.current_location?.rider?.eta)

      }


      const currentLoc = res?.rider?.current_location;
      updateHeading = res?.rider?.current_location?.rider_moment ?? 0;
      setHeading(res?.rider?.current_location?.rider_moment ?? 0);
      animateRotation(res?.rider?.current_location?.rider_moment ?? 0)
      let actualHeading = res?.rider?.current_location?.rider_moment ?? updateHeading;
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
            updateHeading = calculatedHeading ?? 0;
            setHeading(calculatedHeading ?? 0)
            animateRotation(calculatedHeading ?? 0);
            console.log('📐 Calculated heading from movement:', actualHeading.toFixed(1));
          } else {
            updateHeading = res?.rider?.current_location?.rider_moment ?? 0;
            setHeading(res?.rider?.current_location?.rider_moment ?? 0);
            animateRotation(res?.rider?.current_location?.rider_moment ?? 0)
          }
        } else {
          updateHeading = res?.rider?.current_location?.rider_moment ?? 0;
          setHeading(res?.rider?.current_location?.rider_moment ?? 0);
          animateRotation(res?.rider?.current_location?.rider_moment ?? 0)
        }
      }

      // ✅ Corrected: Object.keys (not Object.key)
      if (currentLoc && Object?.keys(currentLoc)?.length > 0) {
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

          console.log("distance--customer", distance, updateTimerValue, distance >= updateTimerValue);
          // Only update if moved more than 50 meters
          if (distance >= updateTimerValue ?? 50) {
            animate(currentLoc?.lat, currentLoc?.lng, currentLoc, destination);
            // Save the new location for next comparison
            prevLocationRef.current = { lat: currentLoc?.lat, lng: currentLoc?.lng };
          } else {
            console.log("Your are not cover the 50 meter distance", distance);
          }
        } else {
          console.log("Same location — skipping update", currentLoc, prevLocationRef.current);
        }
      } else {
        console.log("⚠️ No current location found.");
      }
    } catch (error) {
      console.log("❌ Error updating customer location:", error);
    }
    // }else{
    //    getSocketUpdatedData();
    //   }
  };


  const getSocketUpdatedData = async () => {
    if (socketServices.isSocketConnected()) {
      try {
        socketServices.on('getremainingdistance', data => {
          console.log('Remaining distance data--:', data, data?.location, data?.root_coordinates?.length);
          // console.log("📍 Using getCurrentLocation:", locationData,data?.rider_moment);
          const newLocation = data?.location;
          if (data?.root_coordinates?.length > 0) {
            console.log('data?.root_coordinates--:', data?.root_coordinates,);
            setCoords(data?.root_coordinates)
            coordinateRoute = data?.root_coordinates
            onUpdateRiderMoveValue(data?.distancekm)
            onKmsTime(data?.distancekm, data?.eta)

            if ((data?.distancekm <= 0.20 && !showPickDesPopUpModal && riderCustomerDetails?.status == 'picked')) {
              showPickDesPopUpModal = true;
              setShowPickDesPopUp(true);
            }

          }


          if ((!newLocation && riderCustomerDetails)
            || (newLocation?.lat === currentLiveRiderLocation?.lat && riderCustomerDetails)
          ) {
            // console.log("!newLocation && riderCustomerDetails--",!newLocation && riderCustomerDetails);
            onUpdateCutomerLocation(riderCustomerDetails);
          }

          if (!newLocation?.lat || !newLocation?.lng) return;
          currentLiveRiderLocation = newLocation
          updateHeading = data?.rider_moment ?? 0
          setHeading(data?.rider_moment ?? 0)
          animateRotation(data?.rider_moment ?? 0)

          let actualHeading = data?.rider_moment ?? updateHeading ?? 0;
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
                updateHeading = calculatedHeading ?? 0;
                setHeading(calculatedHeading ?? 0)
                animateRotation(calculatedHeading ?? 0)
                console.log('📐 Calculated heading from movement newLocation:', actualHeading.toFixed(1));
              } else {
                updateHeading = data?.rider_moment ?? 0
                setHeading(data?.rider_moment ?? 0)
                animateRotation(data?.rider_moment ?? 0)
              }
            } else {
              updateHeading = data?.rider_moment ?? 0
              setHeading(data?.rider_moment ?? 0)
              animateRotation(data?.rider_moment ?? 0)
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
          } else {
            console.log("Your are not cover the 50 meter distance socket", distance);
          }
        })
        return () => {
          socketServices.removeListener('getremainingdistance');
        };
      } catch (error) {
        if (riderCustomerDetails) {
          onUpdateCutomerLocation(riderCustomerDetails)
        }
      }
    }
    else {
      if (riderCustomerDetails) {
        onUpdateCutomerLocation(riderCustomerDetails)
      }
    }
  }


  useEffect(() => {
    if (!socketServices.isSocketConnected()) {
      socketServices.initailizeSocket();
      getSocketUpdatedData();
    } else {
      getSocketUpdatedData();
    }

  }, [riderCustomerDetails]);


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
    if ((coords?.length > 1 && mapRef?.current
      // && !hasAnimatedOnce?.current
    )) {
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



  // Smooth camera updates when route changes - FIXED to prevent repeated hits

  // useEffect(() => {
  //   if (!isMountedRef.current || appStateRef.current !== 'active') return;

  //   if ((currentLiveRiderLocation?.lat ?? origin?.lat) && destination && mapRef?.current && coords?.length > 0) {
  //     // Clear any pending camera animation
  //     if (cameraAnimationTimeoutRef.current) {
  //       clearTimeout(cameraAnimationTimeoutRef.current);
  //       cameraAnimationTimeoutRef.current = null;
  //     }

  //     // Only animate camera when route first loads (not on every route update)
  //     // This prevents the camera from jumping repeatedly
  //     if (!hasAnimatedOnce.current && !isCameraAnimatingRef.current) {
  //       const routeCameraTimeout = setTimeout(() => {
  //         if (isMountedRef.current && appStateRef.current === 'active' && mapRef?.current && !isCameraAnimatingRef.current) {
  //           try {
  //             const currentLocation = currentLiveRiderLocation?.lat ? currentLiveRiderLocation : origin;
  //             const bearing = getBearing(currentLocation, destination);
  //             const firstCoord = coords[0];

  //             isCameraAnimatingRef.current = true;

  //             console.log('🎥 Animating camera to route start:', firstCoord);

  //             mapRef.current.animateCamera(
  //               {
  //                 center: firstCoord,
  //                 heading: bearing,
  //                 pitch: 100,
  //                 zoom: 17,
  //                 altitude: 300,
  //               },
  //               { duration: 2000 }, // Smooth 2 second animation
  //               () => {
  //                 isCameraAnimatingRef.current = false;
  //                 console.log('✅ Route camera animation completed');
  //               }
  //             );

  //             lastCameraPositionRef.current = {
  //               latitude: firstCoord.latitude,
  //               longitude: firstCoord.longitude,
  //               heading: bearing,
  //             };
  //           } catch (error) {
  //             console.log('❌ Error animating route camera:', error);
  //             isCameraAnimatingRef.current = false;
  //           }
  //         }
  //       }, 500); // Small delay to ensure route is fully loaded

  //       return () => clearTimeout(routeCameraTimeout);
  //     }
  //   }
  // }, [coords, origin, destination, currentLiveRiderLocation]);

  // useEffect(() => {
  //   if (currentLiveRiderLocation && destination && mapRef?.current && coords) {
  //     const bearing = getBearing(currentLiveRiderLocation ?? origin, destination);

  //     let setZoomValue = 13;
  //     if (kmValue >= 30) {
  //       setZoomValue = 12
  //     } else if (kmValue >= 25) {
  //       setZoomValue = 12.5
  //     } else if (kmValue >= 20) {
  //       setZoomValue = 13
  //     } else if (kmValue >= 15) {
  //       setZoomValue = 13.5
  //     } else if (kmValue >= 10) {
  //       setZoomValue = 14
  //     } else if (kmValue >= 5) {
  //       setZoomValue = 14.5
  //     } else if (kmValue >= 2) {
  //       setZoomValue = 15
  //     } else if (kmValue >= 1) {
  //       setZoomValue = 15.5
  //     } else if (kmValue >= 0.5) {
  //       setZoomValue = 16
  //     } else if (kmValue >= 0.1) {
  //       setZoomValue = 17
  //     } else {
  //       setZoomValue = 18
  //     }


  //     // const lastCoord = coords[(coords?.length) / 2 - 1];
  //     const lastCoord = coords[0];
  //     mapRef?.current?.animateCamera(
  //       {
  //         center: lastCoord,
  //         // { latitude: currentLiveRiderLocation?.lat ?? origin?.lat, longitude: currentLiveRiderLocation?.lng ?? origin?.lng },
  //         heading: bearing, // rotate toward destination
  //         pitch:Platform.OS === 'ios' ? 50 : 100,
  //         zoom:setZoomValue ?? 17, // keep zoom fixed 
  //         altitude: 300,
  //         edgePadding: {
  //           top: 50,
  //           right: 50,
  //           bottom: 50,
  //           left: 50
  //         },
  //         animated: true,
  //       },
  //       { duration: 500 }
  //     );
  //   }
  // }, [currentLiveRiderLocation, coords]);




  //   // Main animate function - FIXED
  const animate = useCallback((latitude, longitude, newLocation, currentDestination) => {
    if (!isMountedRef.current) {
      console.log('⚠️ Skipping animation - component not mounted');
      return;
    }

    const newCoordinate = { latitude: Number(latitude), longitude: Number(longitude) };

    if (isNaN(newCoordinate.latitude) || isNaN(newCoordinate.longitude)) {
      console.log('❌ Invalid coordinates for animation:', { latitude, longitude });
      return;
    }

    // Update current position
    currentPositionRef.current = newCoordinate;

    console.log('🎯 Animating marker to:', {
      lat: newCoordinate.latitude.toFixed(6),
      lng: newCoordinate.longitude.toFixed(6)
    });

    fetchRoute(newLocation, currentDestination);

    // Smooth marker animation
    try {
      if (Platform.OS == 'android') {
        animatedCoordinate.timing({
          latitude: newCoordinate.latitude,
          longitude: newCoordinate.longitude,
          duration: 1000,
          easing: Easing.linear,
          useNativeDriver: false,
        }).start((finished) => {
          if (isMountedRef.current && finished) {
            console.log('✅ Marker animation completed successfully');
          }
        });
      } else {
        animatedCoordinate.timing({
          latitude: newCoordinate.latitude,
          longitude: newCoordinate.longitude,
          duration: 100,
          easing: Easing.linear,
          useNativeDriver: false,
        }).start((finished) => {
          if (isMountedRef.current && finished) {
            console.log('✅ Marker animation completed successfully');
          }
        });

      }
    } catch (error) {
      console.log('❌ Error starting marker animation:', error);
      try {
        animatedCoordinate.setValue({
          latitude: newCoordinate.latitude,
          longitude: newCoordinate.longitude,
        });
      } catch (setError) {
        console.log('❌ Error setting marker position:', setError);
      }
    }
  }, []);


  const checkDistance = (current, destination) => {
    if (!current?.lat || !destination?.lat) return 0;

    let newCurrentLocation = {
      latitude: current?.lat,
      longitude: current?.lng
    }

    let newDestination = {
      latitude: destination?.lat,
      longitude: destination?.lng

    }

    // Get distance in meters
    const distanceInMeters = haversine(newCurrentLocation, newDestination);
    const distanceInKm = distanceInMeters / 1000;
    // Approximate ETA: assume 45 km/h average = 0.75 km per minute
    const avgSpeedKmPerMin = 0.75;
    const etaMinutes = distanceInKm / avgSpeedKmPerMin;
    // Call your callbacks safely
    onUpdateRiderMoveValue?.(distanceInKm);

    const eta = `${etaMinutes.toFixed(1)} m`;
    onKmsTime?.(distanceInKm.toFixed(2), eta);

    return distanceInKm;
  };

  // Get nearest point and remove all previous points
  const updatePolylineProgress = (current, polylinePoints) => {
    const currentLocation = {
      latitude: current?.lat,
      longitude: current?.lng,
    };

    let nearestPointIndex = 0;
    let minDistance = Infinity;

    // Find the nearest point index on the polyline
    polylinePoints?.forEach((point, index) => {
      const dist = haversine(currentLocation, point);
      if (dist < minDistance) {
        minDistance = dist;
        nearestPointIndex = index;
      }
    });

    // Keep only the remaining route (remove past points)
    const updatedPolyline = polylinePoints?.slice(nearestPointIndex);

    return { updatedPolyline, nearestPointIndex, distanceFromRoute: minDistance };
  };

  // Check if user is off-route (like if he deviates too far)
  const isOffRoute = (current, polylinePoints) => {
    const { distanceFromRoute, updatedPolyline } = updatePolylineProgress(current, polylinePoints);
    console.log("Distance from route (m):", distanceFromRoute, updatedPolyline);
    setCoords(updatedPolyline)
    coordinateRoute = updatedPolyline;
    // If user is more than 50 meters away from route → considered off route
    return distanceFromRoute > 50;
  };

  // Helper: Compute distance (in meters) from point to segment (A-B)

  const pointToLineDistance = (p, a, b) => {
    const aToP = haversine(a, p);
    const bToP = haversine(b, p);
    const aToB = haversine(a, b);

    if (aToB === 0) return aToP; // a and b are same point

    const cosTheta = (aToP ** 2 + aToB ** 2 - bToP ** 2) / (2 * aToP * aToB);
    const projection = aToP * cosTheta;

    if (projection < 0) return aToP; // before A
    if (projection > aToB) return bToP; // beyond B

    // Area of triangle → perpendicular distance formula
    const s = (aToP + bToP + aToB) / 2;
    const area = Math.sqrt(Math.max(0, s * (s - aToP) * (s - bToP) * (s - aToB)));
    return (2 * area) / aToB;
  };

  // Main check isCurrentOnRoute
  const isCurrentOnRoute = (current, polylinePoints, threshold = 100) => {
    const point = { latitude: current?.lat, longitude: current?.lng };
    console.log("current, polylinePoints, threshold", current, polylinePoints, threshold);

    let kmCheckPoint = threshold;

    if (kmValue >= 30) {
      kmCheckPoint = 300
    } else if (kmValue >= 25) {
      kmCheckPoint = 280
    } else if (kmValue >= 20) {
      kmCheckPoint = 250
    } else if (kmValue >= 15) {
      kmCheckPoint = 220
    } else if (kmValue >= 10) {
      kmCheckPoint = 200
    } else if (kmValue >= 5) {
      kmCheckPoint = 150
    } else if (kmValue >= 2) {
      kmCheckPoint = 100
    } else if (kmValue >= 1) {
      kmCheckPoint = 80
    } else if (kmValue >= 0.5) {
      kmCheckPoint = 50
    } else if (kmValue >= 0.1) {
      kmCheckPoint = 30
    } else {
      kmCheckPoint = 20
    }

    for (let i = 0; i < polylinePoints?.length - 1; i++) {
      const dist =
        pointToLineDistance(
          point,
          polylinePoints[i],
          polylinePoints[i + 1]
        );

      if (dist <= kmCheckPoint ?? threshold) {
        console.log(`✅ On route (distance ${dist.toFixed(1)}m)`);
        return true;
      }
    }
    console.log(`❌ Off route (all distances > ${threshold}m)`);
    return false;
  };


  const fetchRoute = useCallback(async (sender, receiver) => {
    if (hasDirectionApiCalling?.current) {
      clearTimeout(hasDirectionApiCalling.current);
    }

    hasDirectionApiCalling.current = setTimeout(async () => {
      // console.log("coords?.length == 0 || coordinateRoute?.length == 0",
      //   (coords?.length == 0 || coordinateRoute?.length == 0),
      //   coords?.length == 0, coordinateRoute?.length == 0,
      //   coords, coordinateRoute
      // );

      if ((
        // coords?.length == 0 && 
        coordinateRoute?.length == 0)) {
        try {
          const response = await fetch(
            `https://maps.googleapis.com/maps/api/directions/json?origin=${Number(currentLiveRiderLocation?.lat ?? sender?.lat)},${Number(currentLiveRiderLocation?.lng ?? sender?.lng)}&destination=${Number(receiver?.lat)},${Number(receiver?.lng)}&alternatives=true&key=${MAP_KEY}`
          );
          // alert("yes-");
          const json = await response?.json();
          ordersDirectionGooglemapHit(riderCustomerDetails, 'Route Directions')

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
            coordinateRoute = routeCoords;
            onUpdateRiderMoveValue(distanceInKm)
            onKmsTime?.(distanceInKm, eta);


          } else {
            console.log('⚠️ No routes found.');
          }
        } catch (error) {
          console.log('❌ Error fetching route:', error);
        }
      } else {
        console.log("same route tracking in map");
      }
    }, 500); // 1000ms debounce delay
  }, [riderCustomerDetails, onKmsTime]);



  const handleMapReady = () => {
    setTimeout(() => {
      setIsMapReady(true);
    }, 5000);
  };

  return (
    <View
      pointerEvents={isPendingReq ? 'none' : null}
      style={styles.homeSubContainer}
    >
      <MapView
        provider={PROVIDER_GOOGLE}
        ref={mapRef}
        style={[styles.mapContainer, mapContainerView]}
        mapType={Platform.OS === 'ios' ? 'standard' : 'standard'}
        customMapStyle={DuuittMapTheme}
        initialRegion={{
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
          rotation={Number(updateHeading || heading || 0)}
        >
          <Image
            resizeMode='contain'
            source={appImages.moveBike}
            style={styles.markerBikeImage}
          />
        </Marker.Animated>

        {/* Destination Marker */}
        <Marker.Animated
          ref={markerDesRef}
          coordinate={animatedDesCoordinate}
          tracksViewChanges={!isMapReady}
          // centerOffset={{ x: 0, y: -10 }} // Adjust Y offset to position properly
          // anchor={{ x: 0.5, y: 0.5 }}
        >
          <Image
            resizeMode="contain"
            source={appImages.dropMap
            }
            style={styles.markerImage}
          />
        </Marker.Animated>
        {(coords?.length > 0 || coordinateRoute?.length > 0) && (
          <Polyline
            coordinates={coordinateRoute ?? coords}
            strokeWidth={4}
            strokeColor={colors.green}
          />
        )}
      </MapView>

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
  )
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
    marginTop: Platform.OS === 'ios' ? '25%' : '10%',
  },
  markerBikeImage: {
    height: 60,  //30,
    width: 60,   //30,
    // marginTop: Platform.OS === 'ios' ? '25%' : 0,
  },
})

