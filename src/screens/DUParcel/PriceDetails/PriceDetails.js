// import React, {useEffect, useState, useRef, useCallback} from 'react';
// import {
//   Text,
//   TouchableOpacity,
//   View,
//   Image,
//   Dimensions,
//   KeyboardAvoidingView,
//   Platform,
// } from 'react-native';
// import {appImages, appImagesSvg} from '../../../commons/AppImages';
// import {styles} from './styles';
// import {SvgXml} from 'react-native-svg';
// import {
//   heightPercentageToDP as hp,
//   widthPercentageToDP as wp,
// } from 'react-native-responsive-screen';
// import {RFValue} from 'react-native-responsive-fontsize';
// import {fonts} from '../../../theme/fonts/fonts';
// import {colors} from '../../../theme/colors';
// import ChangeRoute from '../../../components/ChangeRoute';
// import AppInputScroll from '../../../halpers/AppInputScroll';
// import handleAndroidBackButton from '../../../halpers/handleAndroidBackButton';
// import {useFocusEffect} from '@react-navigation/native';
// import DashboardHeader2 from '../../../components/header/DashboardHeader2';
// import MapView, {
//   Marker,
//   Callout,
//   PROVIDER_GOOGLE,
//   Polyline,
// } from 'react-native-maps';
// import Geolocation from 'react-native-geolocation-service';
// import Poly from '@mapbox/polyline';
// import {currencyFormat} from '../../../halpers/currencyFormat';
// import PickDropComp from '../../../components/PickDropComp';
// import {Surface} from 'react-native-paper';
// import TrackingOrderCard from '../../../components/TrackingOrderCard';
// import Spacer from '../../../halpers/Spacer';
// import {homeCS} from '../../../stores/DummyData/Home';
// import ChangeRoute2 from '../../../components/ChangeRoute2';
// import SearchTextIcon from '../../../components/SearchTextIcon';

// const {width, height} = Dimensions.get('window');
// const ASPECT_RATIO = width / height;
// const LATITUDE_DELTA = 0.0922;
// const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

//let destination = {lat: 30.7145, lng: 76.7149};

// export default function ParcelHome({navigation}) {
//   const mapRef = useRef(null);
//   const [lat, setlat] = useState(30.7076);
//   const [long, setlong] = useState(76.715126);
//   const [destinationLocation, setDestinationLocation] = useState();
//   const [originLoactaion, setOriginLocation] = useState();
//   const [loading, setLoading] = useState(true);
//   const [coords, setcoords] = useState([]);
//   const [mapCoords, setMapCoords] = useState([]);
//   const [routesCount, setRouteCount] = useState(3);
//   const [changeRouteColor, setRouteColor] = useState(-1);

//   useFocusEffect(
//     useCallback(() => {
//       handleAndroidBackButton();
//       getLocationCurrent();
//     }, []),
//   );

//   const fitTocord1 = {
//     top: hp('5%'),
//     right: hp('10%'),
//     bottom: routesCount == 2 ? hp('45%') : hp('45%'),
//     left: hp('10%'),
//   };

//   const postionerror = error => {
//     if (error.code == 1) {
//       console.log('postionerror', error);
//     }
//   };

//   const getLocationCurrent = () => {
//     Geolocation.getCurrentPosition(
//       coords => {
//         // setMapheading(coords?.heading ? coords?.heading : 0);
//         const lat1 = coords?.coords?.latitude;
//         setlat(coords?.coords?.latitude);
//         const long1 = coords?.coords?.longitude;
//         setlong(coords?.coords?.longitude);
//         const originLocataion = {
//           latitude: coords?.coords?.latitude,
//           longitude: coords?.coords?.longitude,
//         };
//         setOriginLocation(originLocataion);

//         getInitialDirections(originLocataion);
//       },
//       error => {
//         postionerror(error);
//       },
//       {
//         timeout: 20000,
//         showLocationDialog: true,
//         forceRequestLocation: true,
//         enableHighAccuracy: true,
//       },
//     );
//   };

//   const getInitialDirections = async originLocataion => {
//     const destinationLoaction = {
//       latitude: Number(destination.lat),
//       longitude: Number(destination.lng),
//     };

//     // await setDestinationLocation(destinationLoaction);
//     // await GetMultipleRoutes(originLocataion, destinationLoaction);
//   };

//   const GetMultipleRoutes = (originLoactaion, destinationLoaction) => {
//     console.log('originLoactaion', originLoactaion, destinationLoaction);

//     const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${[
//       originLoactaion?.latitude,
//       originLoactaion?.longitude,
//     ]}&destination=${[
//       destinationLoaction?.latitude,
//       destinationLoaction?.longitude,
//     ]}&key=AIzaSyAd2Y8Aprbva2a9eGaJu_wpjekXQjmhtmU&sensor=false&alternatives=true`;
//     fetch(url)
//       .then(response => response?.json())
//       .then(data => {
//         console.log('dataaMultiple', data);
//         if (data?.status === 'OK') {
//           tempRoutes = data.routes;
//           setRouteCount(data?.routes?.length);

