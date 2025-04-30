import React, { useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, View, Image, Platform, Dimensions, Alert } from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { appImages } from '../commons/AppImages';
import MapView, {
  Marker,
  Callout,
  PROVIDER_GOOGLE,
  Polyline,
} from 'react-native-maps';
import { getMpaDalta, setMpaDalta } from './GeoCodeAddress';

const MapRouteMarker = ({ mapContainerView, origin, markerArray, searchingRideParcel }) => {
  // console.log('markerArray--', markerArray);
  const mapRef = useRef(null);
  const debounceTimeout = useRef(null);
  const [lat, setLat] = useState(Number(origin?.lat) ?? 30.7400);
  const [long, setLong] = useState(Number(origin?.lng) ?? 76.7900);

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


  const handleRegionChangeComplete = (region) => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(() => {
      if (!isWithinBounds(region.latitude, region.longitude)) {
        mapRef.current?.animateToRegion({
          latitude: Number(30.7400 ?? lat) ?? 30.7400,
          longitude: Number(76.7900 ?? long) ?? 76.7900,
          latitudeDelta: getMpaDalta().latitudeDelta,
          longitudeDelta: getMpaDalta().longitudeDelta,
        });
        Alert.alert("Restricted Area", "You can only explore within Mohali & Chandigarh.");
      }
    }, 50); // Delay in milliseconds


  };


  useEffect(() => {
    if (markerArray?.length > 0 ||
      Object?.keys(origin || {})?.length > 0
    ) {
      setLat(
        markerArray?.length > 0
          ? Number(markerArray[0]?.geo_location?.lat)
          : Number(origin?.lat),
      );
      setLong(
        markerArray?.length > 0
          ? Number(markerArray[0]?.geo_location?.lng)
          : Number(origin?.lng),
      );
    }
  }, [origin, markerArray]);

  return (
    <View style={styles.homeSubContainer}>
      <MapView
        onRegionChange={e => {
          setMpaDalta(e);
          // handleRegionChangeComplete(e)
        }}
        provider={PROVIDER_GOOGLE}
        ref={mapRef}
        style={[styles.mapContainer, mapContainerView]}
        zoomEnabled={true}
        scrollEnabled={true}
        showsScale={true}
        mapType={Platform.OS == 'ios' ? 'mutedStandard' : 'terrain'}
        paddingAdjustmentBehavior={'automatic'}
        initialRegion={{
          latitude: lat,
          longitude: long,
          latitudeDelta: getMpaDalta().latitudeDelta,
          longitudeDelta: getMpaDalta().longitudeDelta,
        }}
        // region={{
        //   latitude: lat,
        //   longitude: long,
        //   latitudeDelta: getMpaDalta().latitudeDelta,
        //   longitudeDelta: getMpaDalta().longitudeDelta,
        // }}
        zoomTapEnabled
        rotateEnabled
        loadingEnabled
        showsCompass>
        {markerArray && markerArray?.length > 0 ? (
          markerArray?.map((marker, index) => (
            <Marker
              key={index}
              coordinate={{
                latitude: Number(marker?.geo_location?.lat),
                longitude: Number(marker?.geo_location?.lng),
              }}>
              <Image
                resizeMode="contain"
                source={searchingRideParcel
                  // source={appImages.searchingParcel}
                  // source={appImages.searchingRide}
                }
                style={styles.markerRiderImage}
              />
            </Marker>
          ))
        ) : (
          <Marker
            coordinate={{ latitude: lat, longitude: long }}>
            <Image
              resizeMode="contain"
              source={appImages.markerImage}
              style={styles.markerImage}
            />
          </Marker>
        )}
      </MapView>
    </View>
  );
};

export default MapRouteMarker;

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
    height: hp('60%'),
    width: wp('100%'),
    overflow: 'hidden',
  },
  markerImage: {
    height: 30,
    width: 30,
    marginTop: Platform.OS == 'ios' ? '25%' : 0,
  },
  markerRiderImage: {
    height: 40,
    width: 40,
    marginTop: Platform.OS == 'ios' ? '25%' : 0,
  },
});
