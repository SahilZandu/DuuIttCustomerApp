import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
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
  const [long, setLong] = useState(origin?.lng ? Number(origin?.lng) : null);
  const [destinationLocation, setDestinationLocation] = useState({
    lat: null,
    lng: null,
  });
  const [coords, setCoords] = useState([]);
  const [delta, setDelta] = useState({
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA,
  });
  const [region, setRegion] = useState({
    latitude: Number(origin?.lat) ? Number(origin?.lat) : lat,
    longitude: Number(origin?.lng) ? Number(origin?.lng) : long,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA,
  });
  const [isMapReady, setIsMapReady] = useState(false);

  // Update latitude and longitude based on origin
  useEffect(() => {
    console.log('origin--', origin, destination);
    if (Object?.keys(origin || {})?.length > 0) {
      setLat(Number(origin?.lat));
      setLong(Number(origin?.lng));
      setRegion({
        latitude: Number(origin?.lat) ? Number(origin?.lat) : lat,
        longitude: Number(origin?.lng) ? Number(origin?.lng) : long,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      });
    }
  }, [origin]);

  const handleMapReady = () => {
    console.log('Map is ready');
    if (
      destinationLocation?.lat?.toString()?.length > 0 &&
      lat?.toString()?.length > 0
    ) {
      setTimeout(() => {
        setIsMapReady(true);
      },5000);
    }else{
      setTimeout(() => {
        setIsMapReady(true);
      }, 12000);
    }
    
  };

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
        zoomEnabled={true}
        scrollEnabled={true}
        showsScale={true}
        mapType={Platform.OS === 'ios' ? 'mutedStandard' : 'terrain'}
        region={region}
        zoomTapEnabled={true}
        rotateEnabled={true}
        loadingEnabled={true}
        showsCompass={true}
        onMapReady={handleMapReady}>
        {/* Origin Marker */}
        {lat && long && (
          <Marker
            coordinate={{latitude: lat, longitude: long}}
            tracksViewChanges={!isMapReady}
            useLegacyPinView={true}>
            <Image
              resizeMode="cover"
              source={appImages.markerRideImage}
              style={styles.markerBikeImage}
            />
          </Marker>
        )}

        {/* Destination Marker */}
        {destinationLocation?.lat && destinationLocation?.lng && (
          <Marker
            coordinate={{
              latitude: Number(destinationLocation?.lat),
              longitude: Number(destinationLocation?.lng),
            }}
            tracksViewChanges={!isMapReady}
            useLegacyPinView={true}>
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

export default memo(MapRoute);

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
  markerBikeImage: {
    height: 40,
    width: 40,
    marginTop: Platform.OS === 'ios' ? '25%' : 0,
  },
});


// import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
// import {StyleSheet, View, Image, Platform, Dimensions} from 'react-native';
// import {
//   heightPercentageToDP as hp,
//   widthPercentageToDP as wp,
// } from 'react-native-responsive-screen';
// import {appImages} from '../commons/AppImages';
// import MapView, {Marker, Polyline, PROVIDER_GOOGLE} from 'react-native-maps';
// import PolylineDecoder from '@mapbox/polyline';
// import {colors} from '../theme/colors';

// const {width, height} = Dimensions.get('window');
// const ASPECT_RATIO = width / height;
// const LATITUDE_DELTA = 0.0922;
// const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

// const API_KEY = 'AIzaSyAGYLXByGkajbYglfVPK4k7VJFOFsyS9EA'; // Add your Google Maps API key here

// const MapRoute = ({mapContainerView, origin, destination, isPendingReq}) => {
//   const mapRef = useRef(null);
//   const [lat, setLat] = useState(origin?.lat ? Number(origin?.lat) : null);
//   const [long, setLong] = useState(
//     origin?.lng ? Number(origin?.lng) :null,
//   );
//   const [destinationLocation, setDestinationLocation] = useState({
//     lat: null,
//     lng: null,
//   });
//   const [coords, setCoords] = useState([]);
//   const [delta ,setDelta]=useState({
//     latitudeDelta: LATITUDE_DELTA,
//     longitudeDelta: LONGITUDE_DELTA,
//   })

//   // Update latitude and longitude based on origin
//   useEffect(() => {
//     console.log('origin--',origin,destination);
//     if (Object?.keys(origin || {})?.length > 0) {
//       setLat(Number(origin?.lat));
//       setLong(Number(origin?.lng));
//     }
//   }, [origin]);

