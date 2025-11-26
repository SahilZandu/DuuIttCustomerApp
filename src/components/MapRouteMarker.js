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
import { DuuittMapTheme } from './DuuittMapTheme';

const MapRouteMarker = ({ mapContainerView, origin, markerArray, searchingRideParcel }) => {
  // console.log('markerArray--', markerArray);
  const mapRef = useRef(null);
  const debounceTimeout = useRef(null);
  const [lat, setLat] = useState(Number(origin?.lat) ?? 30.7400);
  const [long, setLong] = useState(Number(origin?.lng) ?? 76.7900);


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
      {lat?.toString()?.length > 0 &&
        <MapView
          onRegionChange={e => {
            setMpaDalta(e);
          }}
          provider={PROVIDER_GOOGLE}
          ref={mapRef}
          style={[styles.mapContainer, mapContainerView]}
          zoomEnabled={true}
          scrollEnabled={false}
          showsScale={false}
          loadingEnabled={true}
          mapType={Platform.OS === 'ios' ? 'standard' : 'standard'}
          customMapStyle={DuuittMapTheme}
          paddingAdjustmentBehavior={'automatic'}
          region={{
            latitude: lat,
            longitude: long,
            latitudeDelta: getMpaDalta().latitudeDelta,
            longitudeDelta: getMpaDalta().longitudeDelta,
          }}
          zoomTapEnabled
          rotateEnabled={false}
          showsCompass={false}
          // 👇 Set Zoom Limits
          minZoomLevel={10}  // prevent zooming out too far
          maxZoomLevel={18}  // prevent zooming in too much
          showsUserLocation={true}   // 👈 shows blue dot
          followsUserLocation={true} // 👈 map follows the user as they move
        >
          {markerArray && markerArray?.length > 0 ? (
            markerArray?.map((marker, index) => (
              <Marker
                key={index}
                tracksViewChanges={false}
                coordinate={{
                  latitude: Number(marker?.geo_location?.lat),
                  longitude: Number(marker?.geo_location?.lng),
                }}>
                <Image
                  resizeMode="contain"
                  source={searchingRideParcel
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
                source={appImages.pickMap}
                style={styles.markerImage}
              />
            </Marker>
          )}
        </MapView>
      }
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
