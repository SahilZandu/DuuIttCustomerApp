

import React, { useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, TextInput } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { SvgXml } from 'react-native-svg';
import { appImagesSvg } from '../commons/AppImages';
import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts/fonts';

const SearchButtonInputComp = ({ onBackPress, value, onChangeText, onFocus, onBlur, onCancelPress, onMicroPhone }) => {
    const searchInputRef = useRef(null);
    return (
        <View
            style={{
                flexDirection: 'row',
                justifyContent: 'center',
                marginHorizontal: '4%',
                marginTop: '1%',
            }}>
            <View

                style={{
                    width: wp('90%'),
                    flexDirection: 'row',
                    alignItems: 'center',
                    alignSelf: 'center',
                    borderRadius: 10,
                    borderWidth: 1,
                    borderColor: colors.colorD9,
                    backgroundColor: colors.screenBackground,
                }}>
                <TouchableOpacity
                    onPress={onBackPress}
                    activeOpacity={0.8}
                    hitSlop={{ top: 15, bottom: 10, left: 5, right: 5 }}>
                    <SvgXml
                        width={20}
                        height={20}
                        xml={appImagesSvg.backGreenBtn}
                        style={{ left: wp('1.5%') }}
                    />
                </TouchableOpacity>

                <TextInput
                    ref={searchInputRef}
                    value={value}
                    onChangeText={onChangeText}
                    placeholderTextColor="#808080"
                    placeholder="Search"
                    style={{
                        width: wp('68.5%'),
                        height: hp('5%'),
                        paddingLeft: '3%',
                        paddingRight: '2%',
                        fontSize: RFValue(12),
                        color: colors.black,
                        padding: 0,
                    }}
                    onFocus={onFocus}
                    onBlur={onBlur}
                />
                {value?.length > 0 ? (
                    <TouchableOpacity
                        onPress={onCancelPress}
                        activeOpacity={0.8}
                        hitSlop={{ top: 15, bottom: 10, left: 5, right: 5 }}>
                        <SvgXml
                            width={21}
                            height={21}
                            xml={appImagesSvg.cancelSvg2}
                            style={{ right: wp('0.1%') }}
                        />
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity
                        // onPress={() => {
                        //   handleSearchButtonPress();
                        // }}
                        activeOpacity={0.8}
                        hitSlop={{ top: 15, bottom: 10, left: 5, right: 5 }}>
                        <SvgXml
                            width={20}
                            height={20}
                            xml={appImagesSvg.searchIcon}
                            style={{ right: wp('0.7%') }}
                        />
                    </TouchableOpacity>
                )}
                <View
                    style={{
                        height: 23,
                        width: 2,
                        backgroundColor: '#A9A9AA',
                        left: wp('1.5%'),
                    }}></View>
                <TouchableOpacity
                    onPress={onMicroPhone}
                    activeOpacity={0.8}
                    hitSlop={{ top: 15, bottom: 10, left: 5, right: 5 }}
                    style={{ left: wp('3%') }}>
                    <SvgXml width={20} height={20} xml={appImagesSvg.microPhoneSvg} />
                </TouchableOpacity>
            </View>
        </View>

    );
};

export default SearchButtonInputComp;

const styles = StyleSheet.create({

});





