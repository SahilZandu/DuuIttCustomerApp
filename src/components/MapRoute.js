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
import { DuuittMapTheme } from './DuuittMapTheme';
import MapViewDirections from 'react-native-maps-directions';
import socketServices from '../socketIo/SocketServices';
import { rootStore } from '../stores/rootStore';
import { MAP_KEY } from '../halpers/AppLink';

const MapRoute = ({ mapContainerView, origin, destination, isPendingReq, orderData }) => {
  const { ordersDirectionGooglemapHit,
    setRootPolygonRide, rootPolygonRide, setRootPolygonParcel,
    rootPolygonParcel, setOrderRideParcelLatLng, orderRideParcelLatLng } = rootStore.orderStore;
  const mapRef = useRef(null);
  const hasAnimatedOnce = useRef(false);
  const hasAnimatedCameraRef = useRef(false)
  const markerRef = useRef(null);
  const markerDesRef = useRef(null);
  const bearingRef = useRef(0);
  const originRef = useRef(null);
  const destinationRef = useRef(null);
  const hasDirectionApiCalling = useRef(null)
  const [coords, setCoords] = useState(
    orderData?.order_type === 'ride' ? rootPolygonRide
      : orderData?.order_type === 'parcel' ? rootPolygonParcel :
        []);
  const [isMapReady, setIsMapReady] = useState(false);
  const isMountedRef = useRef(true);
  const fetchAbortControllerRef = useRef(null);
  const mapReadyTimeoutRef = useRef(null);
  const [orderDetails, setOrderDetails] = useState({})

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


  const onDataRefresh = async () => {
    const { rootPolygonRide, rootPolygonParcel, orderRideParcelLatLng } = rootStore.orderStore;
    if (orderData?.order_type === 'ride') {
      setCoords(rootPolygonRide ?? [])
    } else if (orderData?.order_type === 'parcel') {
      setCoords(rootPolygonParcel ?? []);
    } else {
      setCoords([]);
    }
    if ((orderRideParcelLatLng?.origin && orderRideParcelLatLng?.destination)) {
      originRef.current = orderRideParcelLatLng?.origin
      destinationRef.current = orderRideParcelLatLng?.destination
    }
  }



  useFocusEffect(
    useCallback(() => {
      isMountedRef.current = true;
      setMapManageRideDaltaInitials();
      onDataRefresh();
      if ((origin && destination)) {
        animate(origin?.lat, origin?.lng, origin, destination)
      }
      return () => {
        isMountedRef.current = false;
        // Cancel any ongoing fetch requests
        if (fetchAbortControllerRef.current) {
          fetchAbortControllerRef.current.abort();
          fetchAbortControllerRef.current = null;
        }
        // Clear timeout
        if (mapReadyTimeoutRef.current) {
          clearTimeout(mapReadyTimeoutRef.current);
          mapReadyTimeoutRef.current = null;
        }
      };
    }, [origin, destination, rootPolygonRide, rootPolygonParcel, orderRideParcelLatLng])
  );


  const animate = (latitude, longitude, newLocation, currentDestination) => {
    if (!isMountedRef.current) return;

    const newCoordinate = { latitude, longitude };

    console.log("Animating to:", newCoordinate);

    const originChanged =
      originRef.current?.lat !== newLocation?.lat ||
      originRef?.current?.lng !== newLocation?.lng;

    const destinationChanged =
      destinationRef?.current?.lat !== currentDestination?.lat ||
      destinationRef?.current?.lng !== currentDestination?.lng;

    // console.log("check data--", originChanged, destinationChanged, originRef.current,
    //   destinationRef?.current, newLocation, currentDestination, orderRideParcelLatLng,
    //   rootPolygonRide, rootPolygonParcel);


    // If origin or destination changed → fetch route again
    if ((originChanged || destinationChanged)) {
      // console.log("11111111 - Fetching new route");
      setCoords([]);
      fetchRoute(newLocation, currentDestination);
      setOrderRideParcelLatLng({
        origin: newLocation,
        destination: currentDestination
      })
      originRef.current = newLocation;
      destinationRef.current = currentDestination;
    } else {
      // Otherwise use existing polygons
      if (orderData?.order_type === "ride") {
        // console.log("2222222 - Using ride polygon");
        setCoords(rootPolygonRide ?? []);
      } else if (orderData?.order_type === "parcel") {
        // console.log("333333333 - Using parcel polygon");
        setCoords(rootPolygonParcel ?? []);
      } else {
        // console.log("4444444444 - Fetching as fallback");
        setCoords([]);
        fetchRoute(newLocation, currentDestination);
      }
    }


    // Fetch new route (if needed)
    // fetchRoute(newLocation, currentDestination);
    // Use AnimatedRegion for both platforms to keep a single code path
    if (isMountedRef.current) {
      animatedCoordinate.timing({
        latitude: Number(newCoordinate?.latitude),
        longitude: Number(newCoordinate?.longitude),
        duration: 7000,
        useNativeDriver: false,
      }).start();
    }
  };




  // Initialize markers and camera when data is available
  useEffect(() => {
    if (!origin || !destination || !isMountedRef.current) return;

    const lat = Number(origin?.lat);
    const lng = Number(origin?.lng);
    const destLat = Number(destination?.lat);
    const destLng = Number(destination?.lng);

    // if (isNaN(lat) || isNaN(lng) || isNaN(destLat) || isNaN(destLng)) return;

    // Initialize current position
    currentPositionRef.current = { latitude: lat, longitude: lng };

    // Set initial marker positions
    if (isMountedRef.current) {
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

      // fetchRoute(origin, destination);
    }

    return () => {
      // Cancel any ongoing operations when dependencies change
      if (fetchAbortControllerRef.current) {
        fetchAbortControllerRef.current.abort();
        fetchAbortControllerRef.current = null;
      }
    };
  }, [origin, destination]);

  // Fit map to coordinates when route is loaded (only once)
  useEffect(() => {
    if (coords?.length > 1 && mapRef?.current && isMountedRef.current) {
      try {
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
      } catch (error) {
        console.log('Error fitting map to coordinates:', error);
      }
    }
  }, [coords, isMapReady]);

  // Fetch the route from Google Directions API
  const fetchRoute = async (origin, destination) => {
    // Cancel previous request if still in progress
    if (fetchAbortControllerRef.current) {
      fetchAbortControllerRef.current.abort();
    }

    if (hasDirectionApiCalling?.current) {
      clearTimeout(hasDirectionApiCalling.current);
    }
    hasDirectionApiCalling.current = setTimeout(async () => {
      // Create new AbortController for this request
      fetchAbortControllerRef.current = new AbortController();
      // if (coords?.length == 0) {
      // alert("yes")
      try {
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/directions/json?origin=${Number(origin?.lat)},${Number(origin?.lng)}&destination=${Number(destination?.lat)},${Number(destination?.lng)}&alternatives=true&key=${MAP_KEY}`,
          { signal: fetchAbortControllerRef.current.signal }
        );

        const json = await response?.json();
        ordersDirectionGooglemapHit(orderData, 'Route Directions')

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
          // ✅ Update state only if component is still mounted
          // if (isMountedRef?.current) {
          setCoords(routeCoords);
          if (orderData?.order_type == "ride") {
            setRootPolygonRide(routeCoords)
          } else {
            setRootPolygonParcel(routeCoords)
          }
          console.log(`✅ Shortest route selected — ${(minDistance / 1000).toFixed(2)} km`);
        }
        // } else {
        //   console.log('⚠️ No routes found.');
        // }
      } catch (error) {
        if (error.name === 'AbortError') {
          console.log('Route fetch cancelled');
        } else if (isMountedRef.current) {
          console.log('❌ Error fetching route:', error);
        }
      } finally {
        fetchAbortControllerRef.current = null;
      }
      // }
    }, 500); // 1000ms debounce delay


  }


  const handleMapReady = () => {
    // Clear any existing timeout
    if (mapReadyTimeoutRef.current) {
      clearTimeout(mapReadyTimeoutRef.current);
    }

    mapReadyTimeoutRef.current = setTimeout(() => {
      if (isMountedRef.current) {
        setIsMapReady(true);
      }
    }, 1000);
  };

  // Component unmount cleanup
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      // Cancel any ongoing fetch requests
      if (fetchAbortControllerRef.current) {
        fetchAbortControllerRef.current.abort();
        fetchAbortControllerRef.current = null;
      }
      // Clear timeout
      if (mapReadyTimeoutRef.current) {
        clearTimeout(mapReadyTimeoutRef.current);
        mapReadyTimeoutRef.current = null;
      }
    };
  }, []);

  return (
    <View
      pointerEvents={isPendingReq ? 'none' : 'auto'}
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
        // region={{
        //   latitude: Number(origin?.lat) || 30.7400,
        //   longitude: Number(origin?.lng) || 76.7900,
        //   latitudeDelta: 0.005,
        //   longitudeDelta: 0.005
        // }}
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
          if (isMountedRef.current && region) {
            try {
              setMapManageRideDalta(region);
              setMpaDalta(region);
            } catch (error) {
              console.log('Error updating map region:', error);
            }
          }
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










