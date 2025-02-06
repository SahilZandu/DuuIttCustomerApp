// import React, {useRef, useState} from 'react';
// import {View, Image, TouchableOpacity, Dimensions} from 'react-native';
// import Carousel from 'react-native-new-snap-carousel';
// import {
//   heightPercentageToDP as hp,
//   widthPercentageToDP as wp,
// } from 'react-native-responsive-screen';

// const {width: viewportWidth} = Dimensions.get('window');

// const GiftSlider = ({data, onSliderPress,}) => {
//   const carouselRef = useRef(null);
//   const [stateIndex, setStateIndex] = useState(0);

//   const renderItem = ({item}) => (
//     <TouchableOpacity
//       onPress={onSliderPress}
//       activeOpacity={0.8}
//       style={{
//         alignSelf: 'center',
//         borderRadius: 10,
//         borderColor: '#F99E1C',
//         borderWidth: 0.3,
//         marginRight: wp('5%'), // Space between images,
//         marginLeft: wp('-38%'),
//       }}>
//       <Image
//         resizeMode="stretch"
//         style={{
//           width: wp('55%'), // Width of each item (adjust to fit your requirement)
//           height: hp('18%'), // Height of each item
//           borderRadius: 10,
//         }}
//         source={item.image} // Image data
//       />
//     </TouchableOpacity>
//   );

//   const pagination = () => {
//     return (
//       <View
//         style={{
//           justifyContent: 'center',
//           alignItems: 'center',
//           marginTop: '4%',
//           flexDirection: 'row',
//         }}>
//         {data?.map((item, i) => (
//           <View
//             key={i}
//             style={{
//               height: stateIndex === i ? hp('1%') : hp('1%'),
//               width: stateIndex === i ? wp('5%') : wp('2%'),
//               backgroundColor: stateIndex === i ? '#F99E1C' : '#D9D9D9',
//               marginHorizontal: 4,
//               borderRadius: 10,
//             }}
//           />
//         ))}
//       </View>
//     );
//   };

//   return (
//     <View style={{marginTop: '7%'}}>
//       <Carousel
//         ref={carouselRef}
//         data={data}
//         renderItem={renderItem}
//         sliderWidth={viewportWidth} // Full width of the screen
//         itemWidth={viewportWidth / 1.8} // This makes the left image partially hidden
//         loop={true}
//         autoplay={true}
//         autoplayDelay={1000}
//         autoplayInterval={2000}
//         onSnapToItem={index => setStateIndex(index)}
//         inactiveSlideOpacity={1} // Keep other slides fully visible
//         inactiveSlideScale={0.9} // Slight scaling for inactive slides
//       />
//       {pagination()}
//     </View>
//   );
// };

// export default GiftSlider;

import React, {useRef, useState} from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {SvgXml} from 'react-native-svg';
import {appImages, appImagesSvg} from '../../commons/AppImages';

const GiftSliderFlatList = ({data, onSliderPress, onHandleImage}) => {
  const [stateIndex, setStateIndex] = useState(0);
  const flatListRef = useRef();

  // Render each item in the FlatList
  const renderItem = ({item, index}) => (
    <View style={{flexDirection: 'column'}}>
      <TouchableOpacity
        onPress={onSliderPress}
        activeOpacity={0.8}
        style={{
          alignSelf: 'center',
          borderRadius: 10,
          borderColor: '#F99E1C',
          borderWidth: 0.3,
          marginRight: wp('3%'), // Space between items
        }}>
        <Image
          resizeMode="stretch"
          style={{
            width: wp('34%'), // Image width
            height: hp('12%'), // Image height
            borderRadius: 10,
          }}
          source={item.image} // Source of the image
        />
      </TouchableOpacity>
      {stateIndex === index ? (
        <Image
          resizeMode="contain"
          style={{
            width: 35,
            height: 35,
            top: hp('-1.8%'),
            alignSelf: 'center',
            right: wp('1%'),
          }}
          source={appImages.mikeTick}
        />
      ) : null}
    </View>
  );

  // Handle the index of the current item being viewed
  const onViewRef = useRef(viewableItems => {
    if (viewableItems.viewableItems.length > 0) {
      const visibleIndex = viewableItems.viewableItems[0].index;
      setStateIndex(visibleIndex);
      onHandleImage(visibleIndex);
    }
  });

  const viewConfigRef = useRef({viewAreaCoveragePercentThreshold: 50});

  return (
    <View style={{marginTop: '5%'}}>
      <FlatList
        ref={flatListRef}
        data={data}
        renderItem={renderItem}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToAlignment={'start'}
        decelerationRate="fast"
        snapToInterval={10} // Ensures only two items are fully visible
        onViewableItemsChanged={onViewRef.current} // Updates pagination based on the visible item
        viewabilityConfig={viewConfigRef.current}
        keyExtractor={(item, index) => index?.toString()}
        contentContainerStyle={{
          paddingRight: wp('25%'),
        }} // Left padding to hide the left image
      />
    </View>
  );
};

export default GiftSliderFlatList;
