

// h-3 polygon it's working code 

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, View, Image, Platform, Alert, Button } from 'react-native';
import MapView, { Polygon, PROVIDER_GOOGLE } from 'react-native-maps';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { appImages } from '../commons/AppImages';
import { getMpaDalta, setMpaDalta } from './GeoCodeAddress';
import AnimatedLoader from './AnimatedLoader/AnimatedLoader';
import { colors } from '../theme/colors';
import * as h3 from "h3-js";
import { findPolygonForPoint, getCurrentLocation } from './GetAppLocation';
import { rootStore } from '../stores/rootStore';
import PopUpH3Location from './appPopUp/PopUpH3Location';
import { DuuittMapTheme } from './DuuittMapTheme';

// Constants outside component to prevent recreation
const DEFAULT_REGION = {
  latitude: 30.4766,
  longitude: 76.5905,
  latitudeDelta: 0.0322,
  longitudeDelta: 0.0322,
};

const MOHALI_CHD_BOUNDS = {
  north: 30.8258,
  south: 30.6600,
  west: 76.6600,
  east: 76.8500,
};

const MapLocationRoute = React.memo(({
  mapContainerView,
  origin,
  isPendingReq,
  onTouchLocation,
  height,
  onCheckLocation,
}) => {
  const getLocation = type => {
    let d =
      type == 'lat'
        ? getCurrentLocation()?.latitude
        : getCurrentLocation()?.longitude;

    return d ? d : '';
  };
  const mapRef = useRef(null);
  const debounceTimeout = useRef(null);
  const lastRegionRef = useRef(null);
  const { geth3Polygons, h3PolyData } = rootStore.orderStore
  const [isMapReady, setIsMapReady] = useState(false);
  const [hexagons, setHexagons] = useState([]);
  const [mode, setMode] = useState('single'); // 'single', 'grid', 'polygon', 'multi'
  const [polygonArray, setPolygonArray] = useState(h3PolyData ?? [])
  const [isNotService, setIsNotService] = useState(false)


  useEffect(() => {
    if (h3PolyData?.length > 0) {
      setPolygonArray(h3PolyData)
    } else {
      getH3PolygonData()
    }
  }, [h3PolyData])


  const getH3PolygonData = async () => {

    const resH3 = await geth3Polygons();

    console.log("resH3--- getH3PolygonData", resH3);
    setPolygonArray(resH3)

  }

  // Memoized map region
  const mapRegion = useMemo(() => {
    if (origin?.lat && origin?.lng) {
      const newRegion = {
        latitude: Number(origin?.lat),
        longitude: Number(origin?.lng),
        ...getMpaDalta(),
      };
      if (mapRef?.current && newRegion?.latitude) {
        mapRef.current?.animateToRegion(newRegion, 1000);
      }
      return {
        latitude: Number(origin.lat),
        longitude: Number(origin.lng),
        ...getMpaDalta(),
      };
    }
    return {
      latitude: getLocation('lat') || 30.4766,
      longitude: getLocation('lng') || 76.5905,
      latitudeDelta: 0.0322,
      longitudeDelta: 0.0322,
    }
    // return DEFAULT_REGION;

  }, [origin?.lat, origin?.lng]);

  // 1. Single Hexagon
  const generateSingleHexagon = useCallback((latitude, longitude) => {
    try {
      const resolution = 8;
      const h3Index = h3.latLngToCell(latitude, longitude, resolution);
      const hexBoundary = h3.cellToBoundary(h3Index);

      const coordinates = hexBoundary.map(([lat, lng]) => ({
        latitude: lat,
        longitude: lng,
      }));

      if (coordinates.length > 0) {
        coordinates.push(coordinates[0]);
      }

      return [coordinates];
    } catch (error) {
      console.error("Error generating single hexagon:", error);
      return [];
    }
  }, []);

  // Memoized bounds check function
  // const isWithinBounds = useCallback((latitude, longitude) => {

  //   return (
  //     latitude <= MOHALI_CHD_BOUNDS.north &&
  //     latitude >= MOHALI_CHD_BOUNDS.south &&
  //     longitude >= MOHALI_CHD_BOUNDS.west &&
  //     longitude <= MOHALI_CHD_BOUNDS.east
  //   );
  // }, []);

  const POLYGON_BOUNDARY = [
    [30.7981, 76.6526],
    [30.7933, 76.6530],
    [30.7912, 76.6583],
    [30.7941, 76.6632],
    [30.7989, 76.6627],
    [30.8010, 76.6574]
  ];


  function isWithinBounds(lat, lng, polygon) {
    let inside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const xi = polygon[i][0], yi = polygon[i][1];
      const xj = polygon[j][0], yj = polygon[j][1];

      const intersect =
        yi > lng !== yj > lng &&
        lat < ((xj - xi) * (lng - yi)) / (yj - yi) + xi;
      if (intersect) inside = !inside;
    }
    return inside;
  }



  function getPolygonCenter(polygon) {
    let latSum = 0;
    let lngSum = 0;

    polygon.forEach(([lat, lng]) => {
      latSum += lat;
      lngSum += lng;
    });

    const centerLat = latSum / polygon.length;
    const centerLng = lngSum / polygon.length;

    return [centerLat, centerLng];
  }

  // 2. Grid Disk (Concentric Hexagons)
  const generateGridDisk = useCallback((latitude, longitude) => {
    try {
      const resolution = 8;
      const centerHex = h3.latLngToCell(latitude, longitude, resolution);

      // Get all neighbors within 1 step (7 hexagons total including center)
      const diskHexagons = h3.gridDisk(centerHex, 1);

      const allHexagons = [];

      diskHexagons.forEach(hex => {
        const hexBoundary = h3.cellToBoundary(hex);
        const coordinates = hexBoundary.map(([lat, lng]) => ({
          latitude: lat,
          longitude: lng,
        }));

        if (coordinates.length > 0) {
          coordinates.push(coordinates[0]);
        }

        allHexagons.push(coordinates);
      });

      return allHexagons;
    } catch (error) {
      console.error("Error generating grid disk:", error);
      return [];
    }
  }, []);

  // 3. Polygon to Hexagons (Fill Area)
  const generatePolygonHexagons = useCallback(() => {
    try {
      // Define your polygon coordinates [lat, lng]
      const polygon = [
        [30.7981, 76.6526],
        [30.7933, 76.6530],
        [30.7912, 76.6583],
        [30.7941, 76.6632],
        [30.7989, 76.6627],
        [30.8010, 76.6574]
      ];

      const resolution = 8;
      const hexagonIndexes = h3.polygonToCells(polygon, resolution);

      const allHexagons = [];

      hexagonIndexes?.forEach(hex => {
        const hexBoundary = h3.cellToBoundary(hex);
        const coordinates = hexBoundary?.map(([lat, lng]) => ({
          latitude: lat,
          longitude: lng,
        }));

        if (coordinates.length > 0) {
          coordinates.push(coordinates[0]);
        }

        allHexagons.push(coordinates);
      });

      return allHexagons;
    } catch (error) {
      console.error("Error generating polygon hexagons:", error);
      return [];
    }
  }, []);

  // 4. MultiPolygon from Hexagons (Outline)
  const generateMultiPolygon = useCallback((latitude, longitude) => {
    try {
      const resolution = 8;
      const centerHex = h3.latLngToCell(latitude, longitude, resolution);
      const diskHexagons = h3.gridDisk(centerHex, 1);

      // Get the outline of the set of hexagons as MultiPolygon
      const multiPolygon = h3.cellsToMultiPolygon(diskHexagons, true);

      const allPolygons = [];

      multiPolygon?.forEach(polygon => {
        polygon?.forEach(ring => {
          const coordinates = ring?.map(([lng, lat]) => ({
            latitude: lat,
            longitude: lng,
          }));

          if (coordinates.length > 0) {
            coordinates.push(coordinates[0]); // Close the polygon
            allPolygons.push(coordinates);
          }
        });
      });

      return allPolygons;
    } catch (error) {
      console.error("Error generating multipolygon:", error);
      return [];
    }
  }, []);

  // Main function to generate hexagons based on mode
  const generateHexagons = useCallback((latitude, longitude) => {
    switch (mode) {
      case 'single':
        return generateSingleHexagon(latitude, longitude);
      case 'grid':
        return generateGridDisk(latitude, longitude);
      case 'polygon':
        return generatePolygonHexagons();
      case 'multi':
        return generateMultiPolygon(latitude, longitude);
      default:
        return generateSingleHexagon(latitude, longitude);
    }
  }, [mode, generateSingleHexagon, generateGridDisk, generatePolygonHexagons, generateMultiPolygon]);

  const handleRegionChangeComplete = useCallback((region) => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(() => {
      if (!region) return;

      const currentLat = Number(region?.latitude);
      const currentLng = Number(region?.longitude);

      const lastLat = Number(lastRegionRef.current?.latitude ?? 0);
      const lastLng = Number(lastRegionRef.current?.longitude ?? 0);

      const latDiff = Math.abs(currentLat - lastLat);
      const lngDiff = Math.abs(currentLng - lastLng);

      // Generate hexagons based on current mode
      // const newHexagons = generateHexagons(currentLat, currentLng);
      // setHexagons(newHexagons);

      // Optional bounds check
      // console.log("isWithinBound111", isWithinBounds(
      //   region?.latitude, region?.longitude,
      //   POLYGON_BOUNDARY));

      const matchedPolygon = findPolygonForPoint(region?.latitude, region?.longitude, polygonArray);

      if (matchedPolygon) {
        console.log("Point belongs to polygon:", matchedPolygon?.name);
        // Alert.alert(
        //   "Service Available",
        //   "Waah! We currently  service this pickup or drop location."
        // );
        setIsNotService(false);
        onCheckLocation(false);

      } else {
        console.log("Point is outside all polygons");
        if (isNotService !== true) {
          setIsNotService(true)
        }
        onCheckLocation(true)
        // Alert.alert(
        //   "Service Not Available",
        //   "Oops! We currently don't service this pickup or drop location. Please select a different location within our service area."
        // );

      }

      // if (!isWithinBounds(region?.latitude, region?.longitude, POLYGON_BOUNDARY)) {
      //   Alert.alert(
      //     "Service Not Available",
      //     "Oops! We currently don't service this pickup or drop location. Please select a different location within our service area."
      //   );
      //   const [centerLat, centerLng] = getPolygonCenter(POLYGON_BOUNDARY)
      //   const fallbackRegion = {
      //     latitude: centerLat ?? 30.7400,
      //     longitude: centerLng ?? 76.7900,
      //     ...getMpaDalta(),
      //   };
      //   mapRef.current?.animateToRegion(fallbackRegion, 1000);
      // }

      if (latDiff > 0.0001 || lngDiff > 0.0001) {
        lastRegionRef.current = region;
        onCheckLocation(true);
        onTouchLocation({
          latitude: currentLat,
          longitude: currentLng,
        });
      }

    }, Platform.OS === 'ios' ? 100 : 300);
    return (
      () => {
        if (debounceTimeout.current) {
          clearTimeout(debounceTimeout.current);
        }
      }
    )
  }, [onTouchLocation]);

  // Generate initial hexagons
  useEffect(() => {
    if (mapRegion.latitude && mapRegion.longitude) {
      const newHexagons = generateHexagons(mapRegion.latitude, mapRegion.longitude);
      console.log("newHexagons===", newHexagons);
      setHexagons(newHexagons);
    }
  }, [mapRegion, generateHexagons]);

  // Optimized map ready handler
  const handleMapReady = useCallback(() => {
    setIsMapReady(true);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, []);

  const onRegionChange = (region) => {
    setMpaDalta(region);
    onCheckLocation(false);
  }

  // Memoized map props
  const mapProps = useMemo(() => ({
    provider: PROVIDER_GOOGLE,
    style: [styles.mapContainer, mapContainerView],
    initialRegion: mapRegion,
    mapType: Platform.OS === 'ios' ? 'standard' : 'standard',
    customMapStyle: DuuittMapTheme,
    showsCompass: false,
    loadingEnabled: true,
    zoomEnabled: true,
    scrollEnabled: true,
    rotateEnabled: false,
    zoomTapEnabled: true,
    minZoomLevel: 10,
    maxZoomLevel: 18,
    showsUserLocation: true,
    followsUserLocation: true,
    showsBuildings: false,
    showsTraffic: false,
    showsIndoors: false,
    showsMyLocationButton: false,
    toolbarEnabled: false,
    onRegionChange: onRegionChange,
    // onRegionChange: (e) => {
    //   setMpaDalta(e)
    //   // onCheckLocation(false)
    // },
    onRegionChangeComplete: handleRegionChangeComplete,
    onMapReady: handleMapReady,
  }), [mapRegion, mapContainerView, handleRegionChangeComplete, handleMapReady, onRegionChange]);

  // Render hexagons with different styles based on mode
  const renderHexagons = useMemo(() => {
    return hexagons?.map((hexagonCoords, index) => (
      <Polygon
        key={index}
        coordinates={hexagonCoords}
        // strokeColor={
        //   mode === 'single' ? colors.primary :
        //     mode === 'grid' ? colors.secondary :
        //       mode === 'polygon' ? colors.accent :
        //         colors.success
        // }
        fillColor={
          mode === 'single' ? 'rgba(0, 150, 255, 0.3)' :
            mode === 'grid' ? 'rgba(255, 150, 0, 0.2)' :
              mode === 'polygon' ? 'rgba(150, 255, 0, 0.2)' :
                'rgba(255, 0, 150, 0.1)'
        }
        strokeWidth={mode === 'multi' ? 3 : 2}
      />
    ));
  }, [hexagons, mode]);

  // Memoized center marker
  const centerMarker = useMemo(() => (
    isMapReady && (
      <Image
        source={appImages.pickMap
          // markerImage
        }
        style={styles.centerMarker}
        resizeMode="contain"
      />
    )
  ), [isMapReady]);

  // Memoized loader
  const loader = useMemo(() => (
    !isMapReady && (
      <AnimatedLoader
        absolute="relative"
        type="homeMapLoader"
        height={height}
      />
    )
  ), [isMapReady, height]);

  return (
    <View
      pointerEvents={isPendingReq ? 'none' : 'auto'}
      style={styles.homeSubContainer}
    >
      <MapView ref={mapRef} {...mapProps} >
        {/* {renderHexagons} */}
      </MapView>
      {centerMarker}
      {loader}

      {/* Mode selector buttons */}
      {/* <View style={styles.modeSelector}>
        <Button title="Single" onPress={() => setMode('single')} color={mode === 'single' ? 'blue' : 'gray'} />
        <Button title="Grid" onPress={() => setMode('grid')} color={mode === 'grid' ? 'blue' : 'gray'} />
        <Button title="Polygon" onPress={() => setMode('polygon')} color={mode === 'polygon' ? 'blue' : 'gray'} />
        <Button title="Multi" onPress={() => setMode('multi')} color={mode === 'multi' ? 'blue' : 'gray'} />
      </View> */}
      <PopUpH3Location
        topIcon={false}
        CTATitle={'ok'}
        visible={isNotService}
        type={'Error'}
        onClose={() => setIsNotService(false)}
        title={"Service Not Available"}
        text={
          "Oops! We currently don't service this pickup or drop location. Please select a different location within our service area."
        }
      />
    </View>
  );
});

