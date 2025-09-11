import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
    Text,
    TouchableOpacity,
    View,
    Image,
    Dimensions,
    KeyboardAvoidingView,
    Platform,
    Keyboard,
} from 'react-native';
import { styles } from './styles';
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { RFValue } from 'react-native-responsive-fontsize';
import { fonts } from '../../../theme/fonts/fonts';
import { colors } from '../../../theme/colors';
import AppInputScroll from '../../../halpers/AppInputScroll';
import handleAndroidBackButton from '../../../halpers/handleAndroidBackButton';
import { useFocusEffect } from '@react-navigation/native';
import Header from '../../../components/header/Header';
import MapRouteMarker from '../../../components/MapRouteMarker';
import AutoCompleteGooglePlaceHolder from '../../../components/AutoCompleteGooglePlaceHolder';
import { Formik, useFormikContext } from 'formik';
import FieldInput from '../../../components/FieldInput';
import Spacer from '../../../halpers/Spacer';
import CTA from '../../../components/cta/CTA';
import { Strings } from '../../../translates/strings';
import { addMyAddressValidations } from '../../../forms/formsValidation/addMyAddressValidations';
import LocationHistoryCard from '../../../components/LocationHistoryCard';
import { getCurrentLocation, setCurrentLocation } from '../../../components/GetAppLocation';
import { getGeoCodes, setMpaDaltaInitials } from '../../../components/GeoCodeAddress';
import { appImages } from '../../../commons/AppImages';
import Modal from 'react-native-modal';
import Tabs2 from '../../../components/Tabs2';
import { Surface } from 'react-native-paper';
import { rootStore } from '../../../stores/rootStore';
import AnimatedLoader from '../../../components/AnimatedLoader/AnimatedLoader';
import InputFieldLabel from '../../../components/InputFieldLabel';
import MapLocationRoute from '../../../components/MapLocationRoute';
import FieldErrorMessage from '../../../components/FieldErrorMessage';
import { Wrapper } from '../../../halpers/Wrapper';



