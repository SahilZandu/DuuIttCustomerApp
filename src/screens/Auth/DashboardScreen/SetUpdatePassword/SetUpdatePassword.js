import React, { useState, useEffect } from 'react';
import {
    Text,
    View,
    StyleSheet,
    ScrollView,
} from 'react-native';
import { styles } from './styles';
import Header from '../../../../components/header/Header';
import UserSetPasswordForm from '../../../../forms/UserSetPasswordForm';
import UserUpdatePasswordForm from '../../../../forms/UserUpdatePasswordForm';
import { rootStore } from '../../../../stores/rootStore';
import { AppEvents } from '../../../../halpers/events/AppEvents';




export default function SetUpdatePass({ navigation }) {
    const { appUser } = rootStore.commonStore;


    useEffect(() => {
        onAppEvents();
    }, [])

    const onAppEvents = async () => {
        try {
            await AppEvents({
                eventName: 'SetUpdatePass',
                payload: {
                    name: appUser?.name ?? '',
                    phone: appUser?.phone?.toString() ?? '',
                }
            })
        } catch (error) {
            console.log("Error---", error);
        }

    }


    return (
        <Wrapper
            edges={['left', 'right']}
            transparentStatusBar
            onPress={() => {
                navigation.goBack();
            }}
            // title={'Set Password'}
            title={(appUser?.password && appUser?.password?.toString()?.length > 0) ? "Update Password" : 'Set Password'}
            backArrow={true}
            showHeader
        >
            <View style={styles.container}>
                {/* <Header
                onPress={() => {
                    navigation.goBack();
                }}
                // title={'Set Password'}
                title={(appUser?.password && appUser?.password?.toString()?.length > 0) ? "Update Password" : 'Set Password'}
                backArrow={true}
            /> */}
                <ScrollView
                    bounces={false}
                    keyboardShouldPersistTaps={'handled'}
                    style={{ flex: 1 }}>
                    <View style={styles.screen}>
                        {(appUser?.password && appUser?.password?.toString()?.length > 0)
                            ? <UserUpdatePasswordForm navigation={navigation} />
                            : <UserSetPasswordForm navigation={navigation} />}
                    </View>
                </ScrollView>
            </View>
        </Wrapper>
    );
}