MapLocationRoute.displayName = 'MapLocationRoute';

export default MapLocationRoute;

const styles = StyleSheet.create({
  homeSubContainer: {
    alignItems: 'flex-start',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  mapContainer: {
    alignSelf: 'center',
    height: hp('35%'),
    width: wp('100%'),
  },
  centerMarker: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -15,
    marginTop: Platform.OS == 'ios' ? '-15%' : '-10%',
    height: 35,
    width: 32,
    zIndex: 999,
  },
  modeSelector: {
    position: 'absolute',
    top: 80,
    right: 10,
    backgroundColor: 'white',
    padding: 5,
    borderRadius: 5,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 5,
  },
});






// Try Working Code  without h-3 polygon

// import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
// import { StyleSheet, View, Image, Platform, Alert } from 'react-native';
// import MapView, { Polygon, PROVIDER_GOOGLE } from 'react-native-maps';
// import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
// import { appImages } from '../commons/AppImages';
// import { getMpaDalta, setMpaDalta } from './GeoCodeAddress';
// import AnimatedLoader from './AnimatedLoader/AnimatedLoader';
// import { colors } from '../theme/colors';

// // Constants outside component to prevent recreation
// const DEFAULT_REGION = {
//   latitude: 30.7400,
//   longitude: 76.7900,
//   latitudeDelta: 0.0322,
//   longitudeDelta: 0.0322,
// };

