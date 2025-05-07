import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { StyleSheet, View, Image, Platform, Dimensions, Alert } from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { appImages } from '../commons/AppImages';
import MapView, { Marker, AnimatedRegion, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import PolylineDecoder from '@mapbox/polyline';
import { colors } from '../theme/colors';
import { getMpaDalta, setMpaDalta } from './GeoCodeAddress';

const API_KEY = 'AIzaSyAGYLXByGkajbYglfVPK4k7VJFOFsyS9EA'; // Add your Google Maps API key here

const MapRoute = ({ mapContainerView, origin, destination, isPendingReq }) => {
  const mapRef = useRef(null);
  const bearingRef = useRef(0);
  const debounceTimeout = useRef(null);
  const markerRef = useRef(null);
  const [destinationLocation, setDestinationLocation] = useState({
    lat: null,
    lng: null,
  });
  const [coords, setCoords] = useState([]);
  // const [region, setRegion] = useState({
  const [mapRegion, setMapRegion] = useState({
    latitude: Number(origin?.lat) ? Number(origin?.lat) : null,
    longitude: Number(origin?.lng) ? Number(origin?.lng) : null,
    latitudeDelta: getMpaDalta().latitudeDelta,
    longitudeDelta: getMpaDalta().longitudeDelta,
  });
  const [isMapReady, setIsMapReady] = useState(false);
  const [animatedCoordinate] = useState(
    new AnimatedRegion({
      latitude: Number(origin?.lat) || null,
      longitude: Number(origin?.lng) || null,
      latitudeDelta: getMpaDalta().latitudeDelta,
      longitudeDelta: getMpaDalta().longitudeDelta,
    })
  );
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
          latitude: Number(30.7400 ?? mapRegion?.latitude) ?? 30.7400,
          longitude: Number(76.7900 ?? mapRegion?.longitude) ?? 76.7900,
          latitudeDelta: getMpaDalta().latitudeDelta,
          longitudeDelta: getMpaDalta().longitudeDelta,
        });
        Alert.alert("Restricted Area", "You can only explore within Mohali & Chandigarh.");
      }
    }, 50); // Delay in milliseconds


  };

  // Update latitude and longitude based on origin
  useEffect(() => {
    console.log('origin--MapRoute', origin, destination);
    if (Object?.keys(origin || {})?.length > 0 && mapRef?.current) {
      const newRegion = {
        latitude: Number(origin?.lat) ? Number(origin?.lat) : null,
        longitude: Number(origin?.lng) ? Number(origin?.lng) : null,
        latitudeDelta: getMpaDalta().latitudeDelta,
        longitudeDelta: getMpaDalta().longitudeDelta,
      };
      setMapRegion(newRegion);
      // if (mapRef.current) {
      //   mapRef?.current?.animateToRegion(newRegion, 1000);
      //   }
    }
  }, [origin]);

  const originMarker = useMemo(
    () => ({
      latitude: Number(origin?.lat),
      longitude: Number(origin?.lng),
    }),
    [origin],
  );

  const destinationMarker = useMemo(
    () => ({
      latitude: Number(destinationLocation?.lat),
      longitude: Number(destinationLocation?.lng),
    }),
    [destinationLocation],
  );

  const handleMapReady = () => {
    // console.log('Map is ready');
    if (
      destinationLocation?.lat?.toString()?.length > 0 &&
      originMarker?.latitude?.toString()?.length > 0
    ) {
      setTimeout(() => {
        setIsMapReady(true);
      }, 5000);
    } else {
      setTimeout(() => {
        setIsMapReady(true);
      }, 12000);
    }
  };

  const getBearing = (start, end) => {
    const lat1 = (start.lat * Math.PI) / 180;
    const lon1 = (start.lng * Math.PI) / 180;
    const lat2 = (end.lat * Math.PI) / 180;
    const lon2 = (end.lng * Math.PI) / 180;
    const dLon = lon2 - lon1;
    const y = Math.sin(dLon) * Math.cos(lat2);
    const x =
      Math.cos(lat1) * Math.sin(lat2) -
      Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);

    const bearing = Math.atan2(y, x);
    const bearingDeg = (bearing * 180) / Math.PI;
    return (bearingDeg + 360) % 360;
  };

  useEffect(() => {
    if (!origin || !destination || !mapRef.current) return;

    // Ensure lat/lng are numbers
    const lat = Number(origin?.lat);
    const lng = Number(origin?.lng);
    const destLat = Number(destination?.lat);
    const destLng = Number(destination?.lng);

    const newCoord = { latitude: lat, longitude: lng };
    animatedCoordinate.timing({
      ...newCoord,
      duration: 500,
      useNativeDriver: false,
    }).start();


    setTimeout(() => {
      mapRef.current?.animateToRegion({
        ...newCoord,
        // latitudeDelta: 0.0322,
        // longitudeDelta: 0.0321,
      }, 500);
    }, Platform.OS === 'ios' ? 100 : 0);

    // If any value is NaN, don't proceed
    if (isNaN(lat) || isNaN(lng) || isNaN(destLat) || isNaN(destLng)) return;
    const timeout = setInterval(() => {
      const bearing = getBearing({ lat, lng }, { lat: destLat, lng: destLng });

      const camera = {
        center: {
          latitude: lat,
          longitude: lng,
        },
        // heading: bearing || 0,
        heading: bearingRef.current || bearing, // Keep the same heading
        pitch: 30,
        zoom: 17,
        altitude: 300,
      };
      if (mapRef.current) {
        mapRef.current.animateCamera(camera, { duration: 1000 });
      }
    }, 15000);

    return () => clearInterval(timeout);
  }, [origin, destination]);

  // useEffect(() => {
  //   if (!origin || !destination || !mapRef.current) return;

  //   // Ensure lat/lng are numbers
  //   const lat = Number(origin?.lat);
  //   const lng = Number(origin?.lng);
  //   const destLat = Number(destination?.lat);
  //   const destLng = Number(destination?.lng);

  //   // If any value is NaN, don't proceed
  //   if (isNaN(lat) || isNaN(lng) || isNaN(destLat) || isNaN(destLng)) return;
  //   const timeout = setTimeout(() => {
  //     const bearing = getBearing({lat, lng}, {lat: destLat, lng: destLng});

  //     const camera = {
  //       center: {
  //         latitude: lat,
  //         longitude: lng,
  //       },
  //       // heading: bearing || 0,
  //       heading: bearingRef.current || bearing, // Keep the same heading
  //       pitch: 30,
  //       zoom: 17,
  //       altitude: 300,
  //     };
  //     if (mapRef.current) {
  //       mapRef.current.animateCamera(camera, {duration: 1000});
  //     }
  //   }, 2000);

  //   return () => clearTimeout(timeout);
  // }, [origin, destination]);

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
        `https://maps.googleapis.com/maps/api/directions/json?origin=${origin?.lat
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
      console.log('Error fetching route: ', error);
    }
  };


  return (
    <View
      pointerEvents={isPendingReq ? 'none' : 'auto'}
      style={styles.homeSubContainer}>
      <MapView
        provider={PROVIDER_GOOGLE}
        onRegionChange={e => {
          setMpaDalta(e);
          // console.log('e---onRegionChange', e);
          // handleRegionChangeComplete(e)
        }}
        ref={mapRef}
        style={[styles.mapContainer, mapContainerView]}
        zoomEnabled={true}
        scrollEnabled={true}
        showsScale={true}
        mapType={Platform.OS === 'ios' ? 'mutedStandard' : 'terrain'}
        region={mapRegion}
        // initialRegion={mapRegion}
        zoomTapEnabled={true}
        rotateEnabled={true}
        loadingEnabled={true}
        showsCompass={true}
        cacheEnabled={false}
        followsUserLocation={false}
        showsUserLocation={false}
        onMapReady={handleMapReady}
      >
        {/* Origin Marker */}
        {animatedCoordinate?.latitude && animatedCoordinate?.longitude && (
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
        )}
        {/* {originMarker?.latitude && originMarker?.longitude && (
          <Marker 
          // tracksViewChanges={!isMapReady}
          coordinate={originMarker} 
          >
            <Image
              resizeMode="cover"
              source={appImages.markerRideImage}
              style={styles.markerBikeImage}
            />
          </Marker>
        )} */}

        {/* Destination Marker */}
        {destinationLocation?.lat && destinationLocation?.lng && (
          <Marker
            coordinate={destinationMarker}
            tracksViewChanges={!isMapReady}
          >
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





// import React, {
//   memo,
//   useCallback,
//   useEffect,
//   useMemo,
//   useRef,
//   useState,
// } from 'react';
// import {
//   StyleSheet,
//   View,
//   Image,
//   Platform,
//   Alert,
//   Animated,
// } from 'react-native';
// import MapView, {
//   Marker,
//   Polyline,
//   PROVIDER_GOOGLE,
//   AnimatedRegion,
// } from 'react-native-maps';
// import PolylineDecoder from '@mapbox/polyline';
// import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
// import { appImages } from '../commons/AppImages';
// import { colors } from '../theme/colors';
// import { getMpaDalta, setMpaDalta } from './GeoCodeAddress';

// const API_KEY = 'AIzaSyAGYLXByGkajbYglfVPK4k7VJFOFsyS9EA';

// const MapRoute = ({ mapContainerView, origin, destination, isPendingReq }) => {
//   const mapRef = useRef(null);
//   const debounceTimeout = useRef(null);

//   const [destinationLocation, setDestinationLocation] = useState({
//     lat: null,
//     lng: null,
//   });

//   const [coords, setCoords] = useState([]);
//   const [isMapReady, setIsMapReady] = useState(false);

//   const animatedMarkerRef = useRef(null);
//   const [animatedRegion, setAnimatedRegion] = useState(
//     new AnimatedRegion({
//       latitude: Number(origin?.lat),
//       longitude: Number(origin?.lng),
//       latitudeDelta: getMpaDalta().latitudeDelta,
//       longitudeDelta: getMpaDalta().longitudeDelta,
//     })
//   );

//   const mapRegion = useMemo(() => ({
//     latitude: Number(origin?.lat),
//     longitude: Number(origin?.lng),
//     latitudeDelta: getMpaDalta().latitudeDelta,
//     longitudeDelta: getMpaDalta().longitudeDelta,
//   }), [origin]);

//   const mohaliChandigarhBounds = {
//     north: 30.8258,
//     south: 30.6600,
//     west: 76.6600,
//     east: 76.8500,
//   };

//   const isWithinBounds = (latitude, longitude) => {
//     return (
//       latitude <= mohaliChandigarhBounds.north &&
//       latitude >= mohaliChandigarhBounds.south &&
//       longitude >= mohaliChandigarhBounds.west &&
//       longitude <= mohaliChandigarhBounds.east
//     );
//   };

//   const handleRegionChangeComplete = (region) => {
//     if (debounceTimeout.current) clearTimeout(debounceTimeout.current);

//     debounceTimeout.current = setTimeout(() => {
//       if (!isWithinBounds(region.latitude, region.longitude)) {
//         mapRef.current?.animateToRegion({
//           latitude: 30.7400,
//           longitude: 76.7900,
//           latitudeDelta: getMpaDalta().latitudeDelta,
//           longitudeDelta: getMpaDalta().longitudeDelta,
//         });
//         Alert.alert("Restricted Area", "You can only explore within Mohali & Chandigarh.");
//       }
//     }, 50);
//   };

//   const getBearing = (start, end) => {
//     const lat1 = (start.lat * Math.PI) / 180;
//     const lon1 = (start.lng * Math.PI) / 180;
//     const lat2 = (end.lat * Math.PI) / 180;
//     const lon2 = (end.lng * Math.PI) / 180;
//     const dLon = lon2 - lon1;
//     const y = Math.sin(dLon) * Math.cos(lat2);
//     const x =
//       Math.cos(lat1) * Math.sin(lat2) -
//       Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);

//     const bearing = Math.atan2(y, x);
//     const bearingDeg = (bearing * 180) / Math.PI;
//     return (bearingDeg + 360) % 360;
//   };

//   // Animate camera and marker on origin update
//   useEffect(() => {
//     if (!origin || !destination || !mapRef.current) return;

//     const lat = Number(origin?.lat);
//     const lng = Number(origin?.lng);
//     const destLat = Number(destination?.lat);
//     const destLng = Number(destination?.lng);

//     if (isNaN(lat) || isNaN(lng) || isNaN(destLat) || isNaN(destLng)) return;

//     const newCoord = { latitude: lat, longitude: lng };

//     animatedRegion.timing({ ...newCoord, duration: 1000, useNativeDriver: false }).start();

//     const bearing = getBearing({ lat, lng }, { lat: destLat, lng: destLng });

//     const camera = {
//       center: newCoord,
//       heading: bearing,
//       pitch: 30,
//       zoom: 17,
//       altitude: 300,
//     };

//     mapRef.current.animateCamera(camera, { duration: 1000 });
//   }, [origin]);

//   // Fetch route
//   useEffect(() => {
//     if (origin?.lat && origin?.lng && destination?.lat && destination?.lng) {
//       setDestinationLocation(destination);
//       fetchRoute(origin, destination);
//     }
//   }, [origin, destination]);

//   const fetchRoute = async (origin, destination) => {
//     try {
//       const response = await fetch(
//         `https://maps.googleapis.com/maps/api/directions/json?origin=${origin?.lat},${origin?.lng}&destination=${destination?.lat},${destination?.lng}&key=${API_KEY}`,
//       );
//       const json = await response.json();

