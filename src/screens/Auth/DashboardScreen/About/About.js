import React, { useCallback,} from 'react';
import { View,} from 'react-native';
import Header from '../../../../components/header/Header';
import { useFocusEffect } from '@react-navigation/native';
import handleAndroidBackButton from '../../../../halpers/handleAndroidBackButton';
import { styles } from './styles';
import AppInputScroll from '../../../../halpers/AppInputScroll';
import TouchTextRightIconComp from '../../../../components/TouchTextRightIconComp';
import { appImagesSvg } from '../../../../commons/AppImages';

export default function About({ navigation }) {


    useFocusEffect(
        useCallback(() => {
            handleAndroidBackButton(navigation);
        }, []),
    );


    const aboutOptions = [
        {
            id: '1',
            title: 'Terms and conditions',
            onPress: () => {
                navigation.navigate('myWebComponent', {
                    type: 'terms',
                });
            },
            icon: appImagesSvg.aboutSvg,
            show: true,
            disable: false,
        },
        {
            id: '2',
            title: 'Privacy Policy',
            onPress: () => {
                navigation.navigate('myWebComponent', {
                    type: 'policy',
                });
            },
            icon: appImagesSvg.aboutSvg,
            show: true,
            disable: false,
        },
        {
            id: '3',
            title: 'Open source library',
            onPress: () => {
                navigation.navigate('myWebComponent', {
                    type: 'policy',
                });
            },
            icon: appImagesSvg.aboutSvg,
            show: true,
            disable: true,
        },
        {
            id: '4',
            title: ' ',
            onPress: () => {
                console.log('aboutSvg');
            },
            icon: appImagesSvg.aboutSvg,
            show: false,
            disable: true,
        },
    ];





    return (
        <View style={styles.container}>
            <Header
                bottomLine={true}
                onPress={() => {
                    navigation.goBack();
                }}
                title={'About'}
                backArrow={true}
            />

            <AppInputScroll
                Pb={'20%'}
                padding={true}
                keyboardShouldPersistTaps={'handled'}>
                <View style={{ marginHorizontal: 5, justifyContent: 'center' }}>
                    <TouchTextRightIconComp firstIcon={false} data={aboutOptions} />
                </View>
            </AppInputScroll>
        </View>
    );
}
