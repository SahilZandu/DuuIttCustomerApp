// import React, {useEffect, useState,useRef} from 'react';
// import {TouchableOpacity, View,Image,Dimensions} from 'react-native';
// import { colors } from '../../theme/colors';
// import {
//   heightPercentageToDP as hp,
//   widthPercentageToDP as wp,
// } from 'react-native-responsive-screen';
// import Carousel from 'react-native-new-snap-carousel';


// const {width: viewportWidth} = Dimensions.get('window');

// const FoodSlider = ({data ,onSliderPress,imageWidth,imageHeight,paginationList}) => {
//     const carouselRef = useRef(null);
//     const [stateIndex, setStateIndex] = useState(0);

//     const renderItem = ({item}) => (
//         <TouchableOpacity
//         onPress={onSliderPress}
//         activeOpacity={0.8}
//           style={{
//             alignSelf: 'center',
//             right: '2.7%',
//             borderRadius:10,
//             borderColor:colors.main,
//             borderWidth:0.3
//           }}>
//           <Image
//             resizeMode='stretch'
//             style={{width:imageWidth?imageWidth: wp('90%'), height:imageHeight?imageHeight :hp('18%'), borderRadius: 10}}
//             source={item.image}
//           />
//         </TouchableOpacity>
//       );
    
//     const pagination = () => {
//         return (
//           <View
//             style={{
//               justifyContent: 'center',
//               alignItems: 'center',
//               marginTop: '4%',
//               flexDirection: 'row',
//             }}>
//             {data?.map((item, i) => {
//               return (
//                 <>
//                   {stateIndex === i ? (
//                     <View
//                       style={{
//                         height: hp('1%'),
//                         width: wp('5%'),
//                         backgroundColor: '#F99E1C',
//                         marginHorizontal: 4,
//                         borderRadius: 10,
//                       }}></View>
//                   ) : (
//                     <View
//                       style={{
//                         height: hp('1%'),
//                         width: wp('2%'),
//                         backgroundColor: colors.colorD9,
//                         marginHorizontal: 4,
//                         borderRadius: 10,
//                       }}></View>
//                   )}
//                 </>
//               );
//             })}
//           </View>
//         );
//       };
    

//   return (
//     <View style={{marginTop: '7%'}}>
//           <Carousel
//             ref={carouselRef}
//             data={data}
//             renderItem={renderItem}
//             sliderWidth={viewportWidth}
//             itemWidth={viewportWidth}
//             loop={true}
//             autoplay={true}
//             autoplayDelay={1000} // Delay before the autoplay starts
//             autoplayInterval={2000} // Interval of autoplay in milliseconds
//             onSnapToItem={index => setStateIndex(index)}
//           />
//           {paginationList && pagination()}
//         </View>
   
//   );
// };

// export default FoodSlider;

import React, { useRef, useState } from 'react';
import { TouchableOpacity, View, Image, Dimensions } from 'react-native';
import { colors } from '../../theme/colors';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import Carousel from 'react-native-new-snap-carousel';

const { width: viewportWidth } = Dimensions.get('window');

const FoodSlider = ({ data,oneCard, onSliderPress, imageWidth, imageHeight, paginationList }) => {
  const carouselRef = useRef(null);
  const [stateIndex, setStateIndex] = useState(0);

  // Rendering individual items
  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={onSliderPress}
      activeOpacity={0.8}
      style={{
        alignSelf: 'center',
        // marginHorizontal: wp('1%'), // Adjust spacing between images
        borderRadius: 10,
        borderColor: colors.main,
        borderWidth: 0.3,
        right:oneCard ? 0 : wp("10%")
      }}>
      <Image
        resizeMode= {oneCard ?'st' :"stretch"}
        style={{
          width: imageWidth ? imageWidth : wp('45%'), // Adjust for two images
          height: imageHeight ? imageHeight : hp('18%'),
          borderRadius: 10,
        }}
        source={item.image}
      />
    </TouchableOpacity>
  );

  // Pagination dots
  const pagination = () => {
    return (
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: '4%',
          flexDirection: 'row',
        }}>
        {data?.map((item, i) => {
          return (
            <>
              {stateIndex === i ? (
                <View
                  style={{
                    height: hp('1%'),
                    width: wp('5%'),
                    backgroundColor: '#F99E1C',
                    marginHorizontal: 4,
                    borderRadius: 10,
                  }}
                />
              ) : (
                <View
                  style={{
                    height: hp('1%'),
                    width: wp('2%'),
                    backgroundColor: colors.colorD9,
                    marginHorizontal: 4,
                    borderRadius: 10,
                  }}
                />
              )}
            </>
          );
        })}
      </View>
    );
  };

  // Carousel with two items visible
  return (
    <View style={{ marginTop: '2%' }}>
      <Carousel
        ref={carouselRef}
        data={data}
        renderItem={renderItem}
        sliderWidth={viewportWidth}
        itemWidth={oneCard ? viewportWidth : viewportWidth/1.3 } // Adjust to fit two items per screen
        loop={true}
        autoplay={true}
        autoplayDelay={1000}
        autoplayInterval={2000}
        onSnapToItem={index => setStateIndex(index)}
      />
      {paginationList && pagination()}
    </View>
  );
};

export default FoodSlider;

