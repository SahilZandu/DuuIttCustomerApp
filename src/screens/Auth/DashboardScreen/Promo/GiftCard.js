import {useFocusEffect} from '@react-navigation/native';
import {useFormikContext} from 'formik';
import React, {useCallback, useState} from 'react';
import {
  View,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  TextInput,
} from 'react-native';
import {Surface} from 'react-native-paper';
import {RFValue} from 'react-native-responsive-fontsize';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {appImages} from '../../../../commons/AppImages';
import CTA from '../../../../components/cta/CTA';
import InputFieldMultiLine from '../../../../components/InputFieldMultiLine';
import RewardsTwoItemComp from '../../../../components/RewardsTwoItemComp';
import GiftSliderFlatList from '../../../../components/slider/giftSlider';
import Tabs from '../../../../components/Tabs';
import TabTextIcon from '../../../../components/TabTextIcon';
import {currencyFormat} from '../../../../halpers/currencyFormat';
import Spacer from '../../../../halpers/Spacer';
import {promoRewards, promoVouchers} from '../../../../stores/DummyData/Promo';
import {colors} from '../../../../theme/colors';
import {fonts} from '../../../../theme/fonts/fonts';
import {Strings} from '../../../../translates/strings';

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

let imageArray = [
  {id: 1, image: appImages.sliderImage1},
  {id: 2, image: appImages.sliderImage2},
  {id: 3, image: appImages.sliderImage1},
  {id: 4, image: appImages.sliderImage2},
];

const GiftCard = ({navigation}) => {
  const [value, onChangeText] = useState(0);
  const [initialValues, setInitialValues] = useState({
    feedback: '',
  });
  const [loading, setLoading] = useState(false);
  const [giftItems, setGiftItems] = useState(imageArray);
  const [giftSelectImage, setGiftSelectedImage] = useState({});

  useFocusEffect(
    useCallback(() => {
      onHandleGiftImage(0);
    }, []),
  );

  const handleTabGiftPress = async text => {
    defaultTypeGift = text;
    console.log('text--gift', text);
  };

  const FormButton = ({loading, onPress}) => {
    const {dirty, isValid, values} = useFormikContext();
    return (
      <CTA
        disable={!(isValid && dirty) || !(value > 0 && value)}
        title={Strings.continue}
        onPress={() => onPress(values)}
        loading={loading}
        textTransform={'capitalize'}
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
  };

  return (
    <View style={styles.container}>
      <Text style={styles.giftCardText}>Gift Cards</Text>
      <Tabs tabs={tabsGift} tabPress={handleTabGiftPress} imageHide={false} />
      <GiftSliderFlatList
        data={giftItems}
        paginationList={true}
        onHandleImage={onHandleGiftImage}
      />
      <View style={styles.innerView}>
        <View style={styles.giftAmountView}>
          <Text style={styles.giftCardAmount}>Gift Card Amount</Text>
          <Text style={styles.giftAmount}>{currencyFormat(value)}</Text>
        </View>
        <Surface elevation={2} style={styles.addMoneyShadow}>
          <View style={styles.addMoneyInnerView}>
            <View style={styles.inputTextView}>
              <Text
                style={[
                  styles.rateText,
                  {
                    color: value?.length > 0 ? colors.black : colors.color95,
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
            <Spacer space={'2%'} />
            <TabTextIcon
              isRating={true}
              tabs={tabsRate}
              tabPress={handleTabRatePress}
            />
          </View>
        </Surface>
      </View>
      <InputFieldMultiLine
        inputLabel={'Add message'}
        maxLength={250}
        name={'feedback'}
        placeholder={'Happy birthday dear ...'}
      />
      <Spacer space={'13%'} />

      <FormButton loading={loading} onPress={handleContinue} />
    </View>
  );
};

export default GiftCard;

const styles = StyleSheet.create({
  container: {
    marginTop: '5%',
  },
  giftCardText: {
    fontSize: RFValue(13),
    fontFamily: fonts.medium,
    color: colors.black,
    textAlign: 'center',
  },
  addMoneyShadow: {
    shadowColor: colors.black,
    backgroundColor: colors.white,
    alignSelf: 'center',
    borderRadius: 10,
    width: wp('90%'),
    height: hp('17%'),
    marginTop: '5%',
    borderWidth: 1,
    borderColor: colors.colorD9,
  },
  addMoneyInnerView: {
    marginHorizontal: 24,
    marginTop: '6%',
  },
  addMoneyText: {
    fontSize: RFValue(17),
    fontFamily: fonts.semiBold,
    color: colors.black,
  },
  inputTextView: {
    height: hp('5.6%'),
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.colorB6,
    alignItems: 'center',
    flexDirection: 'row',
  },
  rateText: {
    marginLeft: '4%',
    fontSize: RFValue(13),
    fontFamily: fonts.medium,
    color: colors.black,
  },
  inputText: {
    padding: 5,
    borderRadius: 10,
    height: hp('5.6%'),
    width: wp('74%'),
    ontSize: RFValue(13),
    fontFamily: fonts.medium,
  },
  innerView: {
    marginTop: '3%',
  },
  giftAmountView: {
    flexDirection: 'row',
  },
  giftCardAmount: {
    flex: 1,
    fontSize: RFValue(12),
    fontFamily: fonts.medium,
    color: colors.black,
  },
  giftAmount: {
    fontSize: RFValue(12),
    fontFamily: fonts.medium,
    color: colors.black,
  },
});
