import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, View, Image, Platform } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { appImages } from '../commons/AppImages';
import MapView, { Marker, AnimatedRegion, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import PolylineDecoder from '@mapbox/polyline';
import { colors } from '../theme/colors';
import { getMapManageRideDalta, setMapManageRideDalta, setMapManageRideDaltaInitials } from './GeoCodeAddress';
import { useFocusEffect } from '@react-navigation/native';
import { getDistance } from 'geolib';

const API_KEY = 'AIzaSyAGYLXByGkajbYglfVPK4k7VJFOFsyS9EA';

// Constants outside component to prevent recreation
const DEFAULT_REGION = {
  latitude: 30.7400,
  longitude: 76.7900,
  latitudeDelta: 0.0322,
  longitudeDelta: 0.0321,
};

const MOHALI_CHD_BOUNDS = {
  north: 30.8258,
  south: 30.6600,
  west: 76.6600,
  east: 76.8500,
};

const MapRoute = React.memo(({ mapContainerView, origin, destination, isPendingReq }) => {
  const mapRef = useRef(null);
  const bearingRef = useRef(0);
  const debounceTimeout = useRef(null);
  const markerRef = useRef(null);
  const markerDesRef = useRef(null);
  const hasAnimatedOnce = useRef(false);
  const timeoutRef = useRef(null);

  const [destinationLocation, setDestinationLocation] = useState({ lat: null, lng: null });
  const [coords, setCoords] = useState([]);
  const [isMapReady, setIsMapReady] = useState(false);

  // Memoized map region to prevent unnecessary re-renders
  const mapRegion = useMemo(() => {
    if (origin?.lat && origin?.lng) {
      const distance = getDistance(
        { latitude: Number(origin.lat), longitude: Number(origin.lng) },
        { latitude: Number(destination?.lat || 0), longitude: Number(destination?.lng || 0) }
      );
      return {
        latitude: Number(origin.lat),
        longitude: Number(origin.lng),
        ...getMapManageRideDalta(distance),
      };
    }
    return DEFAULT_REGION;
  }, [origin?.lat, origin?.lng, destination?.lat, destination?.lng]);

  // Memoized animated coordinates to prevent recreation
  const animatedCoordinate = useMemo(() => {
    if (origin?.lat && origin?.lng) {
      const distance = getDistance(
        { latitude: Number(origin.lat), longitude: Number(origin.lng) },
        { latitude: Number(destination?.lat || 0), longitude: Number(destination?.lng || 0) }
      );
      return new AnimatedRegion({
        latitude: Number(origin.lat),
        longitude: Number(origin.lng),
        ...getMapManageRideDalta(distance),
      });
    }
    return null;
  }, [origin?.lat, origin?.lng, destination?.lat, destination?.lng]);

  const animatedDesCoordinate = useMemo(() => {
    if (destination?.lat && destination?.lng) {
      const distance = getDistance(
        { latitude: Number(origin?.lat || 0), longitude: Number(origin?.lng || 0) },
        { latitude: Number(destination.lat), longitude: Number(destination.lng) }
      );
      return new AnimatedRegion({
        latitude: Number(destination.lat),
        longitude: Number(destination.lng),
        ...getMapManageRideDalta(distance),
      });
    }
    return null;
  }, [origin?.lat, origin?.lng, destination?.lat, destination?.lng]);

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
      if (!isWithinBounds(region.latitude, region.longitude)) {
        mapRef.current?.animateToRegion({
          latitude: 30.7400,
          longitude: 76.7900,
          ...getMapManageRideDalta(1000),
        });
      }
    }, 100);
  }, [isWithinBounds]);

  // Single optimized useEffect for origin changes
  useEffect(() => {
    if (origin?.lat && origin?.lng && mapRef?.current && !hasAnimatedOnce.current) {
      const newRegion = {
        latitude: Number(origin.lat),
        longitude: Number(origin.lng),
        ...getMapManageRideDalta(
          getDistance(
            { latitude: Number(origin.lat), longitude: Number(origin.lng) },
            { latitude: Number(destination?.lat || 0), longitude: Number(destination?.lng || 0) }
          )
        ),
      };

      mapRef.current.animateToRegion(newRegion, 1000);
      hasAnimatedOnce.current = true;
    }
  }, [origin?.lat, origin?.lng, destination?.lat, destination?.lng]);

  // Optimized route fitting
  useEffect(() => {
    if (coords?.length > 1 && mapRef?.current && !hasAnimatedOnce.current) {
      const edgePadding = { top: 30, right: 20, bottom: 10, left: 20 };

      mapRef.current.fitToCoordinates(coords, { edgePadding, animated: true });
      hasAnimatedOnce.current = true;
    }
  }, [coords]);

  // Optimized map ready handler
  const handleMapReady = useCallback(() => {
        setIsMapReady(true);
  }, []);

  // Memoized bearing calculation
  const getBearing = useCallback((start, end) => {
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
  }, []);

  // Optimized camera animation
  useEffect(() => {
    if (!origin || !destination || !mapRef?.current) return;

    const lat = Number(origin.lat);
    const lng = Number(origin.lng);
    const destLat = Number(destination.lat);
    const destLng = Number(destination.lng);

    if (isNaN(lat) || isNaN(lng) || isNaN(destLat) || isNaN(destLng)) return;

    // Animate markers
    if (animatedCoordinate) {
    animatedCoordinate.timing({
        latitude: lat,
        longitude: lng,
      duration: 500,
      useNativeDriver: false,
    }).start();
    }

    if (animatedDesCoordinate) {
    animatedDesCoordinate.timing({
        latitude: destLat,
        longitude: destLng,
      duration: 500,
      useNativeDriver: false,
    }).start();
    }

    // Animate map region
    setTimeout(() => {
      mapRef.current?.animateToRegion({
        latitude: lat,
        longitude: lng,
        ...getMapManageRideDalta(
          getDistance(
            { latitude: lat, longitude: lng },
            { latitude: destLat, longitude: destLng }
          )
        ),
      }, 500);
    }, Platform.OS === 'ios' ? 100 : 0);

    // Animate camera with bearing
    timeoutRef.current = setTimeout(() => {
      const bearing = getBearing({ lat, lng }, { lat: destLat, lng: destLng });
      const camera = {
        center: { latitude: lat, longitude: lng },
        heading: bearingRef.current || bearing,
        pitch: 30,
        zoom: 17,
        altitude: 300,
      };
      mapRef.current?.animateCamera(camera, { duration: 1000 });
    }, 2000);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [origin, destination, animatedCoordinate, animatedDesCoordinate, getBearing]);

  // Fetch route when both locations are available
  useEffect(() => {
    if (origin?.lat && origin?.lng && destination?.lat && destination?.lng) {
      setDestinationLocation(destination);
      fetchRoute(origin, destination);
    }
  }, [origin?.lat, origin?.lng, destination?.lat, destination?.lng]);

  // Memoized route fetching function
  const fetchRoute = useCallback(async (origin, destination) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/directions/json?origin=${origin.lat},${origin.lng}&destination=${destination.lat},${destination.lng}&key=${API_KEY}`
      );
      const json = await response.json();

      if (json.routes?.length) {
        const points = PolylineDecoder.decode(json.routes[0].overview_polyline.points);
        const routeCoords = points.map(point => ({
          latitude: point[0],
          longitude: point[1],
        }));
        setCoords(routeCoords);
      }
    } catch (error) {
      console.log('Error fetching route:', error);
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Memoized map props to prevent unnecessary re-renders
  const mapProps = useMemo(() => ({
    provider: PROVIDER_GOOGLE,
    ref: mapRef,
    style: [styles.mapContainer, mapContainerView],
    zoomEnabled: true,
    scrollEnabled: true,
    showsScale: true,
    mapType: Platform.OS === 'ios' ? 'mutedStandard' : 'standard', // Changed from 'terrain' for better performance
    region: mapRegion,
    zoomTapEnabled: true,
    rotateEnabled: true,
    loadingEnabled: true,
    showsCompass: false,
    cacheEnabled: false,
    followsUserLocation: false,
    showsUserLocation: false,
    onMapReady: handleMapReady,
    onRegionChange: setMapManageRideDalta,
    onRegionChangeComplete: handleRegionChangeComplete,
    // Performance optimizations
    showsBuildings: false,
    showsTraffic: false,
    showsIndoors: false,
    showsMyLocationButton: false,
    toolbarEnabled: false,
  }), [mapRegion, mapContainerView, handleMapReady, handleRegionChangeComplete]);

  // Memoized markers
  const originMarker = useMemo(() => (
    animatedCoordinate?.latitude && animatedCoordinate?.longitude && (
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
    )
  ), [animatedCoordinate, isMapReady]);

  const destinationMarker = useMemo(() => (
    animatedDesCoordinate?.latitude && animatedDesCoordinate?.longitude && (
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
    )
  ), [animatedDesCoordinate, isMapReady]);

  // Memoized polyline
  const routePolyline = useMemo(() => (
    coords?.length > 0 && (
            <Polyline
              coordinates={coords}
              strokeWidth={4}
              strokeColor={colors.main}
            />
    )
  ), [coords]);

  // Only render map when coordinates are valid
  if (!mapRegion?.latitude || !mapRegion?.longitude) {
    return (
      <View style={styles.homeSubContainer}>
        <View style={[styles.mapContainer, mapContainerView]} />
      </View>
    );
  }

  return (
    <View
      pointerEvents={isPendingReq ? 'none' : 'auto'}
      style={styles.homeSubContainer}
    >
      <MapView {...mapProps}>
        {originMarker}
        {destinationMarker}
        {routePolyline}
      </MapView>
    </View>
  );
});

MapRoute.displayName = 'MapRoute';

export default MapRoute;

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
  markerBikeImage: {
    height: 30,
    width: 30,
    marginTop: Platform.OS === 'ios' ? '25%' : 0,
  },
});
