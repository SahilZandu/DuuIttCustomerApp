// // import React, { useCallback, useEffect, useRef, useState } from 'react';
// // import {StyleSheet, View, Image,  Platform, Dimensions} from 'react-native';
// // import {
// //   heightPercentageToDP as hp,
// //   widthPercentageToDP as wp,
// // } from 'react-native-responsive-screen';
// // import {appImages} from '../commons/AppImages';
// // import MapView, {
// //     Marker,
// //     Callout,
// //     PROVIDER_GOOGLE,
// //     Polyline,
// //   } from 'react-native-maps';
// //   import Geolocation from 'react-native-geolocation-service';
// //   import Poly from '@mapbox/polyline';
// // import { useFocusEffect } from '@react-navigation/native';
// // import { getMpaDalta, setMpaDalta } from './GeoCodeAddress';

// // const {width, height} = Dimensions.get('window');
// // const ASPECT_RATIO = width / height;
// // const LATITUDE_DELTA = 0.0922;
// // const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

// //  const destination = {lat: 30.7145, lng: 76.7149};

// // const MapRoute = ({
// //     mapContainerView, origin ,destination
// // }) => {

// //     const mapRef = useRef(null);
// //     const [lat, setLat] = useState(30.7076);
// //     const [long, setLong] = useState(76.715126);
// //     const [destinationLocation, setDestinationLocation] = useState({});
// //     const [coords, setcoords] = useState([]);

// //     useEffect(()=>{
// //       if(Object?.keys(origin || {})?.length > 0){
// //       setLat(origin?.lat)
// //       setLong(origin?.lng)
// //       }

// //       if(Object?.keys(destination || {})?.length > 0){
// //         setDestinationLocation(destination)
// //       }
// //     },[origin,destination])

// //     console.log("destination--",destination,destinationLocation)

// //   return (
// //     <View style={styles.homeSubContainer}>
// //         {/* {lat && long && coords && coords?.length > 0 ? ( */}
// //         <MapView
// //         onRegionChange={e => {
// //           // setMpaDalta(e);
// //         }}
// //           provider={PROVIDER_GOOGLE}
// //           ref={mapRef}
// //           style={[
// //             styles.mapContainer,mapContainerView
// //           ]}
// //           zoomEnabled={true}
// //           scrollEnabled={true}
// //           showsScale={true}
// //           mapType={Platform.OS == 'ios' ? 'mutedStandard' : 'terrain'}
// //           paddingAdjustmentBehavior={'automatic'}
// //           // region={calculateRegion(coords)}
// //           region={{
// //             latitude: lat,
// //             longitude: long,
// //             latitudeDelta: getMpaDalta().latitudeDelta,
// //             longitudeDelta: getMpaDalta().longitudeDelta,
// //             }}
// //           //   onRegionChangeComplete={() =>
// //           //   CoordinatesValue(originLoactaion, destinationLocation)
// //           // }
// //           zoomTapEnabled={true}
// //           rotateEnabled={true}
// //           loadingEnabled={true}
// //           showsCompass={true}>
// //           <Marker coordinate={{latitude: lat, longitude: long}}>
// //             <Image
// //               resizeMode="contain"
// //               source={appImages.markerImage}
// //               style={styles.markerImage}
// //             />
// //           </Marker>

// //              {destinationLocation !== undefined ? (
// //             <>
// //               {/* <Marker coordinate={{latitude: 30.6736, longitude: 76.7403}}> */}
// //                 <Marker coordinate={{latitude: destinationLocation?.lat, longitude:destinationLocation?.lng }} >
// //                 <Image
// //                   resizeMode="contain"
// //                   source={appImages.markerImage}
// //                   style={styles.markerImage}
// //                 />
// //               </Marker>
// //             </>
// //           ) : null}
// //         </MapView>
// //         {/* ) : (
// //                 <View>
// //                 <Text>Hello</Text>
// //                 </View>
// //               )} */}
// //       </View>
// //   );
// // };

// // export default MapRoute;

