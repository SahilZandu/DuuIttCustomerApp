import React, {useEffect, useState, useRef, useCallback} from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  Image,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  FlatList,
  DeviceEventEmitter,
} from 'react-native';
import {appImages, appImagesSvg} from '../../../commons/AppImages';
import {styles} from './styles';
import {SvgXml} from 'react-native-svg';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {RFValue} from 'react-native-responsive-fontsize';
import {fonts} from '../../../theme/fonts/fonts';
import {colors} from '../../../theme/colors';
import AppInputScroll from '../../../halpers/AppInputScroll';
import handleAndroidBackButton from '../../../halpers/handleAndroidBackButton';
import {useFocusEffect} from '@react-navigation/native';
import Header from '../../../components/header/Header';
import CTA from '../../../components/cta/CTA';
import {insert} from 'formik';
import AddressCard from '../../../components/AddressCard';
import {rootStore} from '../../../stores/rootStore';
import MyAddressLoader from '../../../components/AnimatedLoader/MyAddressLoader';
import AnimatedLoader from '../../../components/AnimatedLoader/AnimatedLoader';
import PopUp from '../../../components/appPopUp/PopUp';
import {fetch} from '@react-native-community/netinfo';
import NoInternet from '../../../components/NoInternet';

export default function MyAddress({navigation, route}) {
  const {screenName} = route.params || {};
  console.log('screenName---', screenName);
  const {getMyAddress, getAddress, deleteMyAddress} = rootStore.myAddressStore;

  const [loading, setLoading] = useState(getAddress?.length > 0 ? false : true);
  const [myAddress, setMyAddress] = useState(getAddress);
  const [isDelete, setIsDelete] = useState(false);
  const [isDeleteIndex, setIsDeleteIndex] = useState('');
  const [isDeleteItem, setIsDeleteItem] = useState('');
  const [internet, setInternet] = useState(true);

  useFocusEffect(
    useCallback(() => {
      checkInternet();
      handleAndroidBackButton(navigation);
      getAddressDetails();
    }, []),
  );

  useEffect(() => {
    DeviceEventEmitter.addListener('tab2', event => {
      if (event != 'noInternet') {
      }
      setInternet(event == 'noInternet' ? false : true);
      console.log('internet event');
    });
  }, []);

  const checkInternet = () => {
    fetch().then(state => {
      setInternet(state.isInternetReachable);
    });
  };

  const getAddressDetails = async () => {
    const res = await getMyAddress();
    console.log('res---getAddressDetails', res);
    setMyAddress(res);
    setLoading(false);
  };

  const handleDelete = async () => {
    //  console.log("isDeleteIndex,isDeleteItem",isDeleteIndex,isDeleteItem)
    await deleteMyAddress('delete', isDeleteItem, onSuccess, handleLoading);
  };

  const onSuccess = () => {
    myAddress.splice(isDeleteIndex, 1);
    setMyAddress([...myAddress]);
    setIsDelete(false);
  };

  const handleLoading = v => {
    setIsDelete(v);
  };

  const renderItem = ({item, index}) => {
    return (
      <AddressCard
        item={item}
        index={index}
        onPress={() => {
          navigation.navigate('addMyAddress', {
            type: 'update',
            data: item,
            screenName: screenName,
          });
        }}
        onPressDot={() => {
          setIsDelete(true), setIsDeleteIndex(index);
          setIsDeleteItem(item);
        }}
      />
    );
  };

  return (
    <View style={styles.container}>
      <Header
        title={'My Address'}
        // backArrow={true}
        onPress={() => {
          navigation.goBack();
        }}
      />
      {internet == false ? (
        <NoInternet />
      ) : (
        <>
          {loading == true ? (
            <AnimatedLoader type={'myAddress'} />
          ) : (
            <>
              <View style={styles.main}>
                {myAddress?.length > 0 ? (
                  <FlatList
                    contentContainerStyle={{paddingBottom: '20%'}}
                    showsVerticalScrollIndicator={false}
                    data={myAddress}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                  />
                ) : (
                  <View style={styles.noDataView}>
                    <Text style={styles.noDataText}>No Data Found</Text>
                  </View>
                )}
              </View>
              <View style={styles.btnView}>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('addMyAddress', {
                      type: 'add',
                      data: undefined,
                      screenName: screenName,
                    });
                  }}
                  activeOpacity={0.8}
                  style={styles.btnTouch}>
                  <SvgXml
                    width={50}
                    height={50}
                    xml={appImagesSvg.addAddresBtn}
                  />
                </TouchableOpacity>
              </View>
            </>
          )}

          <PopUp
            visible={isDelete}
            type={'delete'}
            onClose={() => setIsDelete(false)}
            title={'You are about to delete an item'}
            text={'This will delete your item from the address are your sure?'}
            onDelete={handleDelete}
          />
        </>
      )}
    </View>
  );
}
