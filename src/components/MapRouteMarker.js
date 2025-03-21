import React, {useCallback, useEffect, useRef, useState} from 'react';
import {StyleSheet, View, Image, Platform, Dimensions} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {appImages} from '../commons/AppImages';
import MapView, {
  Marker,
  Callout,
  PROVIDER_GOOGLE,
  Polyline,
} from 'react-native-maps';
import {getMpaDalta, setMpaDalta} from './GeoCodeAddress';

const {width, height} = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const MapRouteMarker = ({mapContainerView, origin, markerArray}) => {
  console.log('markerArray--', markerArray);
  const mapRef = useRef(null);
  const [lat, setLat] = useState(Number(origin?.lat));
  const [long, setLong] = useState(Number(origin?.lng));
  const [coords, setcoords] = useState([]);

  useEffect(() => {
    if (Object?.keys(origin || {})?.length > 0) {
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
      {/* {lat && long && coords && coords?.length > 0 ? ( */}
      <MapView
        onRegionChange={e => {
          // setMpaDalta(e);
        }}
        provider={PROVIDER_GOOGLE}
        ref={mapRef}
        style={[styles.mapContainer, mapContainerView]}
        zoomEnabled={true}
        scrollEnabled={true}
        showsScale={true}
        mapType={Platform.OS == 'ios' ? 'mutedStandard' : 'terrain'}
        paddingAdjustmentBehavior={'automatic'}
        // region={calculateRegion(coords)}
        region={{
          latitude: lat,
          longitude: long,
          latitudeDelta: getMpaDalta().latitudeDelta,
          longitudeDelta: getMpaDalta().longitudeDelta,
        }}
        //   onRegionChangeComplete={() =>
        //   CoordinatesValue(originLoactaion, destinationLocation)
        // }
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
                source={appImages.markerImage}
                style={styles.markerImage}
              />
            </Marker>
          ))
        ) : (
          <Marker coordinate={{latitude: lat, longitude: long}}>
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
    shadowOffset: {height: 2, width: 0},
  },
  mapContainer: {
    alignSelf: 'center',
    height: hp('60%'),
    width: wp('100%'),
    overflow: 'hidden',
  },
  markerImage: {
    height: 35,
    width: 35,
    marginTop: Platform.OS == 'ios' ? '25%' : 0,
  },
});