// const MOHALI_CHD_BOUNDS = {
//   north: 30.8258,
//   south: 30.6600,
//   west: 76.6600,
//   east: 76.8500,
// };

// const MapLocationRoute = React.memo(({
//   mapContainerView,
//   origin,
//   isPendingReq,
//   onTouchLocation,
//   height,
// }) => {
//   const mapRef = useRef(null);
//   const debounceTimeout = useRef(null);
//   const [isMapReady, setIsMapReady] = useState(false);
//   const lastRegionRef = useRef(null);
//   // Memoized map region to prevent unnecessary re-renders
//   const mapRegion = useMemo(() => {
//     if (origin?.lat && origin?.lng) {
//       const newRegion = {
//         latitude: Number(origin?.lat),
//         longitude: Number(origin?.lng),
//         ...getMpaDalta(),
//       };
//       if (mapRef?.current && newRegion?.latitude) {
//         mapRef.current?.animateToRegion(newRegion, 1000);
//       }
//       return {
//         latitude: Number(origin.lat),
//         longitude: Number(origin.lng),
//         ...getMpaDalta(),
//       };
//     }
//     return DEFAULT_REGION;
//   }, [origin?.lat, origin?.lng]);

//   // Memoized bounds check function
//   const isWithinBounds = useCallback((latitude, longitude) => {
//     return (
//       latitude <= MOHALI_CHD_BOUNDS.north &&
//       latitude >= MOHALI_CHD_BOUNDS.south &&
//       longitude >= MOHALI_CHD_BOUNDS.west &&
//       longitude <= MOHALI_CHD_BOUNDS.east
//     );
//   }, []);



