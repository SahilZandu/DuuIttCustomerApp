import {useFocusEffect} from '@react-navigation/native';
import {Formik, useFormikContext} from 'formik';
import React, {useCallback, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Image,
  TouchableOpacity,
} from 'react-native';
import CTA from '../../../../../components/cta/CTA';
import Header from '../../../../../components/header/Header';
import InputFieldMultiLine from '../../../../../components/InputFieldMultiLine';
import GiftSliderFlatList from '../../../../../components/slider/giftSlider';
import Tabs from '../../../../../components/Tabs';
import TabTextIcon from '../../../../../components/TabTextIcon';
import AppInputScroll from '../../../../../halpers/AppInputScroll';
import Spacer from '../../../../../halpers/Spacer';
import {styles} from './styles';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import ClaimGiftCards from '../../../../../components/ClaimGiftCards';
import ModalPopUpTouch from '../../../../../components/ModalPopUpTouch';
import BTN from '../../../../../components/cta/BTN';
import DotTextComp from '../../../../../components/DotTextComp';
import {giftMessageValidations} from '../../../../../forms/formsValidation/giftMessageValidations';
import {currencyFormat} from '../../../../../halpers/currencyFormat';
import {colors} from '../../../../../theme/colors';
import {Strings} from '../../../../../translates/strings';
import {
  giftCardsArray,
  giftImageArray,
} from '../../../../../stores/DummyData/Offers';
import handleAndroidBackButton from '../../../../../halpers/handleAndroidBackButton';

const tabsGift = [
  {text: 'Birthday'},
  {text: 'Anniversary'},
  {text: 'Wedding'},
  {text: 'Get well soon'},
];
let defaultTypeGift = 'Birthday';
const tabsRate = [
  {text: '100'},
  {text: '200'},
  {text: '500'},
  {text: '1000'},
  {text: '2000'},
];

const GiftCard = ({navigation}) => {
  const [value, onChangeText] = useState(0);
  const [initialValues, setInitialValues] = useState({
    feedback: '',
  });
  const [loading, setLoading] = useState(false);
  const [giftItems, setGiftItems] = useState(giftImageArray);
  const [giftSelectImage, setGiftSelectedImage] = useState({});
  const [claimGiftArray, setClaimGiftArray] = useState(giftCardsArray);
  const [isViewDetails, setIsViewDetails] = useState(false);
  const [claimGiftItem, setClaimGiftItem] = useState({});

  useFocusEffect(
    useCallback(() => {
      onHandleGiftImage(0);
      handleAndroidBackButton(navigation);
    }, []),
  );

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

  const handleTabGiftPress = async text => {
    defaultTypeGift = text;
    console.log('text--gift', text, defaultTypeGift);
  };

  const FormButton = ({loading, onPress}) => {
    const {dirty, isValid, values} = useFormikContext();
    return (
      <CTA
        // disable={!(isValid && dirty) || !(value > 0 && value)}
        title={Strings.continue}
        onPress={() => onPress(values)}
        loading={loading}
        textTransform={'capitalize'}
        width={wp('90%')}
      />
    );
  };

  const onHandleGiftImage = async index => {
    const res = await giftItems?.filter((item, i) => {
      return i == index;
    });
    // console.log("res--filter",res[0]);
    setGiftSelectedImage(res[0]);
  };

  const handleTabRatePress = async text => {
    onChangeText(text);
  };

  const handleContinue = value => {
    console.log('value -- ', value);
    navigation.navigate('giftCardPurchase');
  };

  const onViewDetails = item => {
    // navigation.navigate('claimGiftCard', {item: item});
    setClaimGiftItem(item);
    setIsViewDetails(true);
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={giftMessageValidations()}>
      <View style={{flex: 1, backgroundColor: colors.appBackground}}>
        <Header
          backArrow={true}
          title={'Gift Cards'}
          onPress={() => {
            navigation.goBack();
          }}
        />
        <KeyboardAvoidingView
          style={{flex: 1, marginTop: '1.5%'}}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <AppInputScroll
            Pb={'25%'}
            padding={true}
            keyboardShouldPersistTaps={'handled'}>
            <View style={styles.container}>
              <Tabs
                tabs={tabsGift}
                tabPress={handleTabGiftPress}
                imageHide={false}
              />
              <View style={{marginHorizontal: -20, marginLeft: 1}}>
                <GiftSliderFlatList
                  data={giftItems}
                  paginationList={true}
                  onHandleImage={onHandleGiftImage}
                />
              </View>
              <View style={styles.innerView}>
                <View style={styles.giftAmountView}>
                  <Text style={styles.giftCardAmount}>Gift Card Amount</Text>
                  <Text style={styles.giftAmount}>{currencyFormat(value)}</Text>
                </View>
                <View style={styles.addMoneyInnerView}>
                  <View style={styles.inputTextView}>
                    <Text
                      style={[
                        styles.rateText,
                        {
                          color:
                            value?.length > 0 ? colors.black : colors.color95,
                        },
                      ]}>
                      ₹
                    </Text>
                    <TextInput
                      placeholder="Enter Amount"
                      keyboardType="numeric"
                      maxLength={6}
                      onChangeText={text => onChangeText(text)}
                      value={value}
                      style={styles.inputText}
                    />
                  </View>
                  <Spacer space={'1%'} />
                  <TabTextIcon
                    isRating={true}
                    tabs={tabsRate}
                    tabPress={handleTabRatePress}
                  />
                </View>
              </View>
              <InputFieldMultiLine
                height={hp('14%')}
                inputLabel={'Add Message'}
                maxLength={100}
                name={'feedback'}
                placeholder={'Happy birthday dear ...'}
              />
              <Spacer space={'12%'} />

              <FormButton loading={loading} onPress={handleContinue} />
              <View style={styles.claimContainerView}>
                <Text style={styles.claimText}>Claim Gift Cards</Text>
                {claimGiftArray?.length > 0 ? (
                  <View style={styles.mapRenderView}>
                    {claimGiftArray?.map((item, index) => {
                      return (
                        <ClaimGiftCards
                          item={item}
                          index={index}
                          onViewPress={onViewDetails}
                        />
                      );
                    })}
                  </View>
                ) : (
                  <View style={styles.noDataView}>
                    <Text style={styles.noDataText}>
                      No Gift Cards Available
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </AppInputScroll>
        </KeyboardAvoidingView>
        <ModalPopUpTouch
          isVisible={isViewDetails}
          onOuterClose={() => {
            setIsViewDetails(false);
          }}>
          <View style={styles.modalMainView}>
            <Image style={styles.modalImage} source={claimGiftItem?.image} />

            <View style={styles.modalInnerView}>
              <View style={styles.textView}>
                <Text style={styles.giftCardDetails}>Gift Card Details</Text>
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

                <View style={styles.btnView}>
                  <BTN
                    backgroundColor={colors.white}
                    labelColor={colors.bottomBarColor}
                    width={wp('42')}
                    title={'QR code'}
                    textTransform={'capitalize'}
                    onPress={() => {
                      setIsViewDetails(false);
                      navigation.navigate('claimGiftQRCode', {
                        item: claimGiftItem,
                      });
                    }}
                  />
                  <BTN
                    width={wp('42')}
                    title={'Claim'}
                    textTransform={'capitalize'}
                  />
                </View>
              </View>
            </View>
          </View>
        </ModalPopUpTouch>
      </View>
    </Formik>
  );
};

export default GiftCard;
