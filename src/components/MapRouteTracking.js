import React, {
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { StyleSheet, View, Image, Platform, Easing, Animated, AppState } from 'react-native';
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


let currentLiveRiderLocation = {}
let updateTimerValue = 5 // 20 meters
let updateHeading = 0;
let showPickDesPopUpModal = false
let kmValue = 0
let coordinateRoute = []


const MapRouteTracking = ({ mapContainerView, origin, destination,
 isPendingReq, riderCustomerDetails, onKmsTime }) => {
  const { getCustomerWiseRiderLocation,ordersDirectionGooglemapHit } = rootStore.orderStore;
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
        }, 7000);

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
    try {
      const res = await getCustomerWiseRiderLocation(order);
      console.log("res?.rider?.current_location--", res?.rider,
        res?.rider?.current_location?.root_coordinates
      );

      if(res?.rider?.current_location?.root_coordinates?.length > 0){
         if ((res?.rider?.current_location?.distancekm <= 0.20 && !showPickDesPopUpModal && riderCustomerDetails?.status == 'picked')) {
          showPickDesPopUpModal = true;
          setShowPickDesPopUp(true);
        }
        setCoords(res?.rider?.current_location?.root_coordinates)
        coordinateRoute = res?.rider?.current_location?.root_coordinates
          onUpdateRiderMoveValue(res?.rider?.current_location?.distancekm)
        onKmsTime(res?.rider?.current_location?.distancekm , res?.current_location?.rider?.eta)

      }
        

      const currentLoc = res?.rider?.current_location;
      //  updateHeading = res?.rider?.current_location?.rider_moment ?? 0;
      //  setHeading(res?.rider?.current_location?.rider_moment ?? 0);
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
            updateHeading = calculatedHeading;
            setHeading(calculatedHeading)
            // animateRotation(calculatedHeading);
            console.log('📐 Calculated heading from movement:', actualHeading.toFixed(1));
          } else {
            updateHeading = res?.rider?.current_location?.rider_moment ?? 0;
            setHeading(res?.rider?.current_location?.rider_moment ?? 0);
            // animateRotation(res?.rider?.current_location?.rider_moment ?? 0)
          }
        } else {
          updateHeading = res?.rider?.current_location?.rider_moment ?? 0;
          setHeading(res?.rider?.current_location?.rider_moment ?? 0);
          // animateRotation(res?.rider?.current_location?.rider_moment ?? 0)
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
  };


  useEffect(() => {
    socketServices.initailizeSocket();
      try {
    socketServices.on('getremainingdistance', data => {
      console.log('Remaining distance data--:', data, data?.location);

      const newLocation = data?.location;

       if(data?.root_coordinates?.length > 0){
         if ((data?.distancekm <= 0.20 && !showPickDesPopUpModal && riderCustomerDetails?.status == 'picked')) {
          showPickDesPopUpModal = true;
          setShowPickDesPopUp(true);
        }
        setCoords(data?.root_coordinates)
        coordinateRoute = data?.root_coordinates
           onUpdateRiderMoveValue(data?.distancekm)
        onKmsTime(data?.distancekm , data?.eta)

      }
        
      
      if(!newLocation && riderCustomerDetails){
         onUpdateCutomerLocation(riderCustomerDetails)
      }

      if (!newLocation?.lat || !newLocation?.lng) return;
          currentLiveRiderLocation = newLocation
      // updateHeading = data?.rider_moment ?? 0
      //   setHeading(data?.rider_moment ?? 0)

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
            updateHeading = calculatedHeading;
            setHeading(calculatedHeading)
            // animateRotation(calculatedHeading)
            console.log('📐 Calculated heading from movement newLocation:', actualHeading.toFixed(1));
          } else {
            updateHeading = data?.rider_moment ?? 0
            setHeading(data?.rider_moment ?? 0)
            // animateRotation(data?.rider_moment ?? 0)
          }
        } else {
          updateHeading = data?.rider_moment ?? 0
          setHeading(data?.rider_moment ?? 0)
          // animateRotation(data?.rider_moment ?? 0)
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
      if(riderCustomerDetails){
      onUpdateCutomerLocation(riderCustomerDetails)
      }
        
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
      if(Platform.OS == 'android'){
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
    }else{
       animatedCoordinate.timing({
        latitude: newCoordinate.latitude,
        longitude: newCoordinate.longitude,
        duration: 200,
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

    // Update camera if app is active
    if (appStateRef.current === 'active' && mapRef?.current && currentDestination) {
      if (cameraAnimationTimeoutRef.current) {
        clearTimeout(cameraAnimationTimeoutRef.current);
      }

      cameraAnimationTimeoutRef.current = setTimeout(() => {
        if (mapRef?.current) {
          try {
            const bearing = getBearing(newLocation, currentDestination);
            
            mapRef.current.animateCamera(
              {
                center: newCoordinate,
                heading: bearing,
                pitch: 0,
                zoom: 17,
              },
              { duration: 1000 },
              () => {
                console.log('✅ Camera animation completed');
              }
            );
          } catch (error) {
            console.log('❌ Error animating camera:', error);
          }
        }
      }, 300);
    }
  }, []);


  // Smooth camera updates when route changes - FIXED to prevent repeated hits

  useEffect(() => {
    if (!isMountedRef.current || appStateRef.current !== 'active') return;

    if ((currentLiveRiderLocation?.lat ?? origin?.lat) && destination && mapRef?.current && coords?.length > 0) {
      // Clear any pending camera animation
      if (cameraAnimationTimeoutRef.current) {
        clearTimeout(cameraAnimationTimeoutRef.current);
        cameraAnimationTimeoutRef.current = null;
      }

      // Only animate camera when route first loads (not on every route update)
      // This prevents the camera from jumping repeatedly
      if (!hasAnimatedOnce.current && !isCameraAnimatingRef.current) {
        const routeCameraTimeout = setTimeout(() => {
          if (isMountedRef.current && appStateRef.current === 'active' && mapRef?.current && !isCameraAnimatingRef.current) {
            try {
              const currentLocation = currentLiveRiderLocation?.lat ? currentLiveRiderLocation : origin;
              const bearing = getBearing(currentLocation, destination);
              const firstCoord = coords[0];

              isCameraAnimatingRef.current = true;

              console.log('🎥 Animating camera to route start:', firstCoord);

              mapRef.current.animateCamera(
                {
                  center: firstCoord,
                  heading: bearing,
                  pitch: 0,
                  zoom: 17,
                  altitude: 300,
                },
                { duration: 2000 }, // Smooth 2 second animation
                () => {
                  isCameraAnimatingRef.current = false;
                  console.log('✅ Route camera animation completed');
                }
              );

              lastCameraPositionRef.current = {
                latitude: firstCoord.latitude,
                longitude: firstCoord.longitude,
                heading: bearing,
              };
            } catch (error) {
              console.log('❌ Error animating route camera:', error);
              isCameraAnimatingRef.current = false;
            }
          }
        }, 500); // Small delay to ensure route is fully loaded

        return () => clearTimeout(routeCameraTimeout);
      }
    }
  }, [coords, origin, destination, currentLiveRiderLocation]);

  // useEffect(() => {
  //   if (currentLiveRiderLocation && destination && mapRef?.current && coords) {
  //     const bearing = getBearing(currentLiveRiderLocation ?? origin, destination);
  //     // const lastCoord = coords[(coords?.length) / 2 - 1];
  //     const lastCoord = coords[0];
  //     mapRef?.current?.animateCamera(
  //       {
  //         center: lastCoord,
  //         // { latitude: currentLiveRiderLocation?.lat ?? origin?.lat, longitude: currentLiveRiderLocation?.lng ?? origin?.lng },
  //         heading: bearing, // rotate toward destination
  //         pitch: 0,
  //         zoom: 17, // keep zoom fixed
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
    console.log("current, polylinePoints, threshold",current, polylinePoints, threshold);
    
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
    //    if (hasDirectionApiCalling?.current) {
    //   clearTimeout(hasDirectionApiCalling.current);
    // }
    //  hasDirectionApiCalling.current = setTimeout(async () => {
    //        const distance = checkDistance(sender, receiver);
    //     if ((distance <= 0.20 && !showPickDesPopUpModal && riderCustomerDetails?.status == 'picked')) {
    //       showPickDesPopUpModal = true;
    //       setShowPickDesPopUp(true);
    //     }
      //   console.log("isOffRoute-- isCurrentOnRoute",
      //     (!isCurrentOnRoute(sender, coordinateRoute ?? coords, 100) || coords?.length == 0),
      //   !isCurrentOnRoute(sender, coordinateRoute ?? coords, 100),
      //   coords?.length == 0,
      //   isOffRoute(sender, coordinateRoute ?? coords)
      // );
        //   isOffRoute(sender, coordinateRoute ?? coords)
        //  (!isCurrentOnRoute(sender, coordinateRoute ?? coords, 100) || coords?.length == 0)
        console.log("(coords?.length == 0 || coordinateRoute?.length == 0)",
          coords?.length == 0,
          coordinateRoute?.length == 0,
           (coords?.length == 0 || coordinateRoute?.length == 0));
        
  if ((coords?.length == 0 && coordinateRoute?.length == 0)) {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/directions/json?origin=${Number(currentLiveRiderLocation?.lat ?? sender?.lat)},${Number(currentLiveRiderLocation?.lng ?? sender?.lng)}&destination=${Number(receiver?.lat)},${Number(receiver?.lng)}&alternatives=true&key=${MAP_KEY}`
      );
      //  alert("yes-");
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
        coordinateRoute=routeCoords;
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
    // }, 1000); // 1000ms debounce delay
  }, [riderCustomerDetails, onKmsTime]);



  const handleMapReady = () => {
    setTimeout(() => {
      setIsMapReady(true);
    }, 5000);
  };

  // if(update){

  return (
    <View
      pointerEvents={isPendingReq ? 'none' : null}
      style={styles.homeSubContainer}
    >
    {(origin && destination) &&
      <>
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
              // { transform: [{ rotate: `${70}deg` }] }
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
        
        {(coords?.length > 0 || coordinateRoute?.length > 0)&& (
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
         </>}
        {/* //       :
        // <View style={[styles.mapContainer, mapContainerView]}>
        // </View>} */}
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
    marginTop: Platform.OS === 'ios' ? '25%' : 0,
  },
  markerBikeImage: {
    height: 60,  //30,
    width: 60,   //30,
    marginTop: Platform.OS === 'ios' ? '25%' : 0,
  },
})






// import React, {
//   memo,
//   useCallback,
//   useEffect,
//   useRef,
//   useState,
// } from 'react';
// import { StyleSheet, View, Image, Platform, Text, AppState, Animated } from 'react-native';
// import {
//   heightPercentageToDP as hp,
//   widthPercentageToDP as wp,
// } from 'react-native-responsive-screen';
// import { appImages } from '../commons/AppImages';
// import MapView, { Marker, AnimatedRegion, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
// import PolylineDecoder from '@mapbox/polyline';
// import { colors } from '../theme/colors';
// import { setMpaDalta } from './GeoCodeAddress';
// import { useFocusEffect } from '@react-navigation/native';
// import { DuuittMapTheme } from './DuuittMapTheme';
// import { rootStore } from '../stores/rootStore';
// import { MAP_KEY } from '../halpers/AppLink';
// import { startBackgroundTask } from '../halpers/BackgroundServices/BackgroundServices';
// import haversine from "haversine-distance";
// import PopUpInProgess from './appPopUp/PopUpInProgess';
// import socketServices from '../socketIo/SocketServices';

// let updateHeading = 0;
// let updateLiveLocation = { lat: null, lng: null }
// let updateTimerValue = 5 //  20 meters
// let showPickDesPopUpModal = false
// let kmValue = 0
// let coordinateRoute = []

// const MapRouteTracking = ({ mapContainerView, origin, destination, isPendingReq, riderCustomerDetails, onKmsTime }) => {
//   const { getCustomerWiseRiderLocation, ordersDirectionGooglemapHit } = rootStore.orderStore;
//   const mapRef = useRef(null);
//   const hasAnimatedOnce = useRef(false);
//   const hasDirectionApiCalling = useRef(null)
//   const prevLocationRef = useRef(null);
//   const markerRef = useRef(null);
//   const markerDesRef = useRef(null);
//   const bearingRef = useRef(0);
//   const [coords, setCoords] = useState([]);
//   const [isMapReady, setIsMapReady] = useState(false);
//   const [riderHeading, setRiderHeading] = useState(0);
//   const [showPickDesPopUp, setShowPickDesPopUp] = useState(false);

//   // Animated rotation value for smooth bike marker rotation
//   const animatedRotation = useRef(new Animated.Value(0)).current;
//   const lastRotationRef = useRef(0);

//   // Use animated regions for smooth marker movement
//   const [animatedCoordinate] = useState(
//     new AnimatedRegion({
//       latitude: Number(updateLiveLocation?.lat ?? origin?.lat) || 30.7400,
//       longitude: Number(updateLiveLocation?.lng ?? origin?.lng) || 76.7900,
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
//     latitude: Number(updateLiveLocation?.lat ?? origin?.lat) || 30.7400,
//     longitude: Number(updateLiveLocation?.lng ?? origin?.lng) || 76.7900,
//   });
//   const isMountedRef = useRef(true);
//   const appStateRef = useRef(AppState.currentState);
//   const routeFetchTimeoutRef = useRef(null);
//   const lastRouteFetchRef = useRef(0);
//   const lastCameraAnimationRef = useRef(0);
//   const cameraAnimationTimeoutRef = useRef(null);
//   const isCameraAnimatingRef = useRef(false);
//   const lastCameraPositionRef = useRef({
//     latitude: Number(updateLiveLocation?.lat ?? origin?.lat) || 30.7400,
//     longitude: Number(updateLiveLocation?.lng ?? origin?.lng) || 76.7900,
//     heading: 0,
//   });
//   const backgroundTaskTimeoutRef = useRef(null);

//   // Cleanup function - Enhanced to prevent crashes
//   const cleanup = useCallback(() => {
//     if (trackingIntervalRef.current) {
//       clearInterval(trackingIntervalRef.current);
//       trackingIntervalRef.current = null;
//     }
//     if (routeFetchTimeoutRef.current) {
//       clearTimeout(routeFetchTimeoutRef.current);
//       routeFetchTimeoutRef.current = null;
//     }
//     if (cameraAnimationTimeoutRef.current) {
//       clearTimeout(cameraAnimationTimeoutRef.current);
//       cameraAnimationTimeoutRef.current = null;
//     }
//     if (backgroundTaskTimeoutRef.current) {
//       clearTimeout(backgroundTaskTimeoutRef.current);
//       backgroundTaskTimeoutRef.current = null;
//     }
//     // Stop any ongoing animations
//     try {
//       animatedCoordinate.stopAnimation();
//       animatedDesCoordinate.stopAnimation();
//     } catch (error) {
//       console.log('Error stopping animations:', error);
//     }
//     // Stop camera animation
//     if (mapRef?.current && isCameraAnimatingRef.current) {
//       try {
//         mapRef.current.stopAnimation?.();
//         isCameraAnimatingRef.current = false;
//       } catch (error) {
//         console.log('Error stopping camera animation:', error);
//       }
//     }
//   }, [animatedCoordinate, animatedDesCoordinate]);

//   // Component mount/unmount handling
//   useEffect(() => {
//     isMountedRef.current = true;
//     return () => {
//       isMountedRef.current = false;
//       cleanup();
//     };
//   }, [cleanup]);

//   // Handle app state changes to prevent crashes
//   useEffect(() => {
//     const subscription = AppState.addEventListener('change', nextAppState => {
//       if (appStateRef.current === nextAppState) return;

//       const previousState = appStateRef.current;
//       appStateRef.current = nextAppState;

//       if (nextAppState === 'background' || nextAppState === 'inactive') {
//         console.log('App going to background - cleaning up intervals');
//         cleanup();
//       }

//       if (nextAppState === 'active' || previousState !== 'active') {
//         console.log('App becoming active - restarting location tracking');
//         const restartTimeout = setTimeout(() => {
//           if (appStateRef.current === 'active' && origin && destination) {
//             if (trackingIntervalRef?.current) {
//               clearInterval(trackingIntervalRef?.current);
//             }
//             trackingIntervalRef.current = setInterval(() => {
//               if (appStateRef.current === 'active') {
//                 initializeLocationTracking();
//               }
//             }, 5000);
//             initializeLocationTracking();
//           }
//         }, 1500);

//         return () => clearTimeout(restartTimeout);
//       }
//     });

//     return () => {
//       subscription?.remove();
//     };
//   }, [origin, destination, cleanup, initializeLocationTracking]);

//   // Socket listener for real-time location updates - FIXED
//   useEffect(() => {
//     socketServices.initailizeSocket();

//     const handleRemainingDistance = (data) => {
//       console.log('Remaining distance data--:', data, data?.location);
      
//       try {
//         let currentLocationRider = data?.location;
//         if (!currentLocationRider?.lat || !currentLocationRider?.lng) {
//           console.log("❌ Invalid location data from socket");
//           return;
//         }

//         const locationData = {
//           latitude: currentLocationRider.lat,
//           longitude: currentLocationRider.lng,
//           heading: data?.rider_moment || 0
//         };

//         const { latitude, longitude, heading = 0 } = locationData;
//         updateLiveLocation = { lat: latitude, lng: longitude };
//         const newLocation = { lat: latitude, lng: longitude };

//         // Calculate distance moved
//         const distance = prevLocationRef.current
//           ? getDistanceInMeters(
//             prevLocationRef.current.lat,
//             prevLocationRef.current.lng,
//             latitude,
//             longitude
//           )
//           : 999;

//         const threshold = updateTimerValue || 20;

//         console.log("📍 Socket Location update check:", {
//           distance: distance.toFixed(2) + 'm',
//           threshold: threshold + 'm',
//           shouldUpdate: distance >= threshold
//         });

//         if (distance >= threshold) {
//           if (!isMountedRef.current) return;

//           // Calculate heading
//           let actualHeading = heading;
//           if (!actualHeading || isNaN(actualHeading) || actualHeading === 0) {
//             const prevPos = prevLocationRef.current;
//             if (prevPos) {
//               const calculatedHeading = calculateHeadingFromMovement(
//                 prevPos.lat,
//                 prevPos.lng,
//                 latitude,
//                 longitude
//               );
//               if (calculatedHeading !== null) {
//                 actualHeading = calculatedHeading;
//                 console.log('📐 Calculated heading from movement:', actualHeading.toFixed(1));
//               }
//             }
//           }

//           // Update heading and animate rotation
//           if (actualHeading !== null && !isNaN(actualHeading) && actualHeading !== undefined) {
//             updateHeading = actualHeading;
//             setRiderHeading(actualHeading);
//             animateRotation(actualHeading);
//           }

//           prevLocationRef.current = newLocation;

//           // Move marker and update heading
//           animate(latitude, longitude, newLocation, destination, actualHeading);

//           // Call direction API with updated location
//           fetchRoute(newLocation, destination);

//           console.log("✅ Socket Location updated - marker moved and APIs called");
//         } else {
//           console.log("📍 Socket Movement too small - skipping update");
//         }
//       } catch (error) {
//         console.log('❌ Error in socket location handling:', error);
//       }
//     };

//     socketServices.on('getremainingdistance', handleRemainingDistance);

//     return () => {
//       socketServices.removeListener('getremainingdistance', handleRemainingDistance);
//     };
//   }, [destination]);

//   // Initialize location tracking function - FIXED
//   const initializeLocationTracking = useCallback(async () => {
//     if (!isMountedRef.current || appStateRef.current !== 'active') return;

//     try {
//       const res = await getCustomerWiseRiderLocation(riderCustomerDetails);
//       console.log("res?.rider?.current_location--", res?.rider);
      
//       let currentLoc = res?.rider?.current_location;
//       if (!currentLoc?.lat || !currentLoc?.lng) {
//         console.log("❌ Invalid location data from API");
//         return;
//       }

//       const locationData = {
//         latitude: currentLoc.lat,
//         longitude: currentLoc.lng,
//         heading: res?.rider?.rider_moment || 0
//       };

//       const { latitude, longitude, heading = 0 } = locationData;
//       updateLiveLocation = { lat: latitude, lng: longitude };
//       const newLocation = { lat: latitude, lng: longitude };

//       // Calculate distance moved
//       const distance = prevLocationRef.current
//         ? getDistanceInMeters(
//           prevLocationRef.current.lat,
//           prevLocationRef.current.lng,
//           latitude,
//           longitude
//         )
//         : 999;

//       const threshold = updateTimerValue || 20;

//       console.log("📍 API Location update check:", {
//         distance: distance.toFixed(2) + 'm',
//         threshold: threshold + 'm',
//         shouldUpdate: distance >= threshold
//       });

//       if (distance >= threshold) {
//         if (!isMountedRef.current) return;

//         // Calculate heading
//         let actualHeading = heading;
//         if (!actualHeading || isNaN(actualHeading) || actualHeading === 0) {
//           const prevPos = prevLocationRef.current;
//           if (prevPos) {
//             const calculatedHeading = calculateHeadingFromMovement(
//               prevPos.lat,
//               prevPos.lng,
//               latitude,
//               longitude
//             );
//             if (calculatedHeading !== null) {
//               actualHeading = calculatedHeading;
//               console.log('📐 Calculated heading from movement:', actualHeading.toFixed(1));
//             }
//           }
//         }

//         // Update heading and animate rotation
//         if (actualHeading !== null && !isNaN(actualHeading) && actualHeading !== undefined) {
//           updateHeading = actualHeading;
//           setRiderHeading(actualHeading);
//           animateRotation(actualHeading);
//         }

//         prevLocationRef.current = newLocation;

//         // Move marker and update heading
//         animate(latitude, longitude, newLocation, destination, actualHeading);

//         // Call direction API with updated location
//         fetchRoute(newLocation, destination);

//         console.log("✅ API Location updated - marker moved and APIs called");
//       } else {
//         console.log("📍 API Movement too small - skipping update");
//       }
//     } catch (error) {
//       console.log('❌ Error in initializeLocationTracking:', error);
//     }
//   }, [destination, riderCustomerDetails]);

//   // Clear timeout on component unmount
//   useEffect(() => {
//     return () => {
//       if (hasDirectionApiCalling?.current) {
//         clearTimeout(hasDirectionApiCalling.current);
//       }
//     };
//   }, []);

//   // Focus effect for initial setup - FIXED
//   useFocusEffect(
//     useCallback(() => {
//       backgroundTaskTimeoutRef.current = setTimeout(() => {
//         onStartBackgroundTask();
//       }, 2000);

//       if (origin && destination) {
//         // Initialize with origin location
//         const initialLat = origin?.lat;
//         const initialLng = origin?.lng;

//         if (initialLat && initialLng) {
//           console.log('🎯 Focus effect - initializing marker position');
//           updateLiveLocation = { lat: initialLat, lng: initialLng };
//           prevLocationRef.current = { lat: initialLat, lng: initialLng };
          
//           animate(initialLat, initialLng, { lat: initialLat, lng: initialLng }, destination, updateHeading || 0);
//           fetchRoute({ lat: initialLat, lng: initialLng }, destination);
//         }
//       }
      
//       return () => {
//         if (backgroundTaskTimeoutRef.current) {
//           clearTimeout(backgroundTaskTimeoutRef.current);
//           backgroundTaskTimeoutRef.current = null;
//         }
//       };
//     }, [origin, destination])
//   );

//   const onStartBackgroundTask = async () => {
//     try {
//       await startBackgroundTask();
//       console.log('✅ Background task started from MapRouteTracking');
//     } catch (error) {
//       console.log('❌ Error starting background task:', error);
//     }
//   };

//   // Initialize location tracking when component mounts
//   useEffect(() => {
//     if (!origin || !destination) return;

//     socketServices.initailizeSocket();

//     // Start tracking immediately if app is active
//     if (appStateRef.current === 'active') {
//       initializeLocationTracking();
//     }

//     // Set up interval for live location updates
//     if (trackingIntervalRef.current) {
//       clearInterval(trackingIntervalRef.current);
//     }

//     trackingIntervalRef.current = setInterval(() => {
//       if (isMountedRef.current && appStateRef.current === 'active') {
//         console.log('🔄 Interval tick - updating location');
//         initializeLocationTracking();
//       }
//     }, 5000);

//     return () => {
//       if (trackingIntervalRef.current) {
//         clearInterval(trackingIntervalRef.current);
//         trackingIntervalRef.current = null;
//       }
//     };
//   }, [origin, destination, initializeLocationTracking]);

//   // Helper functions
//   const getDistanceInMeters = (lat1, lon1, lat2, lon2) => {
//     const R = 6371e3;
//     const toRad = (x) => (x * Math.PI) / 180;
//     const φ1 = toRad(lat1);
//     const φ2 = toRad(lat2);
//     const Δφ = toRad(lat2 - lat1);
//     const Δλ = toRad(lon2 - lon1);

//     const a =
//       Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
//       Math.cos(φ1) * Math.cos(φ2) *
//       Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
//     const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

//     return R * c;
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

//   // Calculate heading from movement direction
//   const calculateHeadingFromMovement = useCallback((prevLat, prevLng, currentLat, currentLng) => {
//     if (!prevLat || !prevLng || !currentLat || !currentLng) {
//       return null;
//     }
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

//     let normalizedHeading = newHeading % 360;
//     if (normalizedHeading < 0) {
//       normalizedHeading += 360;
//     }

//     const currentRotation = lastRotationRef.current;
//     let rotationDiff = normalizedHeading - currentRotation;
//     if (rotationDiff > 180) {
//       rotationDiff -= 360;
//     } else if (rotationDiff < -180) {
//       rotationDiff += 360;
//     }

//     const targetRotation = currentRotation + rotationDiff;
//     lastRotationRef.current = normalizedHeading;

//     Animated.timing(animatedRotation, {
//       toValue: targetRotation,
//       duration: 500,
//       useNativeDriver: false,
//     }).start(() => {
//       if (isMountedRef.current) {
//         animatedRotation.setValue(normalizedHeading);
//         lastRotationRef.current = normalizedHeading;
//       }
//     });

//     console.log('🔄 Rotating bike marker:', {
//       from: currentRotation.toFixed(1),
//       to: normalizedHeading.toFixed(1),
//       diff: rotationDiff.toFixed(1),
//     });
//   }, [animatedRotation]);

//   // Main animate function - FIXED
//   const animate = useCallback((latitude, longitude, newLocation, currentDestination, heading) => {
//     if (!isMountedRef.current) {
//       console.log('⚠️ Skipping animation - component not mounted');
//       return;
//     }

//     const newCoordinate = { latitude: Number(latitude), longitude: Number(longitude) };

//     if (isNaN(newCoordinate.latitude) || isNaN(newCoordinate.longitude)) {
//       console.log('❌ Invalid coordinates for animation:', { latitude, longitude });
//       return;
//     }

//     // Update current position
//     currentPositionRef.current = newCoordinate;

//     console.log('🎯 Animating marker to:', {
//       lat: newCoordinate.latitude.toFixed(6),
//       lng: newCoordinate.longitude.toFixed(6)
//     });

//     // Smooth marker animation
//     try {
//       animatedCoordinate.timing({
//         latitude: newCoordinate.latitude,
//         longitude: newCoordinate.longitude,
//         duration: 1000,
//         useNativeDriver: false,
//       }).start((finished) => {
//         if (isMountedRef.current && finished) {
//           console.log('✅ Marker animation completed successfully');
//         }
//       });
//     } catch (error) {
//       console.log('❌ Error starting marker animation:', error);
//       try {
//         animatedCoordinate.setValue({
//           latitude: newCoordinate.latitude,
//           longitude: newCoordinate.longitude,
//         });
//       } catch (setError) {
//         console.log('❌ Error setting marker position:', setError);
//       }
//     }

//     // Update camera if app is active
//     if (appStateRef.current === 'active' && mapRef?.current && currentDestination) {
//       if (cameraAnimationTimeoutRef.current) {
//         clearTimeout(cameraAnimationTimeoutRef.current);
//       }

//       cameraAnimationTimeoutRef.current = setTimeout(() => {
//         if (isMountedRef.current && appStateRef.current === 'active' && mapRef?.current) {
//           try {
//             const bearing = getBearing(newLocation, currentDestination);
            
//             mapRef.current.animateCamera(
//               {
//                 center: newCoordinate,
//                 heading: bearing,
//                 pitch: 0,
//                 zoom: 17,
//               },
//               { duration: 1000 },
//               () => {
//                 console.log('✅ Camera animation completed');
//               }
//             );
//           } catch (error) {
//             console.log('❌ Error animating camera:', error);
//           }
//         }
//       }, 300);
//     }
//   }, []);

//   // Fit map to coordinates when route is loaded
//   useEffect(() => {
//     if ((coords?.length > 1 && mapRef?.current && !hasAnimatedOnce.current)) {
//       const edgePadding = {
//         top: 50,
//         right: 50,
//         bottom: 50,
//         left: 50,
//       };
//       mapRef.current.fitToCoordinates(coords, {
//         edgePadding,
//         animated: true,
//       });
//       hasAnimatedOnce.current = true;
//     }
//   }, [coords]);

//   const onUpdateRiderMoveValue = (kms) => {
//     console.log('kms', kms);
//     kmValue = kms

//     if (kms >= 30) {
//       updateTimerValue = 40;
//     } else if (kms >= 25) {
//       updateTimerValue = 35;
//     } else if (kms >= 20) {
//       updateTimerValue = 30;
//     } else if (kms >= 15) {
//       updateTimerValue = 25;
//     } else if (kms >= 10) {
//       updateTimerValue = 20;
//     } else if (kms >= 7) {
//       updateTimerValue = 20;
//     } else if (kms >= 4) {
//       updateTimerValue = 10;
//     } else if (kms >= 2) {
//       updateTimerValue = 10;
//     } else if (kms >= 1) {
//       updateTimerValue = 10;
//     } else if (kms >= 0.5) {
//       updateTimerValue = 5;
//     } else {
//       updateTimerValue = 5;
//     }
//   }

//   const checkDistance = (current, destination) => {
//     if (!current?.lat || !destination?.lat) return 0;

//     let newCurrentLocation = {
//       latitude: current?.lat,
//       longitude: current?.lng
//     }

//     let newDestination = {
//       latitude: destination?.lat,
//       longitude: destination?.lng
//     }

//     const distanceInMeters = haversine(newCurrentLocation, newDestination);
//     const distanceInKm = distanceInMeters / 1000;
//     const avgSpeedKmPerMin = 0.75;
//     const etaMinutes = distanceInKm / avgSpeedKmPerMin;
    
//     onUpdateRiderMoveValue?.(distanceInKm);

//     const eta = `${etaMinutes.toFixed(1)} m`;
//     onKmsTime?.(distanceInKm.toFixed(2), eta);

//     return distanceInKm;
//   };

//   // Route checking functions
//   const updatePolylineProgress = (current, polylinePoints) => {
//     const currentLocation = {
//       latitude: current?.lat,
//       longitude: current?.lng,
//     };

//     let nearestPointIndex = 0;
//     let minDistance = Infinity;

//     polylinePoints?.forEach((point, index) => {
//       const dist = haversine(currentLocation, point);
//       if (dist < minDistance) {
//         minDistance = dist;
//         nearestPointIndex = index;
//       }
//     });

//     const updatedPolyline = polylinePoints?.slice(nearestPointIndex);
//     return { updatedPolyline, nearestPointIndex, distanceFromRoute: minDistance };
//   };

//   const isOffRoute = (current, polylinePoints) => {
//     const { distanceFromRoute, updatedPolyline } = updatePolylineProgress(current, polylinePoints);
//     console.log("Distance from route (m):", distanceFromRoute);
//     setCoords(updatedPolyline)
//     coordinateRoute = updatedPolyline;
//     return distanceFromRoute > 50;
//   };

//   const pointToLineDistance = (p, a, b) => {
//     const aToP = haversine(a, p);
//     const bToP = haversine(b, p);
//     const aToB = haversine(a, b);

//     if (aToB === 0) return aToP;

//     const cosTheta = (aToP ** 2 + aToB ** 2 - bToP ** 2) / (2 * aToP * aToB);
//     const projection = aToP * cosTheta;

//     if (projection < 0) return aToP;
//     if (projection > aToB) return bToP;

//     const s = (aToP + bToP + aToB) / 2;
//     const area = Math.sqrt(Math.max(0, s * (s - aToP) * (s - bToP) * (s - aToB)));
//     return (2 * area) / aToB;
//   };

//   const isCurrentOnRoute = (current, polylinePoints, threshold = 100) => {
//     const point = { latitude: current?.lat, longitude: current?.lng };

//     let kmCheckPoint = threshold;

//     if (kmValue >= 30) {
//       kmCheckPoint = 300
//     } else if (kmValue >= 25) {
//       kmCheckPoint = 280
//     } else if (kmValue >= 20) {
//       kmCheckPoint = 250
//     } else if (kmValue >= 15) {
//       kmCheckPoint = 220
//     } else if (kmValue >= 10) {
//       kmCheckPoint = 200
//     } else if (kmValue >= 5) {
//       kmCheckPoint = 150
//     } else if (kmValue >= 2) {
//       kmCheckPoint = 100
//     } else if (kmValue >= 1) {
//       kmCheckPoint = 80
//     } else if (kmValue >= 0.5) {
//       kmCheckPoint = 50
//     } else if (kmValue >= 0.1) {
//       kmCheckPoint = 30
//     } else {
//       kmCheckPoint = 20
//     }

//     for (let i = 0; i < polylinePoints?.length - 1; i++) {
//       const dist = pointToLineDistance(point, polylinePoints[i], polylinePoints[i + 1]);
//       if (dist <= kmCheckPoint ?? threshold) {
//         console.log(`✅ On route (distance ${dist.toFixed(1)}m)`);
//         return true;
//       }
//     }
//     console.log(`❌ Off route (all distances > ${threshold}m)`);
//     return false;
//   };

//   // Fetch route function - FIXED to use current location properly
//   const fetchRoute = useCallback(async (currentLocation, destinationPoint) => {
//     if (hasDirectionApiCalling?.current) {
//       clearTimeout(hasDirectionApiCalling.current);
//     }
    
//     hasDirectionApiCalling.current = setTimeout(async () => {
//       const distance = checkDistance(currentLocation, destinationPoint);
//       if (distance <= 0.20 && !showPickDesPopUpModal && riderCustomerDetails?.status === 'picked') {
//         showPickDesPopUpModal = true;
//         setShowPickDesPopUp(true);
//       }

//       isOffRoute(currentLocation, coordinateRoute ?? coords)
      
//       if ((!isCurrentOnRoute(currentLocation, coordinateRoute ?? coords, 100) || coords?.length == 0)) {
//         try {
//           const originLat = Number(currentLocation?.lat);
//           const originLng = Number(currentLocation?.lng);
//           const destLat = Number(destinationPoint?.lat);
//           const destLng = Number(destinationPoint?.lng);

//           if (isNaN(originLat) || isNaN(originLng) || isNaN(destLat) || isNaN(destLng)) {
//             console.log('❌ Invalid coordinates for route fetching');
//             return;
//           }

//           const response = await fetch(
//             `https://maps.googleapis.com/maps/api/directions/json?origin=${originLat},${originLng}&destination=${destLat},${destLng}&alternatives=true&key=${MAP_KEY}`
//           );
//           alert("yes");
//           const json = await response?.json();
//           ordersDirectionGooglemapHit(riderCustomerDetails, "Route Directions")

//           if (json?.routes?.length > 0) {
//             let shortestRoute = json?.routes[0];
//             let minDistance = json?.routes[0]?.legs[0]?.distance?.value;
//             let minDuration = json?.routes[0]?.legs[0]?.duration?.value;

//             json?.routes?.forEach(route => {
//               const distance = route?.legs[0]?.distance?.value;
//               if (distance < minDistance) {
//                 minDistance = distance;
//                 minDuration = route?.legs[0]?.duration?.value;
//                 shortestRoute = route;
//               }
//             });

//             const points = PolylineDecoder?.decode(shortestRoute?.overview_polyline.points);
//             const routeCoords = points?.map(point => ({
//               latitude: point[0],
//               longitude: point[1],
//             }));

//             const distanceInKm = (minDistance / 1000).toFixed(2);
//             const durationInMin = Math.floor(minDuration / 60);
//             const durationInSec = Math.floor(minDuration % 60);
//             const eta = `${durationInMin}m ${durationInSec}s`;

//             console.log(`🚗 Shortest route: ${distanceInKm} km, ⏱️ ${durationInMin} min ${durationInSec} sec`);

//             if ((distanceInKm <= 0.20 && !showPickDesPopUpModal && riderCustomerDetails?.status == 'picked')) {
//               showPickDesPopUpModal = true;
//               setShowPickDesPopUp(true);
//             }
            
//             setCoords(routeCoords);
//             coordinateRoute = routeCoords;
//             onUpdateRiderMoveValue(distanceInKm);
//             onKmsTime?.(distanceInKm, eta);
//           } else {
//             console.log('⚠️ No routes found.');
//           }
//         } catch (error) {
//           console.log('❌ Error fetching route:', error);
//         }
//       } else {
//         console.log("same route tracking in map");
//       }
//     }, 1000);
//   }, [riderCustomerDetails, onKmsTime]);

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
//       {(origin && destination) ?
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
//           followsUserLocation={true}
//           showsTraffic={false}
//           onMapReady={handleMapReady}
//           onRegionChangeComplete={(region) => {
//             setMpaDalta(region);
//           }}
//         >

//           {/* Origin Marker */}
//           <Marker.Animated
//             ref={markerRef}
//             coordinate={animatedCoordinate}
//             tracksViewChanges={!isMapReady}
//             centerOffset={{ x: 0, y: -10 }}
//             anchor={{ x: 0.5, y: 0.5 }}
//             rotation={riderHeading || updateHeading || 0}
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
//             coordinate={animatedDesCoordinate}
//             tracksViewChanges={!isMapReady}
//             centerOffset={{ x: 0, y: -10 }}
//             anchor={{ x: 0.5, y: 0.5 }}
//           >
//             <Image
//               resizeMode="contain"
//               source={appImages.markerImage}
//               style={styles.markerImage}
//             />
//           </Marker.Animated>

//           {/* Route Polyline */}
//           {(coords?.length > 0 || coordinateRoute?.length > 0) && (
//             <Polyline
//               coordinates={coordinateRoute ?? coords}
//               strokeWidth={4}
//               strokeColor={colors.green}
//             />
//           )}
//         </MapView>
//         :
//         <View style={[styles.mapContainer, mapContainerView]}>
//         </View>}
//       <PopUpInProgess
//         topIcon={false}
//         CTATitle={'ok'}
//         visible={showPickDesPopUp}
//         type={'Error'}
//         onClose={() => { setShowPickDesPopUp(false), showPickDesPopUpModal = true }}
//         title={riderCustomerDetails?.status == 'picked' ? "Dropped Location" : "Pickup Location"}
//         text={
//           riderCustomerDetails?.status == 'picked' ? "Rider has reached and completed the ride at the destination" : "Rider has arrived at the pickup location"
//         }
//       />
//     </View>
//   );
// };

// export default memo(MapRouteTracking);

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
//     height: 60,
//     width: 60,
//     marginTop: Platform.OS === 'ios' ? '25%' : 0,
//   },
// });














// import React, {
//   memo,
//   useCallback,
//   useEffect,
//   useRef,
//   useState,
// } from 'react';
// import { StyleSheet, View, Image, Platform, Easing, Animated } from 'react-native';
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


// let currentLiveRiderLocation = {}
// let updateTimerValue = 20 // meters
// let updateHeading = 0;
// let showPickDesPopUpModal = false

// const MapRouteTracking = ({ mapContainerView, origin, destination, isPendingReq, riderCustomerDetails, onKmsTime }) => {
//   const { getCustomerWiseRiderLocation } = rootStore.orderStore;
//   const mapRef = useRef(null);
//   const hasAnimatedOnce = useRef(false);
//   const hasAnimatedCameraRef = useRef(false)
//   const animatedRotation = useRef(new Animated.Value(0)).current;
//   const markerRef = useRef(null);
//   const markerDesRef = useRef(null);
//   const prevLocationRef = useRef(null);
//   const bearingRef = useRef(0);
//   const lastRotationRef = useRef(0);
//   const isMountedRef = useRef(true);
//   const headingUpdateTimeoutRef = useRef(null);
//   const animationHeadingUpdateIntervalRef = useRef(null);
//   const MIN_ROTATION_THRESHOLD = 5; // Only rotate if change is more than 5 degrees
//   const [coords, setCoords] = useState([]);
//   const [isMapReady, setIsMapReady] = useState(false);
//   const [update, setUpdate] = useState(true);
//   const [heading, setHeading] = useState(0)
//   const [showPickDesPopUp, setShowPickDesPopUp] = useState(false)


//   const onUpdateRiderMoveValue = (kms) => {
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
//     if (origin && destination) {
//       setUpdate(false);
//       const updateRes = setTimeout(() => {
//         setUpdate(true);
//       }, 1500);

//       // ✅ Proper cleanup
//       return () => clearTimeout(updateRes);
//     }
//   }, []);

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

//   const getDistanceInMeters = (lat1, lon1, lat2, lon2) => {
//     const R = 6371e3; // radius of Earth in meters
//     const toRad = (x) => (x * Math.PI) / 180;
//     const φ1 = toRad(lat1);
//     const φ2 = toRad(lat2);
//     const Δφ = toRad(lat2 - lat1);
//     const Δλ = toRad(lon2 - lon1);

//     const a =
//       Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
//       Math.cos(φ1) * Math.cos(φ2) *
//       Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
//     const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

//     return R * c; // distance in meters
//   };


//   useFocusEffect(
//     useCallback(() => {
//       isMountedRef.current = true;
//       setMapManageRideDaltaInitials();
//       if ((origin && destination)) {
//         currentLiveRiderLocation = origin;
//         prevLocationRef.current = origin
//         animate(origin?.lat, origin?.lng, origin, destination)
//       }

//       // Fixed: Combined location effects to prevent conflicts
//       if (riderCustomerDetails) {
//         onUpdateCutomerLocation(riderCustomerDetails);

//         const intervalId = setInterval(() => {
//           if (isMountedRef.current) {
//             onUpdateCutomerLocation(riderCustomerDetails);
//           }
//         }, 5000);

//         return () => {
//           isMountedRef.current = false;
//           clearInterval(intervalId);
//         };
//       }
//       showPickDesPopUpModal = false

//       return () => {
//         isMountedRef.current = false;
//         // Clear heading update timeout
//         if (headingUpdateTimeoutRef.current) {
//           clearTimeout(headingUpdateTimeoutRef.current);
//           headingUpdateTimeoutRef.current = null;
//         }
//         // Clear animation heading update interval
//         if (animationHeadingUpdateIntervalRef.current) {
//           clearInterval(animationHeadingUpdateIntervalRef.current);
//           animationHeadingUpdateIntervalRef.current = null;
//         }
//       };
//     }, [origin, destination, riderCustomerDetails])
//   );

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

//   // Calculate heading based on route direction (finds nearest point on route and uses route segment direction)
//   const calculateHeadingFromRoute = useCallback((currentLat, currentLng, routeCoords) => {
//     if (!currentLat || !currentLng || !routeCoords || routeCoords.length < 2) {
//       return null;
//     }

//     // Find the nearest point on the route
//     let nearestIndex = 0;
//     let minDistance = Infinity;

//     for (let i = 0; i < routeCoords.length; i++) {
//       const routePoint = routeCoords[i];
//       const distance = getDistanceInMeters(
//         currentLat,
//         currentLng,
//         routePoint.latitude,
//         routePoint.longitude
//       );
//       if (distance < minDistance) {
//         minDistance = distance;
//         nearestIndex = i;
//       }
//     }

//     // Use the direction of the route segment (from nearest point to next point)
//     // This gives the actual route direction, not direction from current position
//     let nextIndex = nearestIndex + 1;

//     // If we're at the last point, use previous segment direction
//     if (nextIndex >= routeCoords.length) {
//       if (nearestIndex > 0) {
//         // Use direction from previous point to current nearest point
//         const prevPoint = routeCoords[nearestIndex - 1];
//         const currentPoint = routeCoords[nearestIndex];
//         const heading = calculateHeadingFromMovement(
//           prevPoint.latitude,
//           prevPoint.longitude,
//           currentPoint.latitude,
//           currentPoint.longitude
//         );
//         return heading;
//       } else if (destination) {
//         // Fallback to destination if at start
//         return calculateHeadingFromMovement(
//           currentLat,
//           currentLng,
//           destination.lat,
//           destination.lng
//         );
//       }
//       return null;
//     }

//     // Calculate heading from nearest route point to next route point (route segment direction)
//     const currentRoutePoint = routeCoords[nearestIndex];
//     const nextRoutePoint = routeCoords[nextIndex];

//     // Use the route segment direction (this is the actual route direction)
//     const heading = calculateHeadingFromMovement(
//       currentRoutePoint.latitude,
//       currentRoutePoint.longitude,
//       nextRoutePoint.latitude,
//       nextRoutePoint.longitude
//     );

//     return heading;
//   }, [destination, calculateHeadingFromMovement]);


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

//     // Get current rotation value
//     const currentRotation = lastRotationRef.current;

//     // Calculate shortest rotation path (handle 360/0 wrap-around)
//     let rotationDiff = normalizedHeading - currentRotation;
//     if (rotationDiff > 180) {
//       rotationDiff -= 360;
//     } else if (rotationDiff < -180) {
//       rotationDiff += 360;
//     }

//     // Only update if the change is significant enough (prevents jittery rotation)
//     const absRotationDiff = Math.abs(rotationDiff);
//     if (absRotationDiff < MIN_ROTATION_THRESHOLD && currentRotation !== 0) {
//       // Don't rotate for small changes - keep current direction stable
//       console.log('⏸️ Skipping small rotation change:', absRotationDiff.toFixed(1) + '°');
//       return;
//     }

//     const targetRotation = currentRotation + rotationDiff;

//     // Update ref
//     lastRotationRef.current = normalizedHeading;

//     // Animate rotation smoothly
//     Animated.timing(animatedRotation, {
//       toValue: targetRotation,
//       duration: 500, // Smooth 500ms rotation animation
//       useNativeDriver: false, // Rotation must use native driver false for marker rotation
//     }).start(() => {
//       // Ensure final value is correct
//       if (isMountedRef.current) {
//         animatedRotation.setValue(normalizedHeading);
//         lastRotationRef.current = normalizedHeading;
//       }
//     });

//     console.log('🔄 Rotating bike marker:', {
//       from: currentRotation.toFixed(1),
//       to: normalizedHeading.toFixed(1),
//       diff: rotationDiff.toFixed(1),
//     });
//   }, [animatedRotation]);

//   const onUpdateCutomerLocation = async (order) => {
//     try {
//       const res = await getCustomerWiseRiderLocation(order);
//       console.log("res?.rider?.current_location--", res?.rider);

//       const currentLoc = res?.rider?.current_location;

//       // Priority 1: Route-based heading (ALWAYS use when route is available - most accurate for following route)
//       let actualHeading = null;
//       if (coords && coords.length > 1 && currentLoc?.lat && currentLoc?.lng) {
//         const routeHeading = calculateHeadingFromRoute(
//           currentLoc.lat,
//           currentLoc.lng,
//           coords
//         );
//         if (routeHeading !== null && !isNaN(routeHeading) && routeHeading >= 0) {
//           // ALWAYS use route-based heading when route is available (even if GPS heading exists)
//           actualHeading = routeHeading;
//           updateHeading = routeHeading;
//           setHeading(routeHeading);
//           animateRotation(routeHeading);
//           console.log('🛣️ Route-based heading (PRIORITY):', routeHeading.toFixed(1) + '°');
//         }
//       }

//       // Priority 2: API heading (rider_moment from GPS) - only if route-based heading not available
//       if (!actualHeading || actualHeading === 0) {
//         actualHeading = res?.rider?.rider_moment ?? updateHeading;
//         if (actualHeading && !isNaN(actualHeading) && actualHeading > 0) {
//           updateHeading = actualHeading;
//           setHeading(actualHeading);
//           animateRotation(actualHeading);
//           console.log('📡 API heading (GPS):', actualHeading.toFixed(1) + '°');
//         }
//       }

//       // Priority 3: Movement-based heading (calculated from previous position)
//       if (!actualHeading || isNaN(actualHeading) || actualHeading === 0) {
//         const prevPos = prevLocationRef.current;
//         if (prevPos) {
//           const calculatedHeading = calculateHeadingFromMovement(
//             prevPos.lat,
//             prevPos.lng,
//             currentLoc?.lat,
//             currentLoc?.lng,
//           );
//           if (calculatedHeading !== null) {
//             actualHeading = calculatedHeading;
//             updateHeading = calculatedHeading;
//             setHeading(calculatedHeading);
//             animateRotation(calculatedHeading);
//             console.log('📐 Calculated heading from movement:', calculatedHeading.toFixed(1) + '°');
//           }
//         }
//       }

//       // Fallback: Keep previous heading if nothing else works
//       if (!actualHeading || isNaN(actualHeading) || actualHeading === 0) {
//         if (updateHeading && updateHeading > 0) {
//           actualHeading = updateHeading;
//           console.log('⚠️ Using previous heading:', updateHeading.toFixed(1) + '°');
//         } else {
//           updateHeading = 0;
//           setHeading(0);
//         }
//       }

//       // ✅ Corrected: Object.keys (not Object.key)
//       if (currentLoc && Object?.keys(currentLoc)?.length > 0) {
//         currentLiveRiderLocation = currentLoc
//         console.log("✅ Rider current location:", currentLoc);
//         if (
//           !prevLocationRef.current ||
//           prevLocationRef.current?.lat !== currentLoc?.lat ||
//           prevLocationRef.current?.lng !== currentLoc?.lng
//         ) {

//           const distance = getDistanceInMeters(
//             prevLocationRef?.current?.lat,
//             prevLocationRef?.current?.lng,
//             currentLoc?.lat,
//             currentLoc?.lng
//           );

//           console.log("distance--customer", distance, updateTimerValue, distance >= updateTimerValue);
//           // Only update if moved more than 50 meters
//           if (distance >= updateTimerValue ?? 50) {
//             animate(currentLoc?.lat, currentLoc?.lng, currentLoc, destination);
//             // Save the new location for next comparison
//             prevLocationRef.current = { lat: currentLoc?.lat, lng: currentLoc?.lng };
//           } else {
//             console.log("Your are not cover the 50 meter distance", distance);
//           }
//         } else {
//           console.log("Same location — skipping update", currentLoc, prevLocationRef.current);
//         }
//       } else {
//         console.log("⚠️ No current location found.");
//       }
//     } catch (error) {
//       console.log("❌ Error updating customer location:", error);
//     }
//   };


//   useEffect(() => {
//     if (!isMountedRef.current) return;

//     socketServices.initailizeSocket();

//     const handleSocketData = (data) => {
//       if (!isMountedRef.current) return;
//       console.log('Remaining distance data--:', data, data?.location);

//       const newLocation = data?.location;
//       if (!newLocation?.lat || !newLocation?.lng) return;

//       // Priority 1: Route-based heading (ALWAYS use when route is available - most accurate for following route)
//       let actualHeading = null;
//       if (coords && coords.length > 1 && newLocation?.lat && newLocation?.lng) {
//         const routeHeading = calculateHeadingFromRoute(
//           newLocation.lat,
//           newLocation.lng,
//           coords
//         );
//         if (routeHeading !== null && !isNaN(routeHeading) && routeHeading >= 0) {
//           // ALWAYS use route-based heading when route is available (even if GPS heading exists)
//           actualHeading = routeHeading;
//           updateHeading = routeHeading;
//           setHeading(routeHeading);
//           animateRotation(routeHeading);
//           console.log('🛣️ Route-based heading (socket PRIORITY):', routeHeading.toFixed(1) + '°');
//         }
//       }

//       // Priority 2: API heading (rider_moment from GPS) - only if route-based heading not available
//       if (!actualHeading || actualHeading === 0) {
//         actualHeading = data?.rider_moment ?? updateHeading;
//         if (actualHeading && !isNaN(actualHeading) && actualHeading > 0) {
//           updateHeading = actualHeading;
//           setHeading(actualHeading);
//           animateRotation(actualHeading);
//           console.log('📡 API heading (GPS socket):', actualHeading.toFixed(1) + '°');
//         }
//       }

//       // Priority 3: Movement-based heading (calculated from previous position)
//       if (!actualHeading || isNaN(actualHeading) || actualHeading === 0) {
//         const prevPos = prevLocationRef.current;
//         if (prevPos) {
//           const calculatedHeading = calculateHeadingFromMovement(
//             prevPos.lat,
//             prevPos.lng,
//             newLocation?.lat,
//             newLocation?.lng,
//           );
//           if (calculatedHeading !== null) {
//             actualHeading = calculatedHeading;
//             updateHeading = calculatedHeading;
//             setHeading(calculatedHeading);
//             animateRotation(calculatedHeading);
//             console.log('📐 Calculated heading from movement (socket):', calculatedHeading.toFixed(1) + '°');
//           }
//         }
//       }

//       // Fallback: Keep previous heading if nothing else works
//       if (!actualHeading || isNaN(actualHeading) || actualHeading === 0) {
//         if (updateHeading && updateHeading > 0) {
//           actualHeading = updateHeading;
//           console.log('⚠️ Using previous heading (socket):', updateHeading.toFixed(1) + '°');
//         } else {
//           updateHeading = data?.rider_moment ?? 0;
//           setHeading(data?.rider_moment ?? 0);
//         }
//       }

//       // If no previous location, set it immediately
//       if (!prevLocationRef.current) {
//         prevLocationRef.current = newLocation;
//         currentLiveRiderLocation = newLocation;
//         animate(newLocation?.lat, newLocation?.lng, newLocation, destination);
//         return;
//       }

//       // Calculate distance between previous and current locations
//       const distance = getDistanceInMeters(
//         prevLocationRef?.current?.lat,
//         prevLocationRef?.current?.lng,
//         newLocation?.lat,
//         newLocation?.lng
//       );

//       console.log('Distance moved:', distance, 'meters');

//       // Only update if moved more than 50 meters
//       if (distance >= updateTimerValue ?? 50) {
//         prevLocationRef.current = newLocation;
//         currentLiveRiderLocation = newLocation;
//         animate(newLocation.lat, newLocation.lng, newLocation, destination);
//       } else {
//         console.log("Your are not cover the 50 meter distance socket", distance);
//       }
//     };

//     socketServices.on('getremainingdistance', handleSocketData);

//     return () => {
//       if (isMountedRef.current) {
//         socketServices.removeListener('getremainingdistance', handleSocketData);
//       }
//     };
//   }, [coords, destination, calculateHeadingFromRoute, calculateHeadingFromMovement, animateRotation]);

//   const animate = (latitude, longitude, newLocation, currentDestination) => {
//     const newCoordinate = { latitude, longitude };

//     console.log("Animating to:", newCoordinate);

//     // Update currentLiveRiderLocation immediately so heading calculations use latest position
//     currentLiveRiderLocation = newLocation;

//     // Fetch new route (if needed)
//     fetchRoute(newLocation, currentDestination);

//     // Clear any existing heading update interval during animation
//     if (animationHeadingUpdateIntervalRef.current) {
//       clearInterval(animationHeadingUpdateIntervalRef.current);
//       animationHeadingUpdateIntervalRef.current = null;
//     }

//     // Update heading immediately at start of animation - ALWAYS use route-based heading
//     if (coords && coords.length > 1 && newLocation?.lat && newLocation?.lng) {
//       const routeHeading = calculateHeadingFromRoute(
//         newLocation.lat,
//         newLocation.lng,
//         coords
//       );
//       if (routeHeading !== null && !isNaN(routeHeading) && routeHeading >= 0) {
//         updateHeading = routeHeading;
//         setHeading(routeHeading);
//         animateRotation(routeHeading);
//         console.log('🛣️ Route-based heading (animate start):', routeHeading.toFixed(1) + '°');
//       }
//     }

//     const animationDuration = Platform.OS === 'android' ? 7000 : 200;

//     // Set up interval to update heading during animation (every 500ms)
//     animationHeadingUpdateIntervalRef.current = setInterval(() => {
//       if (!isMountedRef.current) {
//         if (animationHeadingUpdateIntervalRef.current) {
//           clearInterval(animationHeadingUpdateIntervalRef.current);
//           animationHeadingUpdateIntervalRef.current = null;
//         }
//         return;
//       }

//       // Get current animated position (approximate based on animation progress)
//       const currentPos = currentLiveRiderLocation || newLocation;
//       if (currentPos?.lat && currentPos?.lng && coords && coords.length > 1) {
//         const routeHeading = calculateHeadingFromRoute(
//           currentPos.lat,
//           currentPos.lng,
//           coords
//         );
//         if (routeHeading !== null && !isNaN(routeHeading)) {
//           // Only update if change is significant
//           const currentHeading = updateHeading || lastRotationRef.current;
//           let headingDiff = Math.abs(routeHeading - currentHeading);
//           if (headingDiff > 180) {
//             headingDiff = 360 - headingDiff;
//           }

//           if (headingDiff >= MIN_ROTATION_THRESHOLD || currentHeading === 0) {
//             updateHeading = routeHeading;
//             setHeading(routeHeading);
//             animateRotation(routeHeading);
//           }
//         }
//       }
//     }, 500); // Update heading every 500ms during animation

//     if (Platform.OS === 'android') {
//       animatedCoordinate.timing({
//         latitude: Number(newCoordinate?.latitude),
//         longitude: Number(newCoordinate?.longitude),
//         duration: animationDuration,
//         useNativeDriver: false,
//       }).start((finished) => {
//         // Clear interval when animation completes
//         if (animationHeadingUpdateIntervalRef.current) {
//           clearInterval(animationHeadingUpdateIntervalRef.current);
//           animationHeadingUpdateIntervalRef.current = null;
//         }

//         // Final heading update when animation completes
//         if (finished && isMountedRef.current && newLocation?.lat && newLocation?.lng) {
//           if (coords && coords.length > 1) {
//             const routeHeading = calculateHeadingFromRoute(
//               newLocation.lat,
//               newLocation.lng,
//               coords
//             );
//             if (routeHeading !== null && !isNaN(routeHeading)) {
//               updateHeading = routeHeading;
//               setHeading(routeHeading);
//               animateRotation(routeHeading);
//               console.log('🛣️ Route-based heading (animate end):', routeHeading.toFixed(1) + '°');
//             }
//           }
//         }
//       });

//     } else {
//       // For iOS, AnimatedRegion works better when using Animated.Value updates
//       animatedCoordinate.timing({
//         latitude: Number(newCoordinate?.latitude),
//         longitude: Number(newCoordinate?.longitude),
//         duration: animationDuration,
//         easing: Easing.linear,
//         useNativeDriver: false,
//       }).start((finished) => {
//         // Clear interval when animation completes
//         if (animationHeadingUpdateIntervalRef.current) {
//           clearInterval(animationHeadingUpdateIntervalRef.current);
//           animationHeadingUpdateIntervalRef.current = null;
//         }

//         // Final heading update when animation completes
//         if (finished && isMountedRef.current && newLocation?.lat && newLocation?.lng) {
//           if (coords && coords.length > 1) {
//             const routeHeading = calculateHeadingFromRoute(
//               newLocation.lat,
//               newLocation.lng,
//               coords
//             );
//             if (routeHeading !== null && !isNaN(routeHeading)) {
//               updateHeading = routeHeading;
//               setHeading(routeHeading);
//               animateRotation(routeHeading);
//               console.log('🛣️ Route-based heading (animate end):', routeHeading.toFixed(1) + '°');
//             }
//           }
//         }
//       });

//     }

//   };

//   // Initialize markers and camera when data is available
//   useEffect(() => {
//     if (!origin || !destination) return;

//     const lat = Number(origin?.lat);
//     const lng = Number(origin?.lng);
//     const destLat = Number(destination?.lat);
//     const destLng = Number(destination?.lng);

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

//     fetchRoute(origin, destination);

//   }, [origin, destination]);

//   // Fit map to coordinates when route is loaded (only once)
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


//   useEffect(() => {
//     if ((coords?.length > 1 && mapRef?.current && !hasAnimatedOnce?.current)) {
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

//   useEffect(() => {
//     if (currentLiveRiderLocation && destination && mapRef?.current && coords) {
//       const bearing = getBearing(currentLiveRiderLocation ?? origin, destination);
//       // const lastCoord = coords[(coords?.length) / 2 - 1];
//       const lastCoord = coords[0];
//       mapRef?.current?.animateCamera(
//         {
//           center: lastCoord,
//           // { latitude: currentLiveRiderLocation?.lat ?? origin?.lat, longitude: currentLiveRiderLocation?.lng ?? origin?.lng },
//           heading: bearing, // rotate toward destination
//           pitch: 0,
//           zoom: 17, // keep zoom fixed
//           edgePadding: {
//             top: 50,
//             right: 50,
//             bottom: 50,
//             left: 50
//           },
//           animated: true,
//         },
//         { duration: 500 }
//       );
//     }
//   }, [currentLiveRiderLocation, coords]);


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


//   const fetchRoute = async (sender, receiver) => {
//     try {
//       const response = await fetch(
//         `https://maps.googleapis.com/maps/api/directions/json?origin=${Number(currentLiveRiderLocation?.lat ?? sender?.lat)},${Number(currentLiveRiderLocation?.lng ?? sender?.lng)}&destination=${Number(receiver?.lat)},${Number(receiver?.lng)}&alternatives=true&key=${MAP_KEY}`
//       );

//       const json = await response?.json();

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

//         // console.log(`🚗 Shortest route: ${distanceInKm} km, ⏱️ ${eta}`);

//         // ✅ Update state or send callback
//         if ((distanceInKm <= 0.20 && !showPickDesPopUpModal && riderCustomerDetails?.status == 'picked')) {
//           showPickDesPopUpModal = true;
//           setShowPickDesPopUp(true);
//         }
//         setCoords(routeCoords);
//         onUpdateRiderMoveValue(distanceInKm)
//         onKmsTime?.(distanceInKm, eta);


//       } else {
//         console.log('⚠️ No routes found.');
//       }
//     } catch (error) {
//       console.log('❌ Error fetching route:', error);
//     }
//   };



//   const handleMapReady = () => {
//     setTimeout(() => {
//       setIsMapReady(true);
//     }, 1000);
//   };

//   // Update heading based on route when route or location changes (throttled to prevent constant updates)
//   useEffect(() => {
//     if (!coords || coords.length < 2 || !isMountedRef.current) return;

//     // Clear any pending heading update
//     if (headingUpdateTimeoutRef.current) {
//       clearTimeout(headingUpdateTimeoutRef.current);
//     }

//     // Throttle heading updates to prevent constant rotation
//     headingUpdateTimeoutRef.current = setTimeout(() => {
//       if (!isMountedRef.current) return;

//       const currentLoc = currentLiveRiderLocation || origin;
//       if (!currentLoc?.lat || !currentLoc?.lng) return;

//       // Calculate route-based heading
//       const routeHeading = calculateHeadingFromRoute(
//         currentLoc.lat,
//         currentLoc.lng,
//         coords
//       );

//       if (routeHeading !== null && !isNaN(routeHeading) && routeHeading > 0) {
//         // Only update if heading changed significantly
//         const currentHeading = updateHeading || lastRotationRef.current;
//         let headingDiff = Math.abs(routeHeading - currentHeading);
//         if (headingDiff > 180) {
//           headingDiff = 360 - headingDiff;
//         }

//         // Only update if change is significant (more than threshold)
//         if (headingDiff >= MIN_ROTATION_THRESHOLD || currentHeading === 0) {
//           updateHeading = routeHeading;
//           setHeading(routeHeading);
//           animateRotation(routeHeading);
//           console.log('🛣️ Route-based heading updated:', routeHeading.toFixed(1) + '°');
//         }
//       }
//     }, 300); // Throttle to 300ms

//     return () => {
//       if (headingUpdateTimeoutRef.current) {
//         clearTimeout(headingUpdateTimeoutRef.current);
//       }
//     };
//   }, [coords, origin, calculateHeadingFromRoute, animateRotation]);

//   // if(update){

//   return (
//     <View
//       pointerEvents={isPendingReq ? 'none' : 'auto'}
//       style={styles.homeSubContainer}
//     >
//       {/* {(origin && destination) ? */}
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
//           centerOffset={{ x: 0, y: -10 }} // Adjust Y offset to position properly
//           anchor={{ x: 0.5, y: 0.5 }}
//           rotation={updateHeading ?? heading}
//         >
//           <Image
//             resizeMode='contain'
//             // resizeMode="cover"
//             source={appImages.moveBike
//               // markerRideImage
//             }
//             // style={styles.markerBikeImage}
//             style={[styles.markerBikeImage,
//             { transform: [{ rotate: `${70}deg` }] }
//             ]}
//           />
//         </Marker.Animated>

//         {/* Destination Marker */}
//         <Marker.Animated
//           ref={markerDesRef}
//           coordinate={animatedDesCoordinate}
//           tracksViewChanges={!isMapReady}
//           centerOffset={{ x: 0, y: -10 }} // Adjust Y offset to position properly
//           anchor={{ x: 0.5, y: 0.5 }}
//         >
//           <Image
//             resizeMode="contain"
//             source={appImages.markerImage}
//             style={styles.markerImage}
//           />
//         </Marker.Animated>

//         {/* Route Polyline */}
//         {/* {(Object.keys(currentLiveRiderLocation ?? origin)?.length > 0 &&
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
//         {coords?.length > 0 && (
//           <Polyline
//             coordinates={coords}
//             strokeWidth={4}
//             strokeColor={colors.main}
//           />
//         )}
//       </MapView>
//       {/* :
//         <View style={[styles.mapContainer, mapContainerView]}>
//         </View>}  */}
//       <PopUpInProgess
//         topIcon={false}
//         CTATitle={'ok'}
//         visible={showPickDesPopUp}
//         type={'Error'}
//         onClose={() => { setShowPickDesPopUp(false), showPickDesPopUpModal = true }}
//         title={riderCustomerDetails?.status == 'picked' ? "Dropped Location" : "Pickup Location"}
//         text={
//           riderCustomerDetails?.status == 'picked' ? "Rider has reached and completed the ride at the destination" : "Rider has arrived at the pickup location"
//         }
//       />
//     </View>
//   );
//   // }else{
//   //   return null
//   // }
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
//     height: 60,  //30,
//     width: 60,   //30,
//     marginTop: Platform.OS === 'ios' ? '25%' : 0,
//   },
// });












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