//   // Keep last region in a ref to compare properly

//   const handleRegionChangeComplete = useCallback((region) => {
//     if (debounceTimeout.current) {
//       clearTimeout(debounceTimeout.current);
//     }

//     debounceTimeout.current = setTimeout(() => {
//       if (!region) return;

//       const currentLat = Number(region.latitude);
//       const currentLng = Number(region.longitude);

//       const lastLat = Number(lastRegionRef.current?.latitude ?? 0);
//       const lastLng = Number(lastRegionRef.current?.longitude ?? 0);

//       const latDiff = Math.abs(currentLat - lastLat);
//       const lngDiff = Math.abs(currentLng - lastLng);

//       //     // Optional bounds check
//       // if (!isWithinBounds(region?.latitude, region?.longitude)) {
//       //   Alert.alert("Restricted Area", "You can only explore within Mohali & Chandigarh.");
//       //   const fallbackRegion = {
//       //     latitude: 30.7400,
//       //     longitude: 76.7900,
//       //     ...getMpaDalta(),
//       //   };
//       //   mapRef.current?.animateToRegion(fallbackRegion, 1000);
//       // }

//       // Only trigger if moved more than threshold
//       if (latDiff > 0.0001 || lngDiff > 0.0001) {
//         lastRegionRef.current = region; // update last region
//         onTouchLocation({
//           latitude: currentLat,
//           longitude: currentLng,
//         });
//       }
//     }, Platform.OS === 'ios' ? 100 : 300);
//   }, [onTouchLocation]);


