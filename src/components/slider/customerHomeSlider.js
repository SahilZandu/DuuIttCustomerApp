import React, { useEffect, useState, useRef } from 'react';
import { TouchableOpacity, View, Image, Dimensions, SafeAreaView, StatusBar, Platform } from 'react-native';
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
import FastImage from 'react-native-fast-image';
import { appImages } from '../../commons/AppImages';


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
                        backgroundColor: bannerList[0]?.backgroundColor ?? colors.black,
                        borderBottomLeftRadius: 20,
                        borderBottomRightRadius: 20,
                    }}>
                    <FastImage
                        style={{
                            width: imageWidth ? imageWidth : wp('100%'),
                            height: imageHeight ? imageHeight : hp('25%'),
                            borderBottomLeftRadius: 20,
                            borderBottomRightRadius: 20,

                        }}
                        source={{ uri: Url?.Image_Url + item }}// your .gif file in assets
                        resizeMode={FastImage.resizeMode.stretch}
                    />
                    {/* <Image
                        resizeMode='stretch'
                        style={{
                            width: imageWidth ? imageWidth : wp('100%'),
                            height: imageHeight ? imageHeight : hp('25%'),
                            borderBottomLeftRadius: 20,
                            borderBottomRightRadius: 20
                        }}
                        source={{ uri: Url?.Image_Url + item }}
                    /> */}

                </TouchableOpacity>

                {/* <Text numberOfLines={2} style={{
                    fontFamily: fonts.bold, fontSize: RFValue(12),
                    color: colors.black, marginHorizontal: 22, marginTop: '2%'
                }}>{bannerList[0]?.title}</Text> */}


                {/* <View style={{
                    justifyContent: 'space-around',
                    alignItems: 'center',
                    alignSelf: 'center',
                    flexWrap: 'wrap',
                    flexDirection: 'row',
                    position: 'absolute', // Add this for horizontal layout,
                    bottom: hp('2%'),
                }}>
                    {bannerList[0]?.additional_details?.map((data, i) => {
                        return (
                            <View key={i} style={{
                                justifyContent: 'center',
                                alignItems: 'center', // Center content
                                backgroundColor: 'yellow',
                                width: wp('40%'),
                                height: hp('10%'),
                            }}>
                                <FastImage
                                    style={{
                                        width: wp('10%'),
                                        height: hp('5%'),
                                        marginBottom: hp('1%') // Space between image and text
                                    }}
                                    source={{ uri: Url?.Image_Url + data?.image }}
                                    resizeMode={FastImage.resizeMode.contain} // Better than stretch usually
                                />
                                <Text style={{ textAlign: 'center', fontSize: 12 }}>{data?.name}</Text>
                                <Text style={{ textAlign: 'center', fontSize: 10, color: 'gray' }}>
                                    {data?.details}
                                </Text>
                            </View>
                        )
                    })}
                </View> */}
                <View style={{
                    position: 'absolute',
                    bottom: hp('1%'),
                    left: 0,
                    right: 0,
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    justifyContent: 'center', // Change to center
                    alignItems: 'center',
                }}>
                    {bannerList[0]?.additional_details?.map((data, i) => {
                        return (
                            <>
                                <View key={i} style={{
                                    justifyContent: 'center',
                                    backgroundColor: colors.white,
                                    width: data?.box_type == 'circle' ? wp('22%') : wp('42%'),
                                    height: data?.box_type == 'circle' ? wp('22%') : hp('11%'),
                                    marginHorizontal: wp('2.5%'), // Equal horizontal margin
                                    // marginBottom: hp('1%'), // Vertical margin
                                    borderRadius: data?.box_type == 'circle' ? wp('22%') / 2 : 10,
                                    borderWidth: 0.5,
                                    borderColor: colors.green
                                }}>
                                    {(data?.name?.length > 0 && data?.box_type !== 'circle') ? <View>
                                        <Text
                                            numberOfLines={1}
                                            style={{
                                                fontSize: RFValue(14), fontFamily: fonts.bold,
                                                color: colors.black, top: hp('5.5%'), left: hp('1%'),
                                                width: wp("20%")
                                            }}>{data?.name}</Text>
                                        <Text
                                            numberOfLines={2}
                                            style={{
                                                fontSize: RFValue(14), fontFamily: fonts.bold,
                                                color: colors.black, top: hp('5.6%'), left: hp('1%'),
                                                width: wp("20%")
                                            }}>
                                            {data?.details}
                                        </Text>
                                        <View style={{
                                            flexDirection: 'row',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                        }}>
                                            {/* <View style={{
                                        backgroundColor: bannerList[0]?.backgroundColor == '#ffffff' ? colors.black : colors.white,
                                        borderWidth: 1,
                                        borderRadius: 20,
                                        borderColor: colors.green,
                                        left: hp('2%'),
                                        paddingVertical: 0,
                                        paddingHorizontal: 6,
                                        marginTop: '2%'
                                    }}>
                                        <Image
                                            style={{
                                                width: 18,
                                                height: 18,
                                                tintColor: bannerList[0]?.backgroundColor == '#ffffff' ? colors.white : colors.black
                                            }}
                                            source={appImages?.dubbleRightArrow}

                                        />
                                    </View> */}

                                            <Text style={{ flex: 1 }} />
                                            <FastImage
                                                style={{
                                                    width: wp('15%'),
                                                    height: hp('15%'),
                                                    bottom: hp('1%'),
                                                    marginRight: hp('1%'),
                                                }}
                                                source={{ uri: Url?.Image_Url + data?.image }}
                                                resizeMode={FastImage.resizeMode.contain}
                                            />
                                        </View>
                                        {/* </View> */}
                                    </View> :
                                        <FastImage
                                            style={{
                                                width: Platform.OS == 'ios' ? data?.box_type == 'circle' ? wp('21.52%') : wp('41.70%') : data?.box_type == 'circle' ? wp('21.85%') : wp('41.85%'),
                                                height: data?.box_type == 'circle' ? wp('21.75%') : hp('10.9%'),
                                                borderRadius: data?.box_type == 'circle' ? wp('22%') / 2 : 10,
                                            }}
                                            source={{ uri: Url?.Image_Url + data?.image }}
                                            resizeMode={FastImage.resizeMode.stretch}
                                        />
                                    }

                                </View>
                            </>
                        )
                    })}
                </View>

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
                    data={data?.length > 0 ? data : ['/public/uploads/banners/a6fefcac-6885-46e6-8fbb-bbd4086e629c.jpg/']}
                    renderItem={renderItem}
                    sliderWidth={viewportWidth}
                    itemWidth={viewportWidth}
                    loop={true}
                    autoplay={true}
                    autoplayDelay={1000} // Delay before the autoplay starts
                    autoplayInterval={2000} // Interval of autoplay in milliseconds
                    onSnapToItem={index => setStateIndex(index)}
                />
                {(paginationList && data?.length > 1) && pagination()}
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
