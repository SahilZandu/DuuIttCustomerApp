import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  Platform,
  Image,
  TouchableOpacity,
  Button,
} from 'react-native';
import {styles} from './styles';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {RFValue} from 'react-native-responsive-fontsize';
import Header from '../../../../../components/header/Header';
import AppInputScroll from '../../../../../halpers/AppInputScroll';
import DotTextComp from '../../../../../components/DotTextComp';
import QRCode from 'react-native-qrcode-svg';
import Share from 'react-native-share';

const ClaimGiftQRCode = ({navigation, route}) => {
  const {item} = route.params;
  const qrCodeRef = useRef();
  const [clainGift, setClaimGift] = useState(item);
  const [base64Image, setBase64Image] = useState(null);

  useEffect(() => {
   
    setTimeout(()=>{
        setClaimGift(item);
        generateBarcode();
    },200)
    
  }, [item]);

  let claimDetails = [
    {
      id: 1,
      title: 'Have a great day full of happiness!',
      amount: 0,
    },
    {
      id: 2,
      title: 'Gift card amount',
      amount: 2000,
    },

    {
      id: 3,
      title: 'This amount is directly enter in your wallet',
      amount: 0,
    },
  ];

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
        title={'Claim Gift Card'}
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
          {claimDetails?.map((item, i) => {
            return (
              <View style={{marginHorizontal: -10}}>
                <DotTextComp
                  title={item?.title}
                  index={i}
                  data={claimDetails}
                  amount={item?.amount}
                />
              </View>
            );
          })}
        </View>
      </AppInputScroll>
    </View>
  );
};

export default ClaimGiftQRCode;
