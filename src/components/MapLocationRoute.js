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
import MapView, { Marker, Polygon, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import AnimatedLoader from './AnimatedLoader/AnimatedLoader';
import { getMpaDalta, setMpaDalta } from './GeoCodeAddress';
import { colors } from '../theme/colors';

let currentLocation = {};

const MapLocationRoute = ({
  mapContainerView,
  origin,
  isPendingReq,
  onTouchLocation,
  height,
}) => {
  const mapRef = useRef(null);
  const debounceTimeout = useRef(null);
  const [mapRegion, setMapRegion] = useState({
    latitude: origin?.lat ? Number(origin?.lat) : 30.7400,
    longitude: origin?.lng ? Number(origin?.lng) : 76.7900,
    latitudeDelta: getMpaDalta().latitudeDelta,
    longitudeDelta: getMpaDalta().longitudeDelta,
  });
  const [isMapReady, setIsMapReady] = useState(
    false
    // currentLocation?.lat?.toString()?.length > 0 ? true : false,
  );

  useEffect(() => {
    setTimeout(() => {
      setIsMapReady(currentLocation?.lat?.toString()?.length > 0 ? true : false)
    }, 300)
  }, [currentLocation])

  console.log('origin---11', origin, mapRegion);
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
    console.log('Updated region:', region);
    // if (!isWithinBounds(region.latitude, region.longitude)) {
    //   // Recenter map if user tries to go out of bounds
    // mapRef.current?.animateToRegion({
    //   latitude: Number(mapRegion?.latitude) ?? 30.7400,
    //   longitude: Number(mapRegion?.longitude) ?? 76.7900,
    //   latitudeDelta: getMpaDalta().latitudeDelta,
    //   longitudeDelta: getMpaDalta().longitudeDelta,
    // });
    //   Alert.alert("Restricted Area", "You can only explore within Mohali & Chandigarh.");
    // }

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
    },2000); // Delay in milliseconds


  };

  // Update region when origin changes
  useEffect(() => {
    if (origin) {
      currentLocation = origin;
      setMapRegion(prev => ({
        ...prev,
        latitude: origin?.lat
          ? Number(origin?.lat)
          : Number(currentLocation?.lat),
        longitude: origin?.lng
          ? Number(origin?.lng)
          : Number(currentLocation?.lng),
        latitudeDelta: getMpaDalta().latitudeDelta,
        longitudeDelta: getMpaDalta().longitudeDelta,
      }));
    }
  }, [origin,isMapReady]);

  // const onTouchLocationData = useCallback(
  //   coordinate => {
  //     // console.log('coordinate---', coordinate);
  //     if (debounceTimeout.current) {
  //       clearTimeout(debounceTimeout.current);
  //     }
  //     debounceTimeout.current = setTimeout(() => {
  //       if (!isWithinBounds(coordinate.latitude, coordinate.longitude)) {
  //         mapRef.current?.animateToRegion({
  //           latitude: Number(30.7400 ?? coordinate?.latitude) ?? 30.7400,
  //           longitude: Number(76.7900 ?? coordinate?.longitude) ?? 76.7900,
  //           latitudeDelta: getMpaDalta().latitudeDelta,
  //           longitudeDelta: getMpaDalta().longitudeDelta,
  //         });
  //         Alert.alert("Restricted Area", "You can only explore within Mohali & Chandigarh.");
  //       } else {
  //         setMapRegion(prev => ({
  //           ...prev,
  //           latitude: Number(coordinate?.latitude),
  //           longitude: Number(coordinate?.longitude),
  //           latitudeDelta: getMpaDalta().latitudeDelta,
  //           longitudeDelta: getMpaDalta().longitudeDelta,
  //         }));
  //         // handleRegionChangeComplete(coordinate)
  //         onTouchLocation(coordinate);
  //       }
  //     }, 50); // Delay in milliseconds

  //   },
  //   [onTouchLocation],
  // );

  const onTouchLocationData = useCallback(
    coordinate => {
      // console.log('coordinate---', coordinate)

      setMapRegion(prev => ({
        ...prev,
        latitude: Number(coordinate?.latitude),
        longitude: Number(coordinate?.longitude),
        latitudeDelta: getMpaDalta().latitudeDelta,
        longitudeDelta: getMpaDalta().longitudeDelta,
      }));
      // handleRegionChangeComplete(coordinate)
      onTouchLocation(coordinate);

    },
    [onTouchLocation],
  );

  const handleMapReady = () => {
    // console.log('Map is ready');
    if (origin?.lat?.toString()?.length > 0) {
      setTimeout(() => {
        setIsMapReady(true);
      }, 5000);
    } else {
      setTimeout(() => {
        setIsMapReady(true);
      }, 12000);
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
        showsCompass
        onMapReady={handleMapReady}>
        {mapRegion?.latitude?.toString()?.length > 0 &&
          mapRegion?.longitude?.toString()?.length > 0 && (
            <Marker
              coordinate={{
                latitude: Number(mapRegion?.latitude),
                longitude: Number(mapRegion?.longitude),
              }}
              tracksViewChanges={!isMapReady}
              >
              <Image
                resizeMode="contain"
                source={appImages.markerImage}
                style={styles.markerImage}
              />
            </Marker>
          )}
        {/* <Polygon
          coordinates={[
            // { latitude: 30.8258, longitude: 76.6600 }, // NW
            // { latitude: 30.8258, longitude: 76.8500 }, // NE
            // { latitude: 30.6600, longitude: 76.8500 }, // SE
            // { latitude: 30.6600, longitude: 76.6600 }, // SW
            { latitude: 30.8258, longitude: 76.7550 }, // top center
            { latitude: 30.8100, longitude: 76.8050 },
            { latitude: 30.7900, longitude: 76.8350 },
            { latitude: 30.7550, longitude: 76.8500 }, // mid-right
            { latitude: 30.7200, longitude: 76.8350 },
            { latitude: 30.6900, longitude: 76.8050 },
            { latitude: 30.6600, longitude: 76.7550 }, // bottom center
            { latitude: 30.6750, longitude: 76.7100 },
            { latitude: 30.7000, longitude: 76.6800 },
            { latitude: 30.7400, longitude: 76.6600 }, // mid-left
            { latitude: 30.7800, longitude: 76.6800 },
            { latitude: 30.8050, longitude: 76.7100 },
          ]}
          strokeColor={colors.black}
          fillColor="rgba(0, 150, 255, 0)"
          strokeWidth={2}
        /> */}
      </MapView>
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

export default MapLocationRoute;

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

// import React, {useCallback, useEffect, useRef, useState} from 'react';
// import {StyleSheet, View, Image, Platform, Dimensions} from 'react-native';
// import {
//   heightPercentageToDP as hp,
//   widthPercentageToDP as wp,
// } from 'react-native-responsive-screen';
// import {appImages} from '../commons/AppImages';
// import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';

// const {width, height} = Dimensions.get('window');
// const ASPECT_RATIO = width / height;
// const LATITUDE_DELTA = 0.005; // Zoom level (smaller = closer)
// const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

// const MapLocationRoute = ({
//   mapContainerView,
//   origin,
//   isPendingReq,
//   onTouchLocation,
// }) => {
//   const mapRef = useRef(null);
//   const [isMapReady, setIsMapReady] = useState(false);
//   const [mapRegion, setMapRegion] = useState({
//     latitude: origin?.lat ? Number(origin?.lat) : 0,
//     longitude: origin?.lng ? Number(origin?.lng) : 0,
//     latitudeDelta: LATITUDE_DELTA,
//     longitudeDelta: LONGITUDE_DELTA,
//   });

//   // Animate map to origin whenever it changes
//   useEffect(() => {
//     if (origin?.lat && origin?.lng && mapRef?.current) {
//       const newRegion = {
//         latitude: Number(origin.lat),
//         longitude: Number(origin.lng),
//         latitudeDelta: LATITUDE_DELTA,
//         longitudeDelta: LONGITUDE_DELTA,
//       };
//       mapRef.current.animateToRegion(newRegion, 1000); // smooth zoom
//       setMapRegion(newRegion);
//     }
//   }, [origin]);

//   const onTouchLocationData = useCallback(
//     coordinate => {
//       const newRegion = {
//         latitude: Number(coordinate?.latitude),
//         longitude: Number(coordinate?.longitude),
//         latitudeDelta: LATITUDE_DELTA,
//         longitudeDelta: LONGITUDE_DELTA,
//       };
//       if (mapRef.current) {
//         mapRef.current.animateToRegion(newRegion, 1000); // smooth zoom
//       }
//       setMapRegion(newRegion);
//       onTouchLocation(coordinate);
//     },
//     [onTouchLocation],
//   );

//   const handleMapReady = () => {
//     setIsMapReady(true);
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
//         initialRegion={mapRegion} // use initialRegion instead of region
//         zoomTapEnabled
//         rotateEnabled
//         loadingEnabled
//         onMapReady={handleMapReady}
//         onPress={e => onTouchLocationData(e.nativeEvent.coordinate)}
//         onPoiClick={e => onTouchLocationData(e.nativeEvent.coordinate)}
//         showsCompass>
//         {mapRegion?.latitude && mapRegion?.longitude && (
//           <Marker
//             coordinate={{
//               latitude: Number(mapRegion.latitude),
//               longitude: Number(mapRegion.longitude),
//             }}
//             tracksViewChanges={!isMapReady}
//             useLegacyPinView={true}>
//             <Image
//               resizeMode="contain"
//               source={appImages.markerImage}
//               style={styles.markerImage}
//             />
//           </Marker>
//         )}
//       </MapView>
//     </View>
//   );
// };

// export default React.memo(MapLocationRoute);

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
//     height: 30,
//     width: 30,
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

// const {width, height} = Dimensions.get('window');
// const ASPECT_RATIO = width / height;
// const LATITUDE_DELTA = 0.0922;
// const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

// const MapLocationRoute = ({mapContainerView, origin,isPendingReq,onTouchLocation}) => {
//   const mapRef = useRef(null);
//   const [lat, setLat] = useState(origin?.lat ? Number(origin?.lat) : null);
//   const [long, setLong] = useState(
//     origin?.lng ? Number(origin?.lng) :null,
//   );
//   const [delta ,setDelta]=useState({
//     latitudeDelta: LATITUDE_DELTA,
//     longitudeDelta: LONGITUDE_DELTA,
//   })

//   // Update latitude and longitude based on origin
//   useEffect(() => {
//     console.log('origin--',origin);
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

//     const handleRegionChangeComplete = (region) => {
//       console.log("Updated region:", region);
//       setTimeout(()=>{
//         setDelta({
//           latitudeDelta: region?.latitudeDelta,
//           longitudeDelta: region?.longitudeDelta,
//         },5000)
//       })

//     };

//     const onTouchLocationData =(coordinate)=>{
//         setLong(Number(coordinate?.longitude))
//         setLat(Number(coordinate?.latitude))
//         onTouchLocation(coordinate)
//     }

//   return (
//     <View
//       pointerEvents={isPendingReq ? 'none' : 'auto'}
//       style={styles.homeSubContainer}>
//       <MapView
//         provider={PROVIDER_GOOGLE}
//         ref={mapRef}
//         style={[styles.mapContainer, mapContainerView]}
//         zoomEnabled
//         scrollEnabled={false}
//         showsScale
//         mapType={Platform.OS === 'ios' ? 'mutedStandard' : 'terrain'}
//         region={region}
//         zoomTapEnabled
//         rotateEnabled
//         loadingEnabled
//         onRegionChangeComplete={handleRegionChangeComplete} // Listen for zoom changes
//         onPress={(e) =>{
//            console.log('e.nativeEvent',e.nativeEvent)
//            const coordinate =e.nativeEvent?.coordinate
//             onTouchLocationData(coordinate)
//       }}

//       onPoiClick={(e) =>{
//         console.log('e.nativeEvent onPoiClick',e.nativeEvent)
//         const coordinate =e.nativeEvent?.coordinate
//         onTouchLocationData(coordinate)
//    }}
//   //  onPanDrag={(e) =>{
//   //       console.log('e.nativeEvent onPanDrag',e.nativeEvent)
//   //       const coordinate =e.nativeEvent?.coordinate
//   //       setTimeout(()=>{
//   //         setLong(Number(coordinate?.longitude))
//   //         setLat(Number(coordinate?.latitude))
//   //       },500)
//   //  }}

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
//       </MapView>
//     </View>
//   );
// };

// export default MapLocationRoute;

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
// });