//   const region = useMemo(
//     () => ({
//       latitude: lat,
//       longitude: long,
//       latitudeDelta:delta?.latitudeDelta,
//       longitudeDelta:delta?.longitudeDelta,
//     }),
//     [lat, long,delta],
//   );

//   // Fetch and set route only when both origin and destination are defined
//   useEffect(() => {
//     if (
//       origin &&
//       origin?.lat &&
//       origin?.lng &&
//       destination &&
//       destination?.lat &&
//       destination?.lng
//     ) {
//       setDestinationLocation(destination);
//       fetchRoute(origin, destination);
//     }
//   }, [origin, destination]);

//   // Fetch the route from Google Directions API
//   const fetchRoute = async (origin, destination) => {
//     try {
//       const response = await fetch(
//         `https://maps.googleapis.com/maps/api/directions/json?origin=${
//           origin?.lat
//         },${origin?.lng}&destination=${Number(destination?.lat)},${Number(
//           destination?.lng,
//         )}&key=${API_KEY}`,
//       );
//       const json = await response.json();

//       if (json.routes?.length) {
//         const points = PolylineDecoder.decode(
//           json.routes[0].overview_polyline.points,
//         );
//         const routeCoords = points?.map(point => ({
//           latitude: point[0],
//           longitude: point[1],
//         }));
//         setCoords(routeCoords);
//       }
//     } catch (error) {
//       console.error('Error fetching route: ', error);
//     }
//   };

//   return (
//     <View
//       pointerEvents={isPendingReq ? 'none' : 'auto'}
//       style={styles.homeSubContainer}>
//       <MapView
//         provider={PROVIDER_GOOGLE}
//         ref={mapRef}
//         style={[styles.mapContainer, mapContainerView]}
//         zoomEnabled
//         scrollEnabled
//         showsScale
//         mapType={Platform.OS === 'ios' ? 'mutedStandard' : 'terrain'}
//         region={region}
//         zoomTapEnabled
//         rotateEnabled
//         loadingEnabled
//         showsCompass>
//         {/* Origin Marker */}
//          {origin?.lat && origin?.lng && (
//         <Marker
//           key={`origin-${lat}-${long}`} // Add key prop to prevent flickering
//           coordinate={{latitude: lat, longitude: long}}>
//           <Image
//             resizeMode="contain"
//             source={appImages.markerImage}
//             style={styles.markerImage}
//           />
//         </Marker>)}

//         {/* Destination Marker */}
//         {destinationLocation?.lat && destinationLocation?.lng && (
//           <Marker
//             coordinate={{
//               latitude: Number(destinationLocation?.lat),
//               longitude: Number(destinationLocation?.lng),
//             }}>
//                <Image
//               resizeMode="cover"
//               source={appImages.markerRideImage}
//               style={styles.markerBikeImage}
//             />
//             {/* <Image
//               resizeMode="contain"
//               source={appImages.markerImage}
//               style={styles.markerImage}
//             /> */}
//           </Marker>
//         )}

//         {/* Polyline for the Route */}
//         {coords?.length > 0 && (
//           <Polyline
//             coordinates={coords}
//             strokeWidth={4}
//             strokeColor={colors.main}
//           />
//         )}
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
//     shadowOffset: {height: 2, width: 0},
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
//     markerBikeImage: {
//     height: 40,
//     width: 40,
//     marginTop: Platform.OS === 'ios' ? '25%' : 0,
//   },
// });

// import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
// import {StyleSheet, View, Image, Platform, Dimensions} from 'react-native';
// import {
//   heightPercentageToDP as hp,
//   widthPercentageToDP as wp,
// } from 'react-native-responsive-screen';
// import {appImages} from '../commons/AppImages';
// import MapView, {Marker, Polyline, PROVIDER_GOOGLE} from 'react-native-maps';
// import PolylineDecoder from '@mapbox/polyline';
// import {colors} from '../theme/colors';

// const {width, height} = Dimensions.get('window');
// const ASPECT_RATIO = width / height;
// const LATITUDE_DELTA = 0.0922;
// const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

// const API_KEY = 'AIzaSyAGYLXByGkajbYglfVPK4k7VJFOFsyS9EA'; // Add your Google Maps API key here

// const MapRoute = ({mapContainerView, origin, destination, isPendingReq}) => {
//   const mapRef = useRef(null);
//   const [markerState, setMarkerState] = useState({
//     origin: null,
//     destination: null,
//     coords: [],
//   });
//   const [region, setRegion] = useState({
//     latitude: 0,
//     longitude: 0,
//     latitudeDelta: LATITUDE_DELTA,
//     longitudeDelta: LONGITUDE_DELTA,
//   });

