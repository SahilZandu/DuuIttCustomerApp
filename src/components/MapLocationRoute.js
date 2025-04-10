import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {StyleSheet, View, Image, Platform, Dimensions} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {appImages} from '../commons/AppImages';
import MapView, {Marker, Polyline, PROVIDER_GOOGLE} from 'react-native-maps';

const {width, height} = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const MapLocationRoute = ({
  mapContainerView,
  origin,
  isPendingReq,
  onTouchLocation,
}) => {
  const mapRef = useRef(null);
  const [mapRegion, setMapRegion] = useState({
    latitude: origin?.lat ? Number(origin?.lat) : 0,
    longitude: origin?.lng ? Number(origin?.lng) : 0,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA,
  });

  // Update region when origin changes
  useEffect(() => {
    if (origin?.lat && origin?.lng) {
      setMapRegion(prev => ({
        ...prev,
        latitude: Number(origin?.lat),
        longitude: Number(origin?.lng),
      }));
    }
  }, [origin]);

  const handleRegionChangeComplete = useCallback(region => {
    setMapRegion(region);
  }, []);

  const onTouchLocationData = useCallback(
    coordinate => {
      setMapRegion(prev => ({
        ...prev,
        latitude: Number(coordinate?.latitude),
        longitude: Number(coordinate?.longitude),
      }));
      onTouchLocation(coordinate);
    },
    [onTouchLocation],
  );

  // Memoize marker component
  const OriginMarker = useMemo(() => {
    if (!origin?.lat || !origin?.lng) return null;

    return (
      <Marker
        coordinate={{
          latitude: Number(origin.lat),
          longitude: Number(origin.lng),
        }}
        useLegacyPinView={true}
        tracksViewChanges={true}>
        <Image
          resizeMode="contain"
          source={appImages.markerImage}
          style={styles.markerImage}
        />
      </Marker>
    );
  }, [origin?.lat, origin?.lng]);

  return (
    <View
      pointerEvents={isPendingReq ? 'none' : 'auto'}
      style={styles.homeSubContainer}>
      <MapView
        provider={PROVIDER_GOOGLE}
        ref={mapRef}
        style={[styles.mapContainer, mapContainerView]}
        zoomEnabled
        scrollEnabled={false}
        showsScale
        mapType={Platform.OS === 'ios' ? 'mutedStandard' : 'terrain'}
        region={mapRegion}
        zoomTapEnabled
        rotateEnabled
        loadingEnabled
        onRegionChangeComplete={handleRegionChangeComplete}
        onPress={e => onTouchLocationData(e.nativeEvent.coordinate)}
        onPoiClick={e => onTouchLocationData(e.nativeEvent.coordinate)}
        showsCompass>
        {OriginMarker}
      </MapView>
    </View>
  );
};

export default React.memo(MapLocationRoute);

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