//   // Optimized region change handler with debouncing
//   // const handleRegionChangeComplete = useCallback((region) => {
//   //   if (debounceTimeout.current) {
//   //     clearTimeout(debounceTimeout.current);
//   //   }

//   //   debounceTimeout.current = setTimeout(() => {
//   //     // Only update if region actually changed significantly
//   //     const latDiff = Math.abs(region?.latitude ?? 0 - mapRegion?.latitude ?? 0);
//   //     const lngDiff = Math.abs(region?.longitude ?? 0 - mapRegion?.longitude ?? 0);

//   //     // Optional bounds check
//   //     // if (!isWithinBounds(region?.latitude, region?.longitude)) {
//   //     //   Alert.alert("Restricted Area", "You can only explore within Mohali & Chandigarh.");
//   //     //   const fallbackRegion = {
//   //     //     latitude: 30.7400,
//   //     //     longitude: 76.7900,
//   //     //     ...getMpaDalta(),
//   //     //   };
//   //     //   mapRef.current?.animateToRegion(fallbackRegion, 1000);
//   //     // }

//   //     if (latDiff > 0.0001 || lngDiff > 0.0001) {
//   //       onTouchLocation({
//   //         latitude: region.latitude,
//   //         longitude: region.longitude,
//   //       });
//   //     }
//   //   }, Platform.OS === 'ios' ? 100 : 300);
//   // }, [mapRegion, onTouchLocation]);

//   // Optimized map ready handler
//   const handleMapReady = useCallback(() => {
//     setIsMapReady(true);
//   }, []);

//   // Cleanup on unmount
//   useEffect(() => {
//     return () => {
//       if (debounceTimeout.current) {
//         clearTimeout(debounceTimeout.current);
//       }
//     };
//   }, []);

//   // Memoized map props to prevent unnecessary re-renders
//   const mapProps = useMemo(() => ({
//     provider: PROVIDER_GOOGLE,
//     style: [styles.mapContainer, mapContainerView],
//     initialRegion: mapRegion,
//     mapType: Platform.OS === 'ios' ? 'mutedStandard' : 'standard',
//     showsCompass: false,
//     loadingEnabled: true,
//     zoomEnabled: true,
//     scrollEnabled: true,
//     rotateEnabled: false,
//     zoomTapEnabled: true,
//     // 👇 Set Zoom Limits
//     minZoomLevel: 10,  // prevent zooming out too far
//     maxZoomLevel: 18,  // prevent zooming in too much
//     showsUserLocation:true,   // 👈 shows blue dot
//     followsUserLocation:true, // 👈 map follows the user as they move
//     // Performance optimizations
//     showsBuildings: false,
//     showsTraffic: false,
//     showsIndoors: false,
//     showsMyLocationButton: false,
//     toolbarEnabled: false,
//     // Reduce map updates for better performance
//     onRegionChange: (e) => { setMpaDalta(e)},
//     onRegionChangeComplete: handleRegionChangeComplete,
//     onMapReady: handleMapReady,
//   }), [mapRegion, mapContainerView, handleRegionChangeComplete, handleMapReady]);

//   // Memoized center marker
//   const centerMarker = useMemo(() => (
//     isMapReady && (
//       <Image
//         source={appImages.markerImage}
//         style={styles.centerMarker}
//         resizeMode="contain"
//       />
//     )
//   ), [isMapReady]);

