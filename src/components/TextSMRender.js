import React from 'react';
import { StyleSheet, View, Text,} from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts/fonts';
import { currencyFormat } from '../halpers/currencyFormat';

const TextSMRender = ({
    cartList
}) => {

    return (
        <View style={styles.container}>
            <View style={styles.smallMainView}>
                <Text style={styles.smallText}>Small order fee</Text>
                {cartList?.small_order_fee > 0 && <Text style={styles.smCutAmount}>{currencyFormat(cartList?.contactDetailsSmallOrder?.small_order_fee ?? 0)}</Text>}
                <Text style={styles.smShowAmount}>{currencyFormat(cartList?.small_order_fee > 0 ? cartList?.small_order_fee ?? 0 : cartList?.contactDetailsSmallOrder?.small_order_fee ?? 0)}</Text>
            </View>
            <Text style={styles.reducedOrderText}>reduced for orders above {currencyFormat(cartList?.contactDetailsSmallOrder?.small_order_min_amount ?? 0)} </Text>
        </View>
    );
};

export default TextSMRender;

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        marginTop: 10,
    },
    smallMainView: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    smallText: {
        flex: 1,
        fontSize: RFValue(13),
        fontFamily: fonts.medium,
        color: colors.color64
    },
    smCutAmount: {
        fontSize: RFValue(14),
        fontFamily: fonts.medium,
        color: colors.black50,
        marginRight: '1%',
        textDecorationLine: 'line-through',
    },
    smShowAmount: {
        fontSize: RFValue(14),
        fontFamily: fonts.medium,
        color: colors.color83
    },
    reducedOrderText: {
        fontSize: RFValue(12),
        fontFamily: fonts.medium,
        color: colors.green,
        marginTop: '1%'
    }

});