//       if (json.routes?.length) {
//         const points = PolylineDecoder.decode(
//           json.routes[0].overview_polyline.points
//         );
//         const routeCoords = points.map(point => ({
//           latitude: point[0],
//           longitude: point[1],
//         }));
//         setCoords(routeCoords);
//       }
//     } catch (error) {
//       console.log('Error fetching route:', error);
//     }
//   };

//   const destinationMarker = useMemo(() => ({
//     latitude: Number(destinationLocation?.lat),
//     longitude: Number(destinationLocation?.lng),
//   }), [destinationLocation]);

//   return (
//     <View
//       pointerEvents={isPendingReq ? 'none' : 'auto'}
//       style={styles.homeSubContainer}>
//       <MapView
//         provider={PROVIDER_GOOGLE}
//         ref={mapRef}
//         style={[styles.mapContainer, mapContainerView]}
//         initialRegion={mapRegion}
//         onRegionChangeComplete={handleRegionChangeComplete}
//         onRegionChange={setMpaDalta}
//         zoomEnabled
//         scrollEnabled
//         showsCompass
//         showsScale
//         loadingEnabled
//         showsUserLocation={false}
//         rotateEnabled
//         mapType={Platform.OS === 'ios' ? 'mutedStandard' : 'terrain'}
//         onMapReady={() => setIsMapReady(true)}>

//         {/* 🚗 Animated Origin Marker */}
//         <Marker.Animated
//           ref={animatedMarkerRef}
//           coordinate={animatedRegion}>
//           <Image
//             resizeMode="cover"
//             source={appImages.markerRideImage}
//             style={styles.markerBikeImage}
//           />
//         </Marker.Animated>

//         {/* 📍 Destination Marker */}
//         {destinationLocation?.lat && destinationLocation?.lng && (
//           <Marker
//             coordinate={destinationMarker}
//             tracksViewChanges={!isMapReady}>
//             <Image
//               resizeMode="contain"
//               source={appImages.markerImage}
//               style={styles.markerImage}
//             />
//           </Marker>
//         )}

//         {/* 📍 Polyline */}
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

// export default memo(MapRoute);



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
