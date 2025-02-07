import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
} from 'react-native';
import {styles} from './styles';
import Header from '../../../../../components/header/Header';
import AppInputScroll from '../../../../../halpers/AppInputScroll';
import DotTextComp from '../../../../../components/DotTextComp';
import QRCode from 'react-native-qrcode-svg';
import Share from 'react-native-share';
import { useFocusEffect } from '@react-navigation/native';
import handleAndroidBackButton from '../../../../../halpers/handleAndroidBackButton';
import DotTextExpireComp from '../../../../../components/DotTextExpireComp';

const RewardQRCode = ({navigation, route}) => {
  const {item} = route.params;
  const qrCodeRef = useRef();
  const [clainReward, setClainReward] = useState(item);
  const [base64Image, setBase64Image] = useState(null);

  useFocusEffect(
    useCallback(()=>{
      handleAndroidBackButton(navigation)
    },[])
  )


  useEffect(() => {
    setTimeout(()=>{
        setClainReward(item);
        generateBarcode();
    },200)
    
  }, [item]);


  const generateBarcode = () => {
    // Generate base64 string from the QRCode component
    qrCodeRef.current.toDataURL(data => {
      const base64ImageData = `data:image/png;base64,${data}`;
      setBase64Image(base64ImageData);
    });
  };

  const shareBarcode = async () => {
    if (!base64Image) {
      console.log('Base64 image not generated yet!');
      return;
    }

    try {
      // Share the barcode image
      await Share.open({
        url: base64Image,
        title: 'Share Barcode',
        message: 'Here is your barcode!',
      });
    } catch (error) {
      console.log('Error sharing barcode:', error);
    }
  };

  return (
    <View style={styles.main}>
      <Header
        backArrow={true}
        title={'Claim Reward QR Code'}
        onPress={() => {
          navigation.goBack();
        }}
        shareIcon={true}
        onPressShare={() => {
          shareBarcode();
        }}
      />
      <AppInputScroll padding={true} keyboardShouldPersistTaps={'handled'}>
        <View style={styles.upperMainView}>
          {/* Generate Barcode */}
          <QRCode
            value="1234567890"
            size={200}
            getRef={qrCodeRef} // Get the reference of the QRCode component
          />
          <Text
            style={styles.scanText}>
            Scan and clam to add the reward in your account
          </Text>
        </View>
        <View style={styles.DetailsView}>
          <Text
            style={styles.detailsText}>
            Details
          </Text>
          {clainReward?.data?.map((item, i) => {
            return (
              <View style={{marginHorizontal: -10}}>
                 {(item?.wallet ?? 0) > 0 ||
                      (item?.coupanCount ?? 0) > 0 ||
                      (item?.expireDate ?? 0) > 0 ? (
                        <DotTextExpireComp
                          item={item}
                          index={i}
                          data={clainReward?.data}
                        />
                      ) : (
                        <DotTextComp
                          title={item?.title}
                          index={i}
                          data={clainReward?.data}
                          amount={item?.amount}
                        />
                      )}
              </View>
            );
          })}
        </View>
      </AppInputScroll>
    </View>
  );
};

export default RewardQRCode;
