import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, Platform } from 'react-native';
import { Surface } from 'react-native-paper';
import { RFValue } from 'react-native-responsive-fontsize';
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { appImages, appImagesSvg } from '../commons/AppImages';
import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts/fonts';
import { currencyFormat } from '../halpers/currencyFormat';
import moment from 'moment';

const TransationHistComp = ({data,index}) => {

     const dateFormate = () => {
            const formattedDate = moment().format('MMM D, YYYY - hh:mm A');
            // console.log(formattedDate);
            return formattedDate
        }

    return (
        <View>
            <Surface elevation={2} style={styles.container}>
                <View style={styles.mainInnerView}>
                    <Image resizeMode='contain' style={styles.image} source={data?.image} />
                    <View style={{ flex: 1, marginHorizontal: '3%' }}>
                        <Text
                            numberOfLines={2}
                            style={styles.nameText}>
                            {data?.name}
                        </Text>
                        <Text style={styles.dateText}>
                            {dateFormate(data?.date)}
                            {/* {data?.date} */}
                        </Text>

                    </View>
                    {/* <View></View> */}
                    <Text style={styles.priceText}>{currencyFormat(Number(data?.price))}</Text>

                </View>
            </Surface>

        </View>
    );
};

export default TransationHistComp;

const styles = StyleSheet.create({
    container:{
        shadowColor: Platform.OS == 'ios' ? colors.black50 : colors.black,
        backgroundColor: colors.white,
        borderRadius: 10,
        minHeight: hp('9%'),
        width: wp('90%'),
        marginHorizontal: 20,
        marginTop:'4%',
        justifyContent: 'center',
    },
    mainInnerView:{
        flexDirection: 'row', alignItems: 'center', marginHorizontal: 20
    },
    image:{
        width: 50, height: 50, borderRadius: 100 
    },
    nameText:{
        fontSize: RFValue(11), fontFamily: fonts.semiBold, color: colors.black 
    },
    dateText:{
         fontSize: RFValue(11), fontFamily: fonts.medium, color: colors.color83,
                            marginTop: '4%'
    },
    priceText:{
        fontSize: RFValue(11), fontFamily: fonts.semiBold, color: colors.black 
    }

});
