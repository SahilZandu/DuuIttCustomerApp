import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { colors } from '../theme/colors';

const IndicatorLoader = () => {
    return (
        <View style={styles.container}>
            <View style={styles.innerView}>
                <ActivityIndicator size="large" color={colors.green} />
            </View>
        </View>
    );
};

export default IndicatorLoader;

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: hp('30%'),
        alignSelf: 'center',
        right: wp('40%'),

    },
    innerView: {
        height: hp('10%'),
        width: wp('20%'),
        backgroundColor: colors.white,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
    }
});
