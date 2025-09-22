import React from 'react';
import { View } from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';


const HomeScreenBannerLoader = ({ }) => {
    const map = ['1', '2', '3'];

    return (
        <View style={{ paddingHorizontal: 18, }}>
            {map?.map((item, key) => (
                <SkeletonPlaceholder key={key}>
                    <View>
                        {key == 0 && <View style={{ marginHorizontal: -18, height: hp('35%'), width: wp('100%'), borderRadius: 8 }} />}
                        <View style={{ height: hp('15%'), width: wp('91%'), marginTop: '5%', borderRadius: 8 }} />
                        {key == map?.length - 1 && <View style={{ height: hp('30%'), width: wp('91%'), marginTop: '5%', borderRadius: 8 }} />}
                    </View>
                </SkeletonPlaceholder>
            ))}
        </View>
    );
};

export default HomeScreenBannerLoader;