//           let getCorrds = [];
//           for (let i = 0; i < data?.routes?.length; i++) {
//             let array = Poly?.decode(
//               data?.routes[i]?.overview_polyline?.points,
//             );
//             let myCoords = array?.map(point => ({
//               latitude: point[0],
//               longitude: point[1],
//             }));
//             getCorrds.push(myCoords);
//           }
//           console.log('get cords:---', getCorrds);

//           setcoords(getCorrds);
//           CheckRoute(0);
//           setRouteColor(0);

//           calculateMapCoords(0, getCorrds);

//           if (data?.routes?.length == 1) {
//             let changeRouteColor = 0;
//             let lat = originLoactaion?.latitude;
//             let long = originLoactaion?.longitude;
//             // navigation.navigate('routeOrgs', {
//             //   destinationLocation: destinationLoaction,
//             //   changeRouteColor,
//             //   lat,
//             //   long,
//             //   serachByRes: false,
//             //   source,
//             //   des,
//             // });
//             setTimeout(() => {
//               CoordinatesValue(
//                 originLoactaion,
//                 destinationLoaction,
//                 fitTocord1,
//                 true,
//               );
//             }, 100);

//             setLoading(false);
//           } else {
//             setStokeUpdate(true);
//             setLoading(false);
//             setTimeout(() => {
//               CoordinatesValue(
//                 originLoactaion,
//                 destinationLoaction,
//                 fitTocord1,
//                 true,
//               );
//             }, 1000);
//           }
//         } else {
//           console.error('Error calculating route:', data.status);
//         }
//       })
//       .catch(error => console.error('Error calculating route:', error));
//   };

//   const calculateMapCoords = (index, array) => {
//     const newData = [...array];
//     const objectToMove = newData.splice(index, 1)[0];
//     newData.push(objectToMove);
//     setMapCoords(newData);
//   };

//   const CoordinatesValue = async (
//     originLoactaion,
//     destinationLoaction,
//     fitPadding,
//     animated,
//   ) => {
//     await mapRef?.current?.fitToCoordinates(
//       [
//         {
//           latitude: originLoactaion && originLoactaion?.latitude,
//           longitude: originLoactaion && originLoactaion?.longitude,
//         },
//         {
//           latitude: destinationLoaction && destinationLoaction?.latitude,
//           longitude: destinationLoaction && destinationLoaction?.longitude,
//         },
//       ],
//       {
//         edgePadding: {
//           top: hp('4%'),
//           right: hp('5%'),
//           bottom: hp('10%'),
//           left: hp('5%'),
//         },
//         animated: animated,
//       },
//     );
//   };

//   const CheckRoute = async index => {
//     if (setRouteColor !== index) {
//       await setChooseRoute(true);
//       await setLocationPoints([]);
//     } else {
//       await setChooseRoute(false);
//       await setLocationPoints([]);
//     }
//   };

//   const getStoreColor = index => {
//     return index === coords?.length - 1 ? '#196F3D' : '#909497';
//   };

//   const calculateRegion = coords => {
//     if (coords && coords?.length != 0) {
//       let minLat = 90;
//       let maxLat = -90;
//       let minLon = 180;
//       let maxLon = -180;

//       coords?.forEach(coord => {
//         coord.forEach(cc => {
//           minLat = Math.min(minLat, cc.latitude);
//           maxLat = Math.max(maxLat, cc.latitude);
//           minLon = Math.min(minLon, cc.longitude);
//           maxLon = Math.max(maxLon, cc.longitude);
//         });
//       });

//       let logicDelta = 0.055555;

//       const latitudeDelta = maxLat - minLat + logicDelta;
//       const longitudeDelta = maxLon - minLon + logicDelta;

//       return {
//         latitude: (maxLat + minLat) / 2,
//         longitude: (maxLon + minLon) / 2,
//         latitudeDelta,
//         longitudeDelta,
//       };
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <DashboardHeader2
//         navigation={navigation}
//         onPress={() => {
//           navigation.goBack();
//         }}
//       />

