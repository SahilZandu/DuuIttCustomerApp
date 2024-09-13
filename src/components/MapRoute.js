import React, { useCallback, useRef, useState } from 'react';
import {StyleSheet, View, Image,  Platform, Dimensions} from 'react-native';
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
  import Geolocation from 'react-native-geolocation-service';
  import Poly from '@mapbox/polyline';
import { useFocusEffect } from '@react-navigation/native';
import { getMpaDalta, setMpaDalta } from './GeoCodeAddress';

const {width, height} = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

 const destination = {lat: 30.7145, lng: 76.7149};


const MapRoute = ({
    mapContainerView
}) => {

    const mapRef = useRef(null);
    const [lat, setlat] = useState(30.7076);
    const [long, setlong] = useState(76.715126);
    const [destinationLocation, setDestinationLocation] = useState();
    const [coords, setcoords] = useState([]);

    

  return (
    <View style={styles.homeSubContainer}>
        {/* {lat && long && coords && coords?.length > 0 ? ( */}
        <MapView
        onRegionChange={e => {
          setMpaDalta(e);
        }}
          provider={PROVIDER_GOOGLE}
          ref={mapRef}
          style={[
            styles.mapContainer,mapContainerView
          ]}
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
          zoomTapEnabled={true}
          rotateEnabled={true}
          loadingEnabled={true}
          showsCompass={true}>
          <Marker coordinate={{latitude: lat, longitude: long}}>
            <Image
              resizeMode="contain"
              source={appImages.markerImage}
              style={styles.markerImage}
            />
          </Marker>

             {!destinationLocation !== undefined ? (
            <>
              <Marker coordinate={{latitude: 30.6736, longitude: 76.7403}}>
                {/* <Marker coordinate={destinationLocation} > */}
                <Image
                  resizeMode="contain"
                  source={appImages.markerImage}
                  style={styles.markerImage}
                />
              </Marker>
            </>
          ) : null}
        </MapView>
        {/* ) : (
                <View>
                <Text>Hello</Text>
                </View>
              )} */}
      </View>
  );
};

export default MapRoute;

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
        height: hp('35%'),
        width: wp('100%'),
        overflow: 'hidden',
      },
      markerImage: {
        height: 35,
        width: 35,
        marginTop: Platform.OS == 'ios' ? '25%' : 0,
      },
 
});
