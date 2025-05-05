import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
    Alert,
    Platform,
    Text,
    Touchable,
    View,
    TouchableOpacity,
    Image,
} from 'react-native';
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import MapRoute from '../../../components/MapRoute';
import { styles } from './styles';
import LocationHistoryCard from '../../../components/LocationHistoryCard';
import CTA from '../../../components/cta/CTA';
import Spacer from '../../../halpers/Spacer';
import AutoCompleteGooglePlaceHolder from '../../../components/AutoCompleteGooglePlaceHolder';
import Header from '../../../components/header/Header';
import AnimatedLoader from '../../../components/AnimatedLoader/AnimatedLoader';
import { screenHeight } from '../../../halpers/matrics';
import { rootStore } from '../../../stores/rootStore';
import { appImages } from '../../../commons/AppImages';
import { getGeoCodes, setMpaDaltaInitials } from '../../../components/GeoCodeAddress';
import { getCurrentLocation } from '../../../components/GetAppLocation';
import MapLocationRoute from '../../../components/MapLocationRoute';
import { useFocusEffect } from '@react-navigation/native';
import handleAndroidBackButton from '../../../halpers/handleAndroidBackButton';

let currentLocation = {
    lat: null,
    lng: null,
};

const EditOrderLocation = ({ navigation, route }) => {
    const { pickDrop, item, orderItem } = route.params;
    console.log('pickDrop--EditOrderLocation', pickDrop, item, orderItem);
    const { editParcelsRides } = rootStore.parcelStore;
    const getLocation = type => {
        // console.log('gettt', getCurrentLocation());
        let d =
            type == 'lat'
                ? getCurrentLocation()?.latitude
                : getCurrentLocation()?.longitude;

        return d ? d : '';
    };
    const [geoLocation, setGeoLocation] = useState({
        lat: '',
        lng: '',
    });
    const [address, setAddress] = useState('');
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);

    useFocusEffect(
        useCallback(() => {
            handleAndroidBackButton(navigation)
            setMpaDaltaInitials();
        }, [])
    )

    useEffect(() => {
        setTimeout(() => {
            if (item?.geo_location?.lat) {
                setGeoLocation(item?.geo_location);
                setAddress(item?.address);
                setName(item?.name);
            }
        }, 1000);
    }, [item]);

    useEffect(() => {
        currentLocation = {
            lat: getLocation('lat'),
            lng: getLocation('lng'),
        };
    }, []);

    const mohaliChandigarhBounds = {
        north: 30.8258,
        south: 30.6600,
        west: 76.6600,
        east: 76.8500,
    };

    const isWithinBounds = (latitude, longitude) => {
        return (
            latitude <= mohaliChandigarhBounds.north &&
            latitude >= mohaliChandigarhBounds.south &&
            longitude >= mohaliChandigarhBounds.west &&
            longitude <= mohaliChandigarhBounds.east
        );
    };

    const handleRegionChangeComplete = (region) => {
        onHandleConfirm()
    };

    const onPressAddress = (data, details) => {
        console.log('data ,details 333', data, details);
        setName(details?.name);
        setAddress(details?.formatted_address);
        setGeoLocation(details?.geometry?.location);
    };




    const onHandleConfirm = async () => {
        const newItem = {
            ...item,
            address: address,
            geo_location: geoLocation,
        };
        console.log('newItem---', newItem, pickDrop);

        const requestData = {
            weight: orderItem?.weight ?? 20,
            quantity: orderItem?.quantity ?? 1,
            type: 'Others',
            sender_address: pickDrop == 'pick' ? newItem : orderItem?.sender_address,
            receiver_address: pickDrop !== 'pick' ? newItem : orderItem?.receiver_address,
            billing_detail: {
                delivery_fee: 0,
                distance_fee: 0,
                discount: 0,
                platform_fee: 2,
                gst_fee: 18
            },
            isSecure: orderItem?.secure ?? false,
            order_type: orderItem?.order_type ?? 'parcel',
            order_id: orderItem?._id,
        };
        console.log('requestData--', requestData);

        await editParcelsRides(requestData, navigation, handleLoading)

    };

    const handleLoading = (v) => {
        setLoading(v)
    }

    const handleCurrentAddress = async () => {
        const addressData = await getGeoCodes(
            currentLocation?.lat,
            currentLocation?.lng,
        );
        // console.log('addressData', addressData);
        const nameData = addressData?.address?.split(',');
        // console.log('nameData--', nameData[0]);
        setName(nameData[0]);
        setAddress(addressData?.address);
        setGeoLocation(addressData?.geo_location);
    };

    const handleTouchAddress = async (loaction) => {
        console.log("loaction---", loaction);
        const addressData = await getGeoCodes(
            loaction?.latitude,
            loaction?.longitude,
        );
        // console.log('addressData', addressData);
        const nameData = addressData?.address?.split(',');
        // console.log('nameData--', nameData[0]);
        let newLocation = {
            lat: loaction?.latitude,
            lng: loaction?.longitude,
        };
        setName(nameData[0]);
        setAddress(addressData?.address);
        // setGeoLocation(addressData?.geo_location);
        setGeoLocation(newLocation);

    };

    return (
        <View style={styles.container}>
            <Header
                title={'Choose On Map Location'}
                backArrow={true}
                onPress={() => {
                    navigation.goBack();
                }}
            />
            <View style={{ flex: 1 }}>

                <MapLocationRoute
                    mapContainerView={
                        Platform.OS == 'ios'
                            ? { height: screenHeight(70) }
                            : { height: screenHeight(74) }
                    }
                    origin={geoLocation}
                    onTouchLocation={handleTouchAddress}
                    height={Platform.OS == 'ios'
                        ? screenHeight(70)
                        : screenHeight(74)
                    }
                />
                {/* <MapRoute
          mapContainerView={
            Platform.OS == 'ios'
              ? {height: screenHeight(70)}
              : {height: screenHeight(74)}
          }
          origin={geoLocation}
        /> */}
                <AutoCompleteGooglePlaceHolder
                    onPressAddress={onPressAddress}
                    address={address}
                />
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
            </View>

            <View style={styles.bottomPopUpContainer}>
                <View style={{ paddingHorizontal: 30, marginTop: '3%' }}>
                    {!address?.length > 0 ? (
                        <AnimatedLoader type={'addMyAddress'} />
                    ) : (
                        <>
                            <LocationHistoryCard
                                bottomLine={true}
                                item={{ name: name, address: address }}
                                index={0}
                                onPress={() => { }}
                            />
                            <Spacer space={'12%'} />
                            <CTA
                                onPress={() => {
                                    handleRegionChangeComplete(geoLocation);
                                }}
                                title={'Confirm'}
                                textTransform={'capitalize'}
                                bottomCheck={10}
                                loading={loading}
                            />
                        </>
                    )}
                </View>
            </View>
        </View>
    );
};

export default EditOrderLocation;