//   // Memoized loader
//   const loader = useMemo(() => (
//     !isMapReady && (
//       <AnimatedLoader
//         absolute="relative"
//         type="homeMapLoader"
//         height={height}
//       />
//     )
//   ), [isMapReady, height]);

//   return (
//     <View
//       pointerEvents={isPendingReq ? 'none' : 'auto'}
//       style={styles.homeSubContainer}
//     >
//       <MapView ref={mapRef} {...mapProps} >
//         {/* <Polygon
//         coordinates={[
//           // { latitude: 30.8258, longitude: 76.6600 }, // NW
//           // { latitude: 30.8258, longitude: 76.8500 }, // NE
//           // { latitude: 30.6600, longitude: 76.8500 }, // SE
//           // { latitude: 30.6600, longitude: 76.6600 }, // SW
//           { latitude: 30.8258, longitude: 76.7550 }, // top center
//           { latitude: 30.8100, longitude: 76.8050 },
//           { latitude: 30.7900, longitude: 76.8350 },
//           { latitude: 30.7550, longitude: 76.8500 }, // mid-right
//           { latitude: 30.7200, longitude: 76.8350 },
//           { latitude: 30.6900, longitude: 76.8050 },
//           { latitude: 30.6600, longitude: 76.7550 }, // bottom center
//           { latitude: 30.6750, longitude: 76.7100 },
//           { latitude: 30.7000, longitude: 76.6800 },
//           { latitude: 30.7400, longitude: 76.6600 }, // mid-left
//           { latitude: 30.7800, longitude: 76.6800 },
//           { latitude: 30.8050, longitude: 76.7100 },
//         ]}
//         strokeColor={colors.black}
//         fillColor="rgba(0, 150, 255, 0)"
//         strokeWidth={4}
//       /> */}
//       </MapView>
//       {centerMarker}
//       {loader}
//     </View>
//   );
// });

// MapLocationRoute.displayName = 'MapLocationRoute';

// export default MapLocationRoute;

// const styles = StyleSheet.create({
//   homeSubContainer: {
//     alignItems: 'flex-start',
//     justifyContent: 'center',
//     overflow: 'hidden',
//   },
//   mapContainer: {
//     alignSelf: 'center',
//     height: hp('35%'),
//     width: wp('100%'),
//   },
//   centerMarker: {
//     position: 'absolute',
//     top: '50%',
//     left: '50%',
//     marginLeft: -15,
//     marginTop: -30,
//     height: 35,
//     width: 32,
//     zIndex: 999,
//   },
// });







//  last Working Code

// import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
// import { StyleSheet, View, Image, Platform, Alert } from 'react-native';
// import MapView, { Polygon, PROVIDER_GOOGLE } from 'react-native-maps';
// import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
// import { appImages } from '../commons/AppImages';
// import { getMpaDalta, setMpaDalta } from './GeoCodeAddress';
// import AnimatedLoader from './AnimatedLoader/AnimatedLoader';
// import { colors } from '../theme/colors';
// import * as h3 from "h3-js";


// // Constants outside component to prevent recreation
// const DEFAULT_REGION = {
//   latitude: 30.7400,
//   longitude: 76.7900,
//   latitudeDelta: 0.0322,
//   longitudeDelta: 0.0322,
// };

// const MOHALI_CHD_BOUNDS = {
//   north: 30.8258,
//   south: 30.6600,
//   west: 76.6600,
//   east: 76.8500,
// };

// const MapLocationRoute = React.memo(({
//   mapContainerView,
//   origin,
//   isPendingReq,
//   onTouchLocation,
//   height,
// }) => {
//   const mapRef = useRef(null);
//   const debounceTimeout = useRef(null);
//   const lastRegionRef = useRef(null);
//   const [isMapReady, setIsMapReady] = useState(false);
//   const [hexCoords, setHexCoords] = useState([]);
//   // Memoized map region to prevent unnecessary re-renders
//   const mapRegion = useMemo(() => {
//     if (origin?.lat && origin?.lng) {
//       const newRegion = {
//         latitude: Number(origin?.lat),
//         longitude: Number(origin?.lng),
//         ...getMpaDalta(),
//       };
//       if (mapRef?.current && newRegion?.latitude) {
//         mapRef.current?.animateToRegion(newRegion, 1000);
//       }
//       return {
//         latitude: Number(origin.lat),
//         longitude: Number(origin.lng),
//         ...getMpaDalta(),
//       };
//     }
//     return DEFAULT_REGION;
//   }, [origin?.lat, origin?.lng]);