//       <View style={styles.homeSubContainer}>
//         {/* {lat && long && coords && coords?.length > 0 ? ( */}
//         <MapView
//           provider={PROVIDER_GOOGLE}
//           ref={mapRef}
//           style={[
//             styles.mapContainer,
//             // {width: wp('100%'), height: hp('55%')}
//           ]}
//           zoomEnabled={true}
//           scrollEnabled={true}
//           showsScale={true}
//           mapType={Platform.OS == 'ios' ? 'mutedStandard' : 'terrain'}
//           paddingAdjustmentBehavior={'automatic'}
//           // region={calculateRegion(coords)}
//           region={{
//             latitude: lat,
//             longitude: long,
//             latitudeDelta: LATITUDE_DELTA,
//             longitudeDelta: LONGITUDE_DELTA,
//           }}
//           //   onRegionChangeComplete={() =>
//           //   CoordinatesValue(originLoactaion, destinationLocation)
//           // }
//           zoomTapEnabled={true}
//           rotateEnabled={true}
//           loadingEnabled={true}
//           showsCompass={true}>
//           <Marker coordinate={{latitude: lat, longitude: long}}>
//             <Image
//               resizeMode="contain"
//               source={appImages.markerImage}
//               style={styles.markerImage}
//             />
//           </Marker>

//           {/* {mapCoords &&
//             mapCoords?.length != 0 &&
//             mapCoords?.map((item, index) => (
//               <MapView.Polyline
//                 key={index}
//                 coordinates={item}
//                 strokeWidth={8}
//                 strokeColor={getStoreColor(index)}
//                 tappable={true}
//                 onPress={() => {
//                   // setStokeUpdate(false);
//                   // CheckRoute(index);
//                   // setRouteColor(index);
//                   // // setselectRouteUpdate(false)
//                   // setTimeout(() => {
//                   //   // setselectRouteUpdate(true)
//                   //   setStokeUpdate(true);
//                   //   CoordinatesValue(
//                   //     originLoactaion,
//                   //     destinationLocation,
//                   //     fitTocord1,
//                   //     false,
//                   //   );
//                   // }, 1);
//                 }}
//               />
//             ))} */}
//           {/* <Polyline
//                       coordinates={[
//                         {latitude: lat, longitude: long},
//                         // {latitude:destinationLocation?.latitude, longitude:destinationLocation?.longitude},
//                         {latitude: 30.6736, longitude: 76.7403},
//                       ]}
//                       strokeColor="#28B056" // fallback for when `strokeColors` is not supported by the map-provider
//                       strokeColors={['#28B056', '#28B056']}
//                       strokeWidth={3}
//                     /> */}

//              {!destinationLocation !== undefined ? (
//             <>
//               <Marker coordinate={{latitude: 30.6736, longitude: 76.7403}}>
//                 {/* <Marker coordinate={destinationLocation} > */}
//                 <Image
//                   resizeMode="contain"
//                   source={appImages.markerImage}
//                   style={styles.markerImage}
//                 />
//               </Marker>
//             </>
//           ) : null}
//         </MapView>
//         {/* ) : (
//                 <View>
//                 <Text>Hello</Text>
//                 </View>
//               )} */}
//       </View>

//        <SearchTextIcon title={'Enter pick up or send location'} onPress={()=>{navigation.navigate('setLocationHistory')}}/>
//       <View style={{backgroundColor: colors.white, marginTop: '2%'}}>
//         <AppInputScroll
//           padding={true}
//           Pb={'100%'}
//           keyboardShouldPersistTaps={'handled'}>
//           <View style={{marginTop: '4%', marginHorizontal: 20}}>
//             <Text
//               style={{
//                 fontSize: RFValue(13),
//                 fontFamily: fonts.medium,
//                 color: colors.black,
//               }}>
//               {'Your last Order'}
//             </Text>

//             <TrackingOrderCard
//               value={{
//                 trackingId: 'N8881765',
//                 price: 450,
//                 pickup: 'Phase 5, Sector 59, Sahibzada Ajit... ',
//                 drop: 'TDI TAJ PLAZA Block-505',
//                 date: '04 JUL, 2024',
//               }}
//             />

//             <View
//               style={{
//                 justifyContent: 'center',
//                 alignItems: 'center',
//                 marginTop: '6%',
//               }}>
//               <Image
//                 resizeMode="stretch"
//                 style={{width: wp('90%'), height: hp('18%')}}
//                 source={appImages.parcelHomeImage}
//               />
//             </View>
//             <ChangeRoute2
//               data={homeCS}
//               navigation={navigation}
//               route={'PARCEL'}
//             />
//           </View>
//         </AppInputScroll>
//       </View>
//     </View>
//   );
// }



















import React, {useCallback} from 'react';
import {
  View,
} from 'react-native';
import {styles} from './styles';
import handleAndroidBackButton from '../../../halpers/handleAndroidBackButton';
import {useFocusEffect} from '@react-navigation/native';
import Header from '../../../components/header/Header';
import PriceDetailsForm from '../../../forms/PriceDetailsForm';



export default function PriceDetails({navigation}) {
  useFocusEffect(
    useCallback(() => {
      handleAndroidBackButton(navigation);
    },[]),
  );


  return (
    <View style={styles.container}>
      <Header 
      title={'Parcel Details'}
      backArrow={true}
      onPress={() => {
        navigation.goBack();
      }}/>
       <PriceDetailsForm navigation={navigation} />
    </View>
  ); 
}