// // const styles = StyleSheet.create({
// //     homeSubContainer: {
// //         alignItems: 'flex-start',
// //         justifyContent: 'center',
// //         overflow: 'hidden',
// //         shadowRadius: 1,
// //         shadowOffset: {height: 2, width: 0},
// //       },
// //       mapContainer: {
// //         alignSelf: 'center',
// //         height: hp('35%'),
// //         width: wp('100%'),
// //         overflow: 'hidden',
// //       },
// //       markerImage: {
// //         height: 35,
// //         width: 35,
// //         marginTop: Platform.OS == 'ios' ? '25%' : 0,
// //       },

// // });

// import React, { useEffect, useRef, useState } from 'react';
// import { StyleSheet, View, Image, Platform, Dimensions } from 'react-native';
// import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
// import { appImages } from '../commons/AppImages';
// import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
// import PolylineDecoder from '@mapbox/polyline'; // For decoding the route
// import { colors } from '../theme/colors';

// const { width, height } = Dimensions.get('window');
// const ASPECT_RATIO = width / height;
// const LATITUDE_DELTA = 0.0922;
// const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

// const API_KEY = 'AIzaSyAGYLXByGkajbYglfVPK4k7VJFOFsyS9EA';  // Add your Google Maps API key here

// const MapRoute = ({ mapContainerView, origin, destination ,isPendingReq}) => {
//   const mapRef = useRef(null);
//   const [lat, setLat] = useState(30.7076);
//   const [long, setLong] = useState(76.715126);
//   const [destinationLocation, setDestinationLocation] = useState({});
//   const [coords, setCoords] = useState([]);

//   useEffect(() => {
//     if (Object?.keys(origin || {})?.length > 0) {
//       setLat(Number(origin?.lat));
//       setLong(Number(origin?.lng));
//     }

//     if (Object?.keys(destination || {})?.length > 0) {
//       setDestinationLocation(destination);
//       fetchRoute(origin, destination); // Fetch route when both locations are available
//     }
//   }, [origin, destination]);

//   // Fetch the route from Google Directions API
//   const fetchRoute = async (origin, destination) => {
//     try {
//       const response = await fetch(
//         `https://maps.googleapis.com/maps/api/directions/json?origin=${ Number(origin?.lat)},${Number(origin?.lng)}&destination=${Number(destination?.lat)},${Number(destination?.lng)}&key=${API_KEY}`
//       );
//       const json = await response.json();
//       // console.log("json---",json)
//       if (json?.routes?.length) {
//         const points = PolylineDecoder.decode(json.routes[0].overview_polyline.points);
//         const routeCoords = points.map(point => ({
//           latitude: point[0],
//           longitude: point[1],
//         }));
//         setCoords(routeCoords);
//         // console.log("routeCoords---",routeCoords)
//       }
//     } catch (error) {
//       console.error("error --++-- ",error);
//     }
//   };

//   return (
//     <View pointerEvents={ isPendingReq ? 'none' : 'auto'} style={styles.homeSubContainer}>
//       <MapView
//         provider={PROVIDER_GOOGLE}
//         ref={mapRef}
//         style={[styles.mapContainer, mapContainerView]}
//         zoomEnabled={true}
//         scrollEnabled={true}
//         showsScale={true}
//         mapType={Platform.OS === 'ios' ? 'mutedStandard' : 'terrain'}
//         region={{
//           latitude: lat,
//           longitude: long,
//           latitudeDelta: LATITUDE_DELTA,
//           longitudeDelta: LONGITUDE_DELTA,
//         }}
//         zoomTapEnabled={true}
//         rotateEnabled={true}
//         loadingEnabled={true}
//         showsCompass={true}
//       >
//         {/* Origin Marker */}
//         <Marker coordinate={{ latitude: lat, longitude: long }}>
//           <Image resizeMode="contain" source={appImages.markerImage} style={styles.markerImage} />
//         </Marker>

//         {/* Destination Marker */}
//         {destinationLocation?.lat && destinationLocation?.lng && (
//           <Marker coordinate={{ latitude: Number(destinationLocation?.lat), longitude: Number(destinationLocation?.lng)}}>
//             <Image resizeMode="contain" source={appImages.markerImage} style={styles.markerImage} />
//           </Marker>
//         )}

//         {/* Polyline for the Route */}
//         {coords?.length > 0 && <Polyline coordinates={coords} strokeWidth={4} strokeColor={colors.main} />}
//       </MapView>
//     </View>
//   );
// };

// export default MapRoute;

