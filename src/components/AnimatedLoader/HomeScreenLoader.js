import React from 'react';
import { View } from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';


const HomeScreenLoader = ({ }) => {
    const map = ['1', '2', '3'];

    return (
        <View style={{ paddingHorizontal: 18 }}>
            {map?.map((item, key) => (
                <SkeletonPlaceholder key={key}>
                    <View>
                        <View style={{ height: hp('15%'), width: wp('91%'), marginTop: '5%', borderRadius: 8 }} />
                        {key == map?.length - 1 && <View style={{ height: hp('30%'), width: wp('91%'), marginTop: '5%', borderRadius: 8 }} />}
                    </View>
                </SkeletonPlaceholder>
            ))}
        </View>
    );
};

export default HomeScreenLoader;
