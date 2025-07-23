import React, { useEffect, useState, useRef } from 'react';
import { TouchableOpacity, View, Image, Dimensions } from 'react-native';
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
            <>
                <TouchableOpacity
                    onPress={onSliderPress}
                    activeOpacity={0.8}
                    style={{
                        alignSelf: 'center',
                        // borderRadius: 10,
                        // borderColor: colors.main,
                        // borderWidth: 0.3
                    }}>
                    <Image
                        resizeMode='stretch'
                        style={{ width: imageWidth ? imageWidth : wp('100%'), height: imageHeight ? imageHeight : hp('18%')}}
                        source={{ uri: Url?.Image_Url + item }}
                    />

                </TouchableOpacity>
                <Text numberOfLines={2} style={{
                    fontFamily: fonts.bold, fontSize: RFValue(12),
                    color: colors.black, marginHorizontal: 22, marginTop: '2%'
                }}>{bannerList[0]?.title}</Text>
            </>
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
        <View style={{justifyContent: 'center', alignItems: 'center' }}>
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

    );
};

export default CustomerHomeSlider;