//   // Memoized bounds check function
//   const isWithinBounds = useCallback((latitude, longitude) => {
//     return (
//       latitude <= MOHALI_CHD_BOUNDS.north &&
//       latitude >= MOHALI_CHD_BOUNDS.south &&
//       longitude >= MOHALI_CHD_BOUNDS.west &&
//       longitude <= MOHALI_CHD_BOUNDS.east
//     );
//   }, []);


//   const handleRegionH3ChangeComplete = useCallback((region) => {
//     const { latitude, longitude } = region;

//     // Convert center to H3 hexagon
//     const resolution = 8;
//     const h3Index = h3.latLngToCell(latitude, longitude, resolution);

//     // Get hexagon boundary
//     const hexBoundary = h3.cellToBoundary(h3Index, true);
//     const coordinates = hexBoundary.map(([lat, lng]) => ({
//       latitude: lat,
//       longitude: lng,
//     }));
//     console.log("coordinates---handleRegionH3ChangeComplete", coordinates, latitude, longitude);

//     setHexCoords(coordinates);
//   }, []);


//   // Keep last region in a ref to compare properly

//   const handleRegionChangeComplete = useCallback((region) => {
//     if (debounceTimeout.current) {
//       clearTimeout(debounceTimeout.current);
//     }

//     handleRegionH3ChangeComplete({
//       latitude: 30.7400 ?? currentLat,
//       longitude: 76.7900 ?? currentLng
//     })

//     debounceTimeout.current = setTimeout(() => {
//       if (!region) return;

//       const currentLat = Number(region?.latitude);
//       const currentLng = Number(region?.longitude);

//       const lastLat = Number(lastRegionRef.current?.latitude ?? 0);
//       const lastLng = Number(lastRegionRef.current?.longitude ?? 0);

//       const latDiff = Math.abs(currentLat - lastLat);
//       const lngDiff = Math.abs(currentLng - lastLng)

//       //     // Optional bounds check
//       // if (!isWithinBounds(region?.latitude, region?.longitude)) {
//       //   Alert.alert("Restricted Area", "You can only explore within Mohali & Chandigarh.");
//       //   const fallbackRegion = {
//       //     latitude: 30.7400,
//       //     longitude: 76.7900,
//       //     ...getMpaDalta(),
//       //   };
//       //   mapRef.current?.animateToRegion(fallbackRegion, 1000);
//       // }

//       // Only trigger if moved more than threshold
//       if (latDiff > 0.0001 || lngDiff > 0.0001) {
//         lastRegionRef.current = region; // update last region
//         onTouchLocation({
//           latitude: currentLat,
//           longitude: currentLng,
//         });
//       }

//     }, Platform.OS === 'ios' ? 100 : 300);
//   }, [onTouchLocation]);


//   // Optimized region change handler with debouncing
//   // const handleRegionChangeComplete = useCallback((region) => {
//   //   if (debounceTimeout.current) {
//   //     clearTimeout(debounceTimeout.current);
//   //   }

//   //   debounceTimeout.current = setTimeout(() => {
//   //     // Only update if region actually changed significantly
//   //     const latDiff = Math.abs(region?.latitude ?? 0 - mapRegion?.latitude ?? 0);
//   //     const lngDiff = Math.abs(region?.longitude ?? 0 - mapRegion?.longitude ?? 0);

//   //     // Optional bounds check
//   //     // if (!isWithinBounds(region?.latitude, region?.longitude)) {
//   //     //   Alert.alert("Restricted Area", "You can only explore within Mohali & Chandigarh.");
//   //     //   const fallbackRegion = {
//   //     //     latitude: 30.7400,
//   //     //     longitude: 76.7900,
//   //     //     ...getMpaDalta(),
//   //     //   };
//   //     //   mapRef.current?.animateToRegion(fallbackRegion, 1000);
//   //     // }

//   //     if (latDiff > 0.0001 || lngDiff > 0.0001) {
//   //       onTouchLocation({
//   //         latitude: region.latitude,
//   //         longitude: region.longitude,
//   //       });
//   //     }
//   //   }, Platform.OS === 'ios' ? 100 : 300);
//   // }, [mapRegion, onTouchLocation]);

//   // Optimized map ready handler
//   const handleMapReady = useCallback(() => {
//     setIsMapReady(true);
//   }, []);

//   // Cleanup on unmount
//   useEffect(() => {
//     return () => {
//       if (debounceTimeout.current) {
//         clearTimeout(debounceTimeout.current);
//       }
//     };
//   }, []);