//   // Debounce function to prevent rapid updates
//   const debounce = (func, wait) => {
//     let timeout;
//     return function executedFunction(...args) {
//       const later = () => {
//         clearTimeout(timeout);
//         func(...args);
//       };
//       clearTimeout(timeout);
//       timeout = setTimeout(later, wait);
//     };
//   };

//   // Update markers and region with debounce
//   const updateMarkers = useCallback(
//     debounce((newOrigin, newDestination) => {
//       if (newOrigin?.lat && newOrigin?.lng) {
//         setMarkerState(prev => ({
//           ...prev,
//           origin: {
//             latitude: Number(newOrigin.lat),
//             longitude: Number(newOrigin.lng),
//           },
//         }));
//         setRegion(prev => ({
//           ...prev,
//           latitude: Number(newOrigin.lat),
//           longitude: Number(newOrigin.lng),
//         }));
//       }

//       if (newDestination?.lat && newDestination?.lng) {
//         setMarkerState(prev => ({
//           ...prev,
//           destination: {
//             latitude: Number(newDestination.lat),
//             longitude: Number(newDestination.lng),
//           },
//         }));
//       }
//     }, 100),
//     [],
//   );

//   // Update markers when origin or destination changes
//   useEffect(() => {
//     updateMarkers(origin, destination);
//   }, [origin, destination, updateMarkers]);

//   // Fetch route when both locations are available
//   useEffect(() => {
//     const fetchRoute = async () => {
//       if (
//         markerState.origin?.latitude &&
//         markerState.origin?.longitude &&
//         markerState.destination?.latitude &&
//         markerState.destination?.longitude
//       ) {
//         try {
//           const response = await fetch(
//             `https://maps.googleapis.com/maps/api/directions/json?origin=${markerState.origin?.latitude},${markerState.origin?.longitude}&destination=${markerState.destination?.latitude},${markerState.destination?.longitude}&key=${API_KEY}`,
//           );
//           const json = await response.json();

//           if (json.routes?.length) {
//             const points = PolylineDecoder.decode(
//               json.routes[0].overview_polyline.points,
//             );
//             const routeCoords = points.map(point => ({
//               latitude: point[0],
//               longitude: point[1],
//             }));
//             setMarkerState(prev => ({...prev, coords: routeCoords}));
//           }
//         } catch (error) {
//           console.error('Error fetching route: ', error);
//         }
//       }
//     };

//     fetchRoute();
//   }, [markerState?.origin, markerState?.destination]);

//   return (
//     <View
//       pointerEvents={isPendingReq ? 'none' : 'auto'}
//       style={styles.homeSubContainer}>
//       <MapView
//         provider={PROVIDER_GOOGLE}
//         ref={mapRef}
//         style={[styles.mapContainer,mapContainerView]}
//         zoomEnabled
//         scrollEnabled
//         showsScale
//         mapType={Platform.OS === 'ios' ? 'mutedStandard' : 'terrain'}
//         region={region}
//         zoomTapEnabled
//         rotateEnabled
//         loadingEnabled
//         showsCompass>
//         {markerState?.origin && (
//           <Marker coordinate={markerState?.origin}
//            tracksViewChanges={false}>
//             <Image
//               resizeMode='cover'
//               // source={appImages.searchingRide}
//               source={appImages.markerRideImage}
//               style={styles.markerBikeImage}
//             />
//           </Marker>
//         )}
//         {markerState?.destination && (
//           <Marker
//             coordinate={markerState?.destination}
//             tracksViewChanges={false}>
//             <Image
//               resizeMode="contain"
//               source={appImages.markerImage}
//               style={styles.markerImage}
//             />
//           </Marker>
//         )}
//         {markerState?.coords?.length > 0 && (
//           <Polyline
//             coordinates={markerState?.coords}
//             strokeWidth={4}
//             strokeColor={colors.main}
//           />
//         )}
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
//     shadowOffset: {height: 2, width: 0},
//   },
//   mapContainer: {
//     alignSelf: 'center',
//     height: hp('35%'),
//     width: wp('100%'),
//     overflow: 'hidden',
//   },
//   markerBikeImage: {
//     height: 40,
//     width: 40,
//     marginTop: Platform.OS === 'ios' ? '25%' : 0,
//   },
//   markerImage: {
//     height: 35,
//     width: 35,
//     marginTop: Platform.OS === 'ios' ? '25%' : 0,
//   },
// });
