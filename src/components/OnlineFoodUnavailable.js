import React, { useCallback, useState } from 'react';
import { Text, View, StyleSheet, Pressable, Image, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { colors } from '../theme/colors';
import AppInputScroll from '../halpers/AppInputScroll';
import Header from './header/Header';
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
            // handleAndroidBackButton(navigation);
            setAppDetails(appUser);
        }, [appUser]),
    );

    // console.log('appUser--++--', appUser)



    return (
        <View style={styles.mainView}>
            <View style={styles.subView}>
                {/* <AppInputScroll padding={true} keyboardShouldPersistTaps={'handled'}> */}
                    <View style={{ justifyContent: 'center', 
                        alignItems: 'center', marginTop: '8%' }}>
                        <Image style={{ width: 300, height: 250 }}
                            resizeMode='contain'
                            source={appImages.onlineUnavailable} />
                        <Text style={{ fontSize: RFValue(20), fontFamily: fonts.medium, color: colors.black }}>Online Ordering Unavailable</Text>
                        <Text style={{
                            fontSize: RFValue(13), fontFamily: fonts.regular,
                            color: colors.black65, textAlign: 'center',
                            marginTop: '2%'
                        }}>Online Ordering is currently not available at your location</Text>
                        <Spacer space={'10%'} />
                        <BTN title={"CHECK OTHER OPTIONS"} />
                        <TouchableOpacity activeOpacity={0.8}>
                            <Text style={{
                                fontSize: RFValue(15),
                                fontFamily: fonts.medium,
                                color: colors.black85,
                                marginTop: '2%',
                                textDecorationLine: 'underline'
                            }}>Try another location</Text>
                        </TouchableOpacity>
                    </View>
                {/* </AppInputScroll> */}

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
        flex:1,
        backgroundColor: colors.appBackground,
        paddingHorizontal: '5%',
        borderRadius: 15,
    },
    screen: {
        flex: 1,
        justifyContent: 'center',
    }

});