//   // Memoized map props to prevent unnecessary re-renders
//   const mapProps = useMemo(() => ({
//     provider: PROVIDER_GOOGLE,
//     style: [styles.mapContainer, mapContainerView],
//     initialRegion: mapRegion,
//     mapType: Platform.OS === 'ios' ? 'mutedStandard' : 'standard',
//     showsCompass: false,
//     loadingEnabled: true,
//     zoomEnabled: true,
//     scrollEnabled: true,
//     rotateEnabled: false,
//     zoomTapEnabled: true,
//     // 👇 Set Zoom Limits
//     minZoomLevel: 10,  // prevent zooming out too far
//     maxZoomLevel: 18,  // prevent zooming in too much
//     showsUserLocation: true,   // 👈 shows blue dot
//     followsUserLocation: true, // 👈 map follows the user as they move
//     // Performance optimizations
//     showsBuildings: false,
//     showsTraffic: false,
//     showsIndoors: false,
//     showsMyLocationButton: false,
//     toolbarEnabled: false,
//     // Reduce map updates for better performance
//     onRegionChange: (e) => { setMpaDalta(e) },
//     onRegionChangeComplete: handleRegionChangeComplete,
//     onMapReady: handleMapReady,
//   }), [mapRegion, mapContainerView, handleRegionChangeComplete, handleMapReady]);

//   // Memoized center marker
//   const centerMarker = useMemo(() => (
//     isMapReady && (
//       <Image
//         source={appImages.markerImage}
//         style={styles.centerMarker}
//         resizeMode="contain"
//       />
//     )
//   ), [isMapReady]);

//   // Memoized loader
//   const loader = useMemo(() => (
//     !isMapReady && (
//       <AnimatedLoader
//         absolute="relative"
//         type="homeMapLoader"
//         height={height}
//       />
//     )
//   ), [isMapReady, height]);

//   return (
//     <View
//       pointerEvents={isPendingReq ? 'none' : 'auto'}
//       style={styles.homeSubContainer}
//     >
//       <MapView ref={mapRef} {...mapProps} >
//         {/* {hexCoords?.length > 0 && ( */}
//           <Polygon
//             coordinates={[{ latitude: 76.65263232403157, longitude: 30.798187839974464 }, { latitude: 76.65307419174273, longitude: 30.793324031921145 }, { latitude: 76.65837672319493, longitude: 30.791281522456163 }, { latitude: 76.66323782370655, longitude: 30.794102459979914 }, { latitude: 76.66279671073721, longitude: 30.798966291317907 }, { latitude: 76.65749374250235, longitude: 30.801009161881623 }, { latitude: 76.65263232403157, longitude: 30.798187839974464 }]}
//             strokeColor={colors.black}
//             fillColor="rgba(0, 150, 255, 0)"
//             // strokeColor="rgba(0,0,0,0.8)"
//             // fillColor="rgba(0,150,255,0.3)"
//             strokeWidth={4}
//           />
//         {/* )} */}
//         {/* <Polygon
//         coordinates={[
//           // { latitude: 30.8258, longitude: 76.6600 }, // NW
//           // { latitude: 30.8258, longitude: 76.8500 }, // NE
//           // { latitude: 30.6600, longitude: 76.8500 }, // SE
//           // { latitude: 30.6600, longitude: 76.6600 }, // SW
//           { latitude: 30.8258, longitude: 76.7550 }, // top center
//           { latitude: 30.8100, longitude: 76.8050 },
//           { latitude: 30.7900, longitude: 76.8350 },
//           { latitude: 30.7550, longitude: 76.8500 }, // mid-right
//           { latitude: 30.7200, longitude: 76.8350 },
//           { latitude: 30.6900, longitude: 76.8050 },
//           { latitude: 30.6600, longitude: 76.7550 }, // bottom center
//           { latitude: 30.6750, longitude: 76.7100 },
//           { latitude: 30.7000, longitude: 76.6800 },
//           { latitude: 30.7400, longitude: 76.6600 }, // mid-left
//           { latitude: 30.7800, longitude: 76.6800 },
//           { latitude: 30.8050, longitude: 76.7100 },
//         ]}
//         strokeColor={colors.black}
//         fillColor="rgba(0, 150, 255, 0)"
//         strokeWidth={4}
//       /> */}
//       </MapView>
//       {centerMarker}
//       {loader}
//     </View>
//   );
// });

// MapLocationRoute.displayName = 'MapLocationRoute';

// export default MapLocationRoute;

// const styles = StyleSheet.create({
//   homeSubContainer: {
//     alignItems: 'flex-start',
//     justifyContent: 'center',
//     overflow: 'hidden',
//   },
//   mapContainer: {
//     alignSelf: 'center',
//     height: hp('35%'),
//     width: wp('100%'),
//   },
//   centerMarker: {
//     position: 'absolute',
//     top: '50%',
//     left: '50%',
//     marginLeft: -15,
//     marginTop: -30,
//     height: 35,
//     width: 32,
//     zIndex: 999,
//   },
// });




