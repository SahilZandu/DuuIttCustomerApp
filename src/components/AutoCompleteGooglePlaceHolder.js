import React, { useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
  View,
  Text,
} from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { SvgXml } from 'react-native-svg';
import { appImagesSvg } from '../commons/AppImages';
import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts/fonts';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';




const AutoCompleteGooglePlaceHolder = ({ onPressAddress, address }) => {
  const GooglePlacesRef = useRef();
  const textInputRef = useRef();

  useEffect(() => {
    GooglePlacesRef.current?.setAddressText(address);
  }, [address]);

  const handleClosePress = () => {
    // bottomSheetRef.current?.collapse(snapPoints);
  }

  const ClearData = async () => {
    // console.log(" GooglePlacesRef?.current", GooglePlacesRef?.current)
    await GooglePlacesRef?.current?.setAddressText('')

  };


  const addressSet = (data, details) => {
    // console.log("data, details--",data, details)
    onPressAddress(data, details)

  }


  return (
    <View style={{ position: 'absolute' }}>
      <View style={styles.autoCompleteSubConatiner}>
        <GooglePlacesAutocomplete
          ref={GooglePlacesRef}
          fetchDetails={true}
          placeholder="Enter Location"
          query={{
            key: 'AIzaSyAGYLXByGkajbYglfVPK4k7VJFOFsyS9EA',
            language: 'en',
            type: ['geocode', 'hotel'],
            location: '30.7400,76.7900', // Central point between Mohali & Chandigarh
            radius: 15000, // Covers both cities
            components: 'country:ind',// Optional: limit to India
            // strictbounds: true,
          }}
          // locationBias={{
          //   southwest: {
          //     latitude: 30.6196,
          //     longitude: 76.6010,
          //   },
          //   northeast: {
          //     latitude: 30.8501,
          //     longitude: 76.9058,
          //   },
          // }}
          returnKeyType={'search'}
          //   predefinedPlaces={getRestuarant}
          listEmptyComponent={() => (
            <View
              style={{
                margingBottom: hp('2%'),
                marginLeft: hp('1%'),
                marginTop: hp('0%'),
                backgroundColor: 'white',
                height: hp('5%'),
                justifyContent: 'center',
                alignItems: 'center'
              }}>
              <Text
                style={{
                  fontSize: RFValue(12),
                  fontFamily: fonts.semiBold,
                  color: colors.black,
                }}>
                No results were found
              </Text>
            </View>
          )}
          onPress={(data, details = null) => {
            console.log("data, details", data, details)
            addressSet(data, details)
            // GetDirectionRoutes(details);
          }}
          textInputProps={{
            clearButtonMode: 'never',
            ref: textInputRef,
            placeholderTextColor: '#8F8F8F',
            onFocus: () => handleClosePress(),
          }}
          renderRightButton={() => (
            <View style={{ flexDirection: 'row' }}>
              <TouchableOpacity
                activeOpacity={0.8}
                hitSlop={{ top: 10, bottom: 10, left: 15, right: 15 }}
                style={{ justifyContent: 'center' }}
                onPress={() => ClearData()}>
                <SvgXml xml={appImagesSvg.crossBlackIcon} />
              </TouchableOpacity>
            </View>
          )}
          styles={{
            textInputContainer: { ...styles.textinputContainer },
            textInput: { ...styles.textInput },
            // row: {...styles.row},
            // description: {...styles.description},
          }}
          renderLeftButton={() => (
            <SvgXml xml={appImagesSvg.searchIconGreen} />
          )}
          renderRow={(rowData) => {
            console.log("rowData--", rowData);

            return (
              <View style={styles.customRowContainer}>
                <Text style={styles.customMainText}
                  numberOfLines={2}>
                  {rowData?.structured_formatting?.main_text}
                </Text>
                <Text style={styles.customSecondaryText} numberOfLines={3}>
                  {rowData?.structured_formatting?.secondary_text}
                </Text>
              </View>
            );
          }}
          onFail={error => console.log(error)}
          onNotFound={() => console.log('no results')}
        />
      </View>
    </View>

  );
};

export default AutoCompleteGooglePlaceHolder;


const styles = StyleSheet.create({
  autoCompleteSubConatiner: {
    width: wp('100%'),
    paddingHorizontal: hp('2.4%'),
    backgroundColor: 'transparent',
    padding: hp('2%'),
    alignSelf: 'center'

  },
  textinputContainer: {
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: 'white',
    width: wp('90%'),
    borderWidth: 0.5,
    borderColor: colors.black25,
    borderRadius: 10,
    paddingHorizontal: hp('2%'),
    height: hp('6%'),
  },
  textInput: {
    fontFamily: fonts.regular,
    color: '#000000',
    backgroundColor: 'white',
    fontSize: RFValue(12),
    marginBottom: 0,
    height: hp('5%'),
  },
  // row: {
  //   // width: wp("100%"),
  //   height: 50,
  // },
  // description: {
  //   color:colors.black,
  //   fontFamily:fonts.regular,
  //   fontSize: RFValue(12),
  // },
  customRowContainer: {
    flexDirection: 'column',
    // paddingVertical: hp('1%'),
    paddingHorizontal: hp('1%'),
    backgroundColor: colors.white,
  },

  customMainText: {
    fontSize: RFValue(12),
    fontFamily: fonts.semiBold,
    color: colors.black,
    maxWidth: hp("38%"),
  },

  customSecondaryText: {
    fontSize: RFValue(12),
    fontFamily: fonts.regular,
    color: colors.black,
    flexWrap: 'wrap',
    marginTop: '1%',
    maxWidth: hp("37%"),
    lineHeight: hp('2%'),
  },

})