// const styles = StyleSheet.create({
//   homeSubContainer: {
//     alignItems: 'flex-start',
//     justifyContent: 'center',
//     overflow: 'hidden',
//     shadowRadius: 1,
//     shadowOffset: { height: 2, width: 0 },
//   },
//   mapContainer: {
//     alignSelf: 'center',
//     height: hp('35%'),
//     width: wp('100%'),
//     overflow: 'hidden',
//   },
//   markerImage: {
//     height: 35,
//     width: 35,
//     marginTop: Platform.OS === 'ios' ? '25%' : 0,
//   },
// });

import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {StyleSheet, View, Image, Platform, Dimensions} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {appImages} from '../commons/AppImages';
import MapView, {Marker, Polyline, PROVIDER_GOOGLE} from 'react-native-maps';
import PolylineDecoder from '@mapbox/polyline';
import {colors} from '../theme/colors';

const {width, height} = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const API_KEY = 'AIzaSyAGYLXByGkajbYglfVPK4k7VJFOFsyS9EA'; // Add your Google Maps API key here

const MapRoute = ({mapContainerView, origin, destination, isPendingReq}) => {
  const mapRef = useRef(null);
  const [lat, setLat] = useState(origin?.lat ? Number(origin?.lat) : null);
  const [long, setLong] = useState(
    origin?.lng ? Number(origin?.lng) :null,
  );
  const [destinationLocation, setDestinationLocation] = useState({
    lat: null,
    lng: null,
  });
  const [coords, setCoords] = useState([]);

  // Update latitude and longitude based on origin
  useEffect(() => {
    if (Object?.keys(origin || {})?.length > 0) {
      setLat(Number(origin?.lat));
      setLong(Number(origin?.lng));
    }
  }, [origin]);

  // Memoized region to prevent re-rendering unless lat or long changes
  const region = useMemo(
    () => ({
      latitude: lat,
      longitude: long,
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA,
    }),
    [lat, long],
  );

  // Fetch and set route only when both origin and destination are defined
  useEffect(() => {
    if (
      origin &&
      origin?.lat &&
      origin?.lng &&
      destination &&
      destination?.lat &&
      destination?.lng
    ) {
      setDestinationLocation(destination);
      fetchRoute(origin, destination);
    }
  }, [origin, destination]);

  // Fetch the route from Google Directions API
  const fetchRoute = async (origin, destination) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/directions/json?origin=${
          origin?.lat
        },${origin?.lng}&destination=${Number(destination?.lat)},${Number(
          destination?.lng,
        )}&key=${API_KEY}`,
      );
      const json = await response.json();

      if (json.routes?.length) {
        const points = PolylineDecoder.decode(
          json.routes[0].overview_polyline.points,
        );
        const routeCoords = points?.map(point => ({
          latitude: point[0],
          longitude: point[1],
        }));
        setCoords(routeCoords);
      }
    } catch (error) {
      console.error('Error fetching route: ', error);
    }
  };

  return (
    <View
      pointerEvents={isPendingReq ? 'none' : 'auto'}
      style={styles.homeSubContainer}>
      <MapView
        provider={PROVIDER_GOOGLE}
        ref={mapRef}
        style={[styles.mapContainer, mapContainerView]}
        zoomEnabled
        scrollEnabled
        showsScale
        mapType={Platform.OS === 'ios' ? 'mutedStandard' : 'terrain'}
        region={region}
        zoomTapEnabled
        rotateEnabled
        loadingEnabled
        showsCompass>
        {/* Origin Marker */}
         {origin?.lat && origin?.lng && (
        <Marker
          key={`origin-${lat}-${long}`} // Add key prop to prevent flickering
          coordinate={{latitude: lat, longitude: long}}>
          <Image
            resizeMode="contain"
            source={appImages.markerImage}
            style={styles.markerImage}
          />
        </Marker>)}

        {/* Destination Marker */}
        {destinationLocation?.lat && destinationLocation?.lng && (
          <Marker
            coordinate={{
              latitude: Number(destinationLocation?.lat),
              longitude: Number(destinationLocation?.lng),
            }}>
            <Image
              resizeMode="contain"
              source={appImages.markerImage}
              style={styles.markerImage}
            />
          </Marker>
        )}

        {/* Polyline for the Route */}
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
    marginTop: Platform.OS === 'ios' ? '25%' : 0,
  },
});
