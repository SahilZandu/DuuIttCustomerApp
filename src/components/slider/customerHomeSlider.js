import React, { useEffect, useState, useRef } from 'react';
import { TouchableOpacity, View, Image, Dimensions, SafeAreaView, StatusBar } from 'react-native';
import { colors } from '../../theme/colors';
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import Carousel from 'react-native-new-snap-carousel';
import Url from '../../api/Url';
import { Text } from 'react-native-paper';
import { fonts } from '../../theme/fonts/fonts';
import { RFValue } from 'react-native-responsive-fontsize';


const { width: viewportWidth } = Dimensions.get('window');

const CustomerHomeSlider = ({ bannerList, data, onSliderPress, imageWidth, imageHeight, paginationList }) => {
    const carouselRef = useRef(null);
    const [stateIndex, setStateIndex] = useState(0);

    console.log('data--CustomerHomeSlider', data);


    const renderItem = ({ item }) => {
        // console.log("item--renderItem",item);
        return (
            <View>
                <TouchableOpacity
                    onPress={onSliderPress}
                    activeOpacity={0.8}
                    style={{
                        alignSelf: 'center',
                    }}>
                    <Image
                        resizeMode='stretch'
                        style={{
                            width: imageWidth ? imageWidth : wp('100%'),
                            height: imageHeight ? imageHeight : hp('25%')
                        }}
                        source={{ uri: Url?.Image_Url + item }}
                    />

                </TouchableOpacity>
                {/* <Text numberOfLines={2} style={{
                    fontFamily: fonts.bold, fontSize: RFValue(12),
                    color: colors.black, marginHorizontal: 22, marginTop: '2%'
                }}>{bannerList[0]?.title}</Text> */}
            </View>
        )
    };


    const pagination = () => {
        return (
            <View
                style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: '4%',
                    flexDirection: 'row',
                    marginBottom: '3%'
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
                                    }}></View>
                            ) : (
                                <View
                                    style={{
                                        height: hp('1%'),
                                        width: wp('2%'),
                                        backgroundColor: colors.colorD9,
                                        marginHorizontal: 4,
                                        borderRadius: 10,
                                    }}></View>
                            )}
                        </>
                    );
                })}
            </View>
        );
    };


    return (
        <>
        {/* // <SafeAreaView style={{ flex: 1, 
        // backgroundColor: colors.appBackground 
        // }}> */}
            {/* <StatusBar barStyle="dark-content" backgroundColor={colors.white}
             /> */}
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <Carousel
                    ref={carouselRef}
                    data={data}
                    renderItem={renderItem}
                    sliderWidth={viewportWidth}
                    itemWidth={viewportWidth}
                    loop={true}
                    autoplay={true}
                    autoplayDelay={1000} // Delay before the autoplay starts
                    autoplayInterval={2000} // Interval of autoplay in milliseconds
                    onSnapToItem={index => setStateIndex(index)}
                />
                {paginationList && pagination()}
            </View>
        </>
    );
};

export default CustomerHomeSlider;










// import React, { useEffect, useState, useRef } from 'react';
// import { TouchableOpacity, View, Image, Dimensions, StatusBar } from 'react-native';
// import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
// import LinearGradient from 'react-native-linear-gradient';
// import { colors } from '../../theme/colors';
// import {
//     heightPercentageToDP as hp,
//     widthPercentageToDP as wp,
// } from 'react-native-responsive-screen';
// import Carousel from 'react-native-new-snap-carousel';
// import Url from '../../api/Url';
// import { Text } from 'react-native-paper';
// import { fonts } from '../../theme/fonts/fonts';
// import { RFValue } from 'react-native-responsive-fontsize';


// const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');

// const CustomerHomeSlider = ({ bannerList, data, onSliderPress, imageWidth, imageHeight, paginationList, coverStatusBar = true, statusOverlayExtend, fullScreen = false }) => {
//     const carouselRef = useRef(null);
//     const [stateIndex, setStateIndex] = useState(0);
//     const insets = useSafeAreaInsets();

//     console.log('data--CustomerHomeSlider', data);


//     const renderItem = ({ item }) => {
//         // console.log("item--renderItem",item);
//         return (
//             <View style={{ position: 'relative' }}>
//                 <TouchableOpacity
//                     onPress={onSliderPress}
//                     activeOpacity={0.8}
//                     style={{
//                         alignSelf: 'center',
//                     }}>
//                     <Image
//                         resizeMode='cover'
//                         style={{
//                             width: imageWidth ? imageWidth : wp('100%'),
//                             height:  (imageHeight ? imageHeight : hp('35%'))
//                         }}
//                         source={{ uri: Url?.Image_Url + item }}
//                     />

//                 </TouchableOpacity>
//                 {coverStatusBar && (
//                     <LinearGradient
//                         pointerEvents="none"
//                         colors={["rgba(0,0,0,0.55)", "rgba(0,0,0,0)"]}
//                         style={{
//                             position: 'absolute',
//                             top: 0,
//                             left: 0,
//                             right: 0,
//                             height: insets.top + (statusOverlayExtend ?? hp('6%')),
//                         }}
//                     />
//                 )}
//                 {/* <Text numberOfLines={2} style={{
//                     fontFamily: fonts.bold, fontSize: RFValue(12),
//                     color: colors.black, marginHorizontal: 22, marginTop: '2%'
//                 }}>{bannerList[0]?.title}</Text> */}
//             </View>
//         )
//     };


//     const pagination = () => {
//         return (
//             <View
//                 style={{
//                     justifyContent: 'center',
//                     alignItems: 'center',
//                     marginTop: '4%',
//                     flexDirection: 'row',
//                     marginBottom: '3%'
//                 }}>
//                 {data?.map((item, i) => {
//                     return (
//                         <>
//                             {stateIndex === i ? (
//                                 <View
//                                     style={{
//                                         height: hp('1%'),
//                                         width: wp('5%'),
//                                         backgroundColor: '#F99E1C',
//                                         marginHorizontal: 4,
//                                         borderRadius: 10,
//                                     }}></View>
//                             ) : (
//                                 <View
//                                     style={{
//                                         height: hp('1%'),
//                                         width: wp('2%'),
//                                         backgroundColor: colors.colorD9,
//                                         marginHorizontal: 4,
//                                         borderRadius: 10,
//                                     }}></View>
//                             )}
//                         </>
//                     );
//                 })}
//             </View>
//         );
//     };


//     return (
//         <>
//             <View style={{ justifyContent: 'center', alignItems: 'center' }}>
//                 <Carousel
//                     ref={carouselRef}
//                     data={data}
//                     renderItem={renderItem}
//                     sliderWidth={viewportWidth}
//                     itemWidth={viewportWidth}
//                     loop={true}
//                     autoplay={true}
//                     autoplayDelay={1000} // Delay before the autoplay starts
//                     autoplayInterval={2000} // Interval of autoplay in milliseconds
//                     onSnapToItem={index => setStateIndex(index)}
//                 />
//                 {paginationList && pagination()}
//             </View>
//         </>
//     );
// };

// export default CustomerHomeSlider;
