import React, { useState, useCallback } from 'react';
import { View, Pressable, Text } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import Icon from 'react-native-vector-icons/Entypo';
import * as Animatable from 'react-native-animatable';
import { useFocusEffect } from '@react-navigation/native';
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { fonts } from '../theme/fonts/fonts';
import { colors } from '../theme/colors';


const OrderIndicator = ({ onPress, isHashOrders }) => {
    const [hashOrder, setHashOrder] = useState(true);
    const [isOrderIndicator, setIsOrderIndicator] = useState(true);

    useFocusEffect(
        useCallback(() => {
            //   setHashOrder(false)
            //   setIsOrderIndicator(false)
            setHashOrder(true)
            setIsOrderIndicator(true)

        }, []),
    );

    if (hashOrder && isOrderIndicator) {
        return (
            <Animatable.View
                animation="pulse"
                duration={2000}
                //delay={10000}
                easing={'ease-in'}
                iterationCount={'infinite'}
                style={{
                    position: 'abslute', bottom: hp("4%"),
                    width: wp("90%"), justifyContent: 'center',
                }}
            >
                <Pressable
                    onPress={onPress}
                    style={{
                        backgroundColor: colors.main,
                        paddingVertical: '2.5%',
                        flexDirection: 'row',
                        paddingHorizontal: 20,
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderTopLeftRadius: 20,
                        borderTopRightRadius: 20,

                    }}>
                    <Text
                        style={{
                            color: colors.white,
                            fontFamily: fonts.semiBold,
                            fontSize: RFValue(13),
                            //   marginTop: '-2%'
                        }}>
                        Hang tight! Your Rider is en route.
                    </Text>
                    <View style={{
                        marginLeft: 'auto',
                        //  marginTop: '-2%'
                    }}>
                        <Icon name={'chevron-up'} size={25} color={colors.white} />
                    </View>
                </Pressable>
            </Animatable.View>
        );
    } else {
        return null;
    }
};

export default OrderIndicator;