let currentLocation = {
    lat: null,
    lng: null,
};
export default function AddRestaurantLocation({ navigation }) {
    const { setChangeLiveLocation } = rootStore.foodDashboardStore;
    const { appUser } = rootStore.commonStore
    const { setSelectedAddress } = rootStore.cartStore;
    const getLocation = type => {
        let d =
            type == 'lat'
                ? getCurrentLocation()?.latitude
                : getCurrentLocation()?.longitude;

        return d ? d : '';
    };
    const [loading, setLoading] = useState(false);
    const [geoLocation, setGeoLocation] = useState({
        lat: getLocation('lat'),
        lng: getLocation('lng'),
    });
    const [address, setAddress] = useState('');
    const [loactionId, setLocationId] = useState('');
    const [name, setName] = useState('');
    const [visible, setVisible] = useState(false);
    const [title, setTitle] = useState('Home');
    const [checkLocation, setCheckLocation] = useState(false)

    // const [initialValues, setInitialValues] = useState({
    //     changeAdress: address ?? '',
    //     changeTitle: 'Home',
    //     name: '',
    //     phone: '',
    //     house: '',
    //     landmark: '',
    //     id: data?._id,
    // });
    const [loadingAddress, setLoadingAddress] = useState(true);

    useEffect(() => {
        setGeoLocation({
            lat: getLocation('lat'),
            lng: getLocation('lng'),
        });
    }, []);

    useFocusEffect(
        useCallback(() => {
            setCurrentLocation();
            setMpaDaltaInitials();
            handleAndroidBackButton(navigation);
            currentLocation = {
                lat: getLocation('lat'),
                lng: getLocation('lng'),
            }
            // if (geoLocation && geoLocation?.lat) {
            //     getCurrentAddress();
            // }
        }, []),
    );

    // useEffect(() => {
    //     currentLocation = {
    //         lat: getLocation('lat'),
    //         lng: getLocation('lng'),
    //     }
    // }, []);

    useEffect(() => {
        if (address?.length > 0) {
            setLoadingAddress(false);
        } else {
            setTimeout(() => {
                setLoadingAddress(false);
            }, 2000);
        }
    }, [address]);

    const getCurrentAddress = async () => {
        const addressData = await getGeoCodes(geoLocation?.lat?.toString(), geoLocation?.lng?.toString());
        // console.log('addressData', addressData);
        const nameData = addressData?.address?.split(',');
        // console.log('nameData--', nameData[0]);
        setName(nameData[0]);
        setAddress(addressData?.address);
        setLocationId(addressData?.place_Id);
        setGeoLocation(addressData?.geo_location);
    };


    const onPressAddress = (data, details) => {
        setName(details?.name);
        setAddress(details?.formatted_address);
        setGeoLocation(details?.geometry?.location);
        setLocationId(details?.place_id);
    };

    const handleConfirm = () => {
        Keyboard.dismiss();
        console.log('geoLocation--', geoLocation, name, address);
        let data = {
            address: address,
            geoLocation: geoLocation
        }
        const orderAddress = {
            _id: "674007788c0213057bd1520c",
            address: address,
            address_detail: "Set Food Order Location",
            geo_location: geoLocation,
            landmark: "set Location",
            location_id: loactionId ?? "ChIJG4wjYojuDzkRE-yXH4TZiN0",
            name: appUser?.name ?? "No Name",
            phone: appUser?.phone ?? 9876543210,
            title: "Other"
        }

        setSelectedAddress(orderAddress);
        setChangeLiveLocation(data),
            navigation.goBack();
    };

    const handleCurrentAddress = async () => {
        setCurrentLocation();
        const addressData = await getGeoCodes(
            currentLocation?.lat,
            currentLocation?.lng,
        );
        // console.log('addressData', addressData);
        const nameData = addressData?.address?.split(',');
        // console.log('nameData--', nameData[0]);
        setName(nameData[0]);
        setAddress(addressData?.address);
        setLocationId(addressData?.place_Id);
        setGeoLocation(addressData?.geo_location);
    };

    const handleTouchAddress = async loaction => {
        console.log('loaction---', loaction);
        const addressData = await getGeoCodes(
            loaction?.latitude,
            loaction?.longitude,
        );
        // console.log('addressData', addressData);
        let newLocation = {
            lat: loaction?.latitude,
            lng: loaction?.longitude,
        };
        const nameData = addressData?.address?.split(',');
        // console.log('nameData--', nameData[0]);
        setName(nameData[0]);
        setAddress(addressData?.address);
        setLocationId(addressData?.place_Id);
        //setGeoLocation(addressData?.geo_location);
        setGeoLocation(newLocation);
    };

    return (
        <Wrapper
            edges={['left', 'right']}
            transparentStatusBar
            title={'Choose Your Location'}
            backArrow={true}
            onPress={() => {
                navigation.goBack();
            }}
            showHeader
        >
            <View style={styles.container}>
                {/* <Header
                title={'Choose Your Location'}
                backArrow={true}
                onPress={() => {
                    navigation.goBack();
                }}
            /> */}
                <View style={styles.main}>
                    <View style={{ height: Platform.OS == 'ios' ? hp('66%') : hp('74%'), }}>
                        <MapLocationRoute
                            mapContainerView={{
                                height: Platform.OS == 'ios' ? hp('66%') : hp('74%'),
                            }}
                            origin={geoLocation}
                            onTouchLocation={handleTouchAddress}
                            height={Platform.OS == 'ios' ? hp('66%') : hp('74%')}
                            onCheckLocation={(data) => setCheckLocation(data)}
                            checkLocation={checkLocation}
                        />
                        <AutoCompleteGooglePlaceHolder
                            onPressAddress={onPressAddress}
                            address={address}
                        />
                    </View>
                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => {
                            handleCurrentAddress();
                        }}
                        style={styles.currentLocTouch}>
                        <View style={styles.currentLocView}>
                            <Image
                                resizeMode="contain"
                                style={styles.currentLocImage}
                                source={appImages.currentLocationIcon}
                            />
                            <Text style={styles.currentLocText}>Current location</Text>
                        </View>
                    </TouchableOpacity>

                    <View style={styles.addressView}>
                        {!address?.length > 0 ? (
                            <View>
                                {loadingAddress == true ? (
                                    <AnimatedLoader type={'addMyAddress'} />
                                ) : (
                                    <Text style={styles.chooseText}>Please choose location...</Text>
                                )}
                            </View>
                        ) : (
                            <View style={styles.addressContainView}>
                                <LocationHistoryCard
                                    bottomLine={true}
                                    item={{
                                        name: name,
                                        address: address,
                                    }}
                                    index={0}
                                    onPress={() => { }}
                                />
                                <Spacer space={hp('3.5%')} />
                                <CTA
                                    disable={!(address || name) || checkLocation}
                                    onPress={() => {
                                        handleConfirm();
                                    }}
                                    title={'Confirm'}
                                    textTransform={'capitalize'}
                                    bottomCheck={10}
                                />
                            </View>
                        )}
                    </View>
                </View>
            </View>
        </Wrapper>
    );
}

