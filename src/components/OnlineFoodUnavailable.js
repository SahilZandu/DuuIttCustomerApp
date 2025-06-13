import React, { useCallback, useState } from 'react';
import { Text, View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { colors } from '../theme/colors';
import { rootStore } from '../stores/rootStore';
import { appImages } from '../commons/AppImages';
import BTN from './cta/BTN';
import Spacer from '../halpers/Spacer';
import { RFValue } from 'react-native-responsive-fontsize';
import { fonts } from '../theme/fonts/fonts';


const OnlineFoodUnavailable = ({ appUserData, navigation }) => {
    const { appUser } = rootStore.commonStore;
    const [appDetails, setAppDetails] = useState(appUserData || appUser);

    useFocusEffect(
        useCallback(() => {
            const { appUser } = rootStore.commonStore;
            setAppDetails(appUser);
        }, [appUser]),
    );

    return (
        <View style={styles.mainView}>
            <View style={styles.subView}>
              
                <View style={styles.innerScreen}>
                    <Image style={styles.mainImage}
                        resizeMode='contain'
                        source={appImages.onlineUnavailable} />
                    <Text style={styles.onlineText}>Online Ordering Unavailable</Text>
                    <Text style={styles.currentlyLocation}>Online Ordering is currently not available at your location</Text>
                    <Spacer space={'10%'} />
                    <BTN title={"CHECK OTHER OPTIONS"}
                    onPress={() => {
                        navigation.goBack();
                    }} />
                    <TouchableOpacity
                    style={styles.tryTouch}
                        activeOpacity={0.8}
                        onPress={() => {
                         navigation.navigate('addRestaurantLocation')
                        }}
                      >
                        <Text style={styles.tryOtherLocationText}>Try another location</Text>
                    </TouchableOpacity>
                </View>
              
            </View>
        </View>
    );
};

export default OnlineFoodUnavailable;

const styles = StyleSheet.create({
    mainView: {
        position: 'absolute',
        width: wp('100%'),
        height: hp('90%'),
        marginTop: hp("14%")
    },
    subView: {
        flex: 1,
        backgroundColor: colors.appBackground,
        paddingHorizontal: '5%',
        borderRadius: 15,
    },
    innerScreen: {
        justifyContent: 'center',
        alignItems: 'center', marginTop: '8%'
    },
    mainImage: {
        width: wp("100%"), height: hp('33%')
    },
    onlineText: {
        fontSize: RFValue(19), fontFamily: fonts.medium, color: colors.black
    },
    currentlyLocation: {
        fontSize: RFValue(13), fontFamily: fonts.regular,
        color: colors.black65, textAlign: 'center',
        marginTop: '2%'
    },
    tryTouch:{
        marginTop: '4%',
    },
    tryOtherLocationText: {
        fontSize: RFValue(15),
        fontFamily: fonts.medium,
        color: colors.black85,
        textDecorationLine: 'underline'
    }

});
