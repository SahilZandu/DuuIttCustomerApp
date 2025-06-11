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
    latitude: origin?.lat || getCurrentLocation()?.latitude || 30.7400,
    longitude: origin?.lng || getCurrentLocation()?.longitude || 76.7900,
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
      //     latitudeDelta: getMpaDalta().latitudeDelta,
      //     longitudeDelta: getMpaDalta().longitudeDelta,
    })
  );



  // Update region when origin changes
  // useEffect(() => {
  //   if (origin?.lat && origin?.lng) {
  //     // currentLocation = origin;
  //     currentLocation = {
  //       lat: getLocation('lat') ?? origin?.lat ?? currentLocation?.lat,
  //       lng: getLocation('lng') ?? origin?.lng ?? currentLocation?.lng,
  //     }
  //     setMapRegion(prev => ({
  //       ...prev,
  //       latitude: origin?.lat?.toString()?.length > 0
  //         ? Number(origin?.lat)
  //         : Number(currentLocation?.lat),
  //       longitude: origin?.lng?.toString()?.length > 0
  //         ? Number(origin?.lng)
  //         : Number(currentLocation?.lng),
  //       latitudeDelta: getMpaDalta().latitudeDelta ?? 0.0322,
  //       longitudeDelta: getMpaDalta().longitudeDelta ?? 0.0321,
  //     }));
  //     const lat = Number(origin?.lat);
  //     const lng = Number(origin?.lng);
  //     const newCoord = { latitude: lat, longitude: lng };
  //     animatedCoordinate.timing({
  //       ...newCoord,
  //       duration: 500,
  //       useNativeDriver: false,
  //     }).start();

  //     if (mapRef?.current) {
  //       mapRef?.current.animateToRegion({
  //         latitude: origin && origin?.lat?.toString()?.length > 0 ? Number(origin?.lat) : Number(currentLocation?.lat),
  //         longitude: origin && origin?.lng?.toString()?.length > 0 ? Number(origin?.lng) : Number(currentLocation?.lng),
  //         latitudeDelta: getMpaDalta().latitudeDelta ?? 0.0322,
  //         longitudeDelta: getMpaDalta().longitudeDelta ?? 0.0321,
  //       }, 2000); // smooth zoom
  //     }
  //   }
  // }, [origin, isMapReady]);
  useEffect(() => {
    if (origin?.lat && origin?.lng) {
      const newCoord = {
        latitude: Number(origin.lat),
        longitude: Number(origin.lng),
      };

      currentLocation = newCoord;

      setMapRegion({
        ...newCoord,
        ...getMpaDalta(),
      });

      animatedCoordinate.timing({
        ...newCoord,
        duration: 500,
        useNativeDriver: false,
      }).start();

      if (mapRef.current) {
        mapRef.current.animateToRegion(
          {
            ...newCoord,
            ...getMpaDalta(),
          },
          2000
        );
      }
    }
  }, [origin, isMapReady]);


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
      }, 2000);
    } else {
      setTimeout(() => {
        setIsMapReady(true);
      }, 5000);
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
          mapType={Platform.OS === 'ios' ? 'mutedStandard' : 'terrain'}
          region={mapRegion}
          // initialRegion={mapRegion}
          zoomTapEnabled
          rotateEnabled
          loadingEnabled
          onPress={e => onTouchLocationData(e.nativeEvent.coordinate)}
          onPoiClick={e => onTouchLocationData(e.nativeEvent.coordinate)}
          showsCompass={false}
          showsUserLocation={false}
          followsUserLocation={false}
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