import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
    View,
    Text,
    Platform,
    TouchableOpacity,
    Image
} from 'react-native';
import { styles } from './styles';
import Header from '../../../../../components/header/Header';
import AppInputScroll from '../../../../../halpers/AppInputScroll';
import { useFocusEffect } from '@react-navigation/native';
import handleAndroidBackButton from '../../../../../halpers/handleAndroidBackButton';
import { colors } from '../../../../../theme/colors';
import { screenHeight } from '../../../../../halpers/matrics';
import { Surface } from 'react-native-paper';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { currencyFormat } from '../../../../../halpers/currencyFormat';
import DotedLine from '../../../../DUFood/Components/DotedLine';
import { RFValue } from 'react-native-responsive-fontsize';
import { fonts } from '../../../../../theme/fonts/fonts';
import Tabs from '../../../../../components/Tabs';
import { appImages, appImagesSvg } from '../../../../../commons/AppImages';
import moment from 'moment';
import TouchTextRightIconComp from '../../../../../components/TouchTextRightIconComp';
import TransationHistComp from '../../../../../components/TransationHistComp';


const DuuIttCredit = ({ navigation }) => {
    const [type, setType] = useState('All');

    useFocusEffect(
        useCallback(() => {
            handleAndroidBackButton(navigation)
        }, [])
    )

    let transationHistory = [
        {
            id: '0',
            name: 'Wesley Mcclaflin',
            image: appImages.avtarImage,
            date: new Date(),
            price: 300
        },
        {
            id: '1',
            name: 'Wesley Mcclaflin',
            image: appImages.avtarImage,
            date: new Date(),
            price: 200
        },
        
    ]


    return (
        <View style={styles.main}>
            <Header
                backArrow={true}
                title={'DuuItt Credit'}
                onPress={() => {
                    navigation.goBack();
                }}
            />
            <AppInputScroll
                Pb={'25%'}
                padding={true} keyboardShouldPersistTaps={'handled'}>
                <View style={styles.upperMainView}>
                    <Surface elevation={2} style={styles.surfaceView}>
                        <View style={styles.surfaceInnerView}>
                            <Text style={styles.valurText}>{currencyFormat(780.00)}</Text>
                            <Text style={styles.totalText}>{'Total Balance'}</Text>
                        </View>

                    </Surface>
                    <View>
                        <View style={styles.transationHistView}>
                            <Text style={styles.transationHistText}>Transaction History</Text>
                        </View>{transationHistory?.map((data, index) => {
                            return (
                                <TransationHistComp data={data} index={index} />

                            )
                        })}
                    </View>


                </View>
            </AppInputScroll>
        </View>
    );
};

export default DuuIttCredit;
