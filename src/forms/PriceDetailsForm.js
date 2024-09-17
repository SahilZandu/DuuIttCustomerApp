import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TextInput,
  Alert,
} from 'react-native';
import CTA from '../components/cta/CTA';
import {Formik, useFormik, useFormikContext} from 'formik';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import Spacer from '../halpers/Spacer';
import {Strings} from '../translates/strings';
import {appImages, appImagesSvg} from '../commons/AppImages';
import {SvgXml} from 'react-native-svg';
import AppInputScroll from '../halpers/AppInputScroll';
import {RFValue} from 'react-native-responsive-fontsize';
import {fonts} from '../theme/fonts/fonts';
import {colors} from '../theme/colors';
import {Surface} from 'react-native-paper';
import PickDropLocation from '../components/PickDropLocation';
import {useFocusEffect} from '@react-navigation/native';
import TabsTouch from '../components/TabsTouch';
import { rootStore } from '../stores/rootStore';
import HomeSlider from '../components/slider/homeSlider';


let categories = [
  {id: 1, active: 0, name: 'Documents'},
  {id: 2, active: 0, name: 'Glass'},
  {id: 3, active: 0, name: 'Liquid'},
  {id: 4, active: 0, name: 'Food'},
  {id: 5, active: 0, name: 'Electronic'},
  {id: 6, active: 0, name: 'Others'},
];


let imageArray = [
  {id: 1, image: appImages.sliderImage1},
  {id: 2, image: appImages.sliderImage2},
  {id: 3, image: appImages.sliderImage1},
  {id: 4, image: appImages.sliderImage2},
];


const PriceDetailsForm = ({navigation}) => {
  const {senderAddress , receiverAddress} = rootStore.myAddressStore;
  const {addRequestParcel} = rootStore.parcelStore;
  const [loading, setLoading] = useState(false);
  const [pickUpLocation, setPickUpLocation] = useState('');
  const [dropLocation, setDropLocation] = useState('');
  const [weight, setWeight] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [categoriesShow, setCategoriesShow] = useState(categories);
  const [selectCate, setSelectCate] = useState([]);
  const [sliderItems, setSliderItems] = useState(imageArray);



  useFocusEffect(
    useCallback(() => {
      getCheckSenderReceiverData()
    }, []),
  );

  useEffect(()=>{
    InitailsCate();
  },[])


  const getCheckSenderReceiverData =()=>{
    console.log("senderAddress,receiverAddress",senderAddress,receiverAddress)
    setPickUpLocation(senderAddress?.address)
    setDropLocation(receiverAddress?.address)
  }

  const InitailsCate = () => {
    categoriesShow?.map((value, i) => {
      value.active = 0;
      return {...value};
    });
    setCategoriesShow([...categoriesShow]);
    onSelectedCate(categoriesShow);
  };

  const handlePrice = async() => {
   const newdata ={
    weight:weight,
    quantity:quantity,
    type:selectCate[0],
    sender_address:senderAddress,
    receiver_address:receiverAddress,
    billing_detail:{delivery_fee:9,discount:0,platform_fee:10,gst:18}
   }
   console.log("newdata--",newdata)

  await addRequestParcel(newdata ,navigation,handleLoading)
  
    // navigation.navigate('priceConfirmed',{item:newdata});
  };

  const handleLoading =(v)=>{
    setLoading(v)
  }

  const onPressCategories = item => {
    categoriesShow?.map((value, i) => {
      if (value?.id == item?.id) {
        value.active = value?.active == 0 ? 1 : 0;
      }
      return {...value};
    });
    setCategoriesShow([...categoriesShow]);
    onSelectedCate(categoriesShow);
  };

  const onSelectedCate = cateArray => {
    const selectedArray = cateArray?.filter((item, i) => {
      return item.active == 1;
    });

    console.log('selectedArray--', selectedArray);

    setSelectCate([...selectedArray]);
  };

  const FormButton = ({loading, onPress}) => {
    return (
      <CTA
        disable={weight == '' || selectCate?.length == 0}
        title={'Proceed'}
        onPress={() => onPress()}
        loading={loading}
        isBottom={true}
        width={'90%'}
        textTransform={'capitalize'}
      />
    );
  };

  return (
    <View style={{flex: 1}}>
      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <AppInputScroll
          Pb={'25%'}
          padding={true}
          keyboardShouldPersistTaps={'handled'}>
          <View style={{flex: 1, marginHorizontal: 20}}>
            <PickDropLocation
              pickUpLocation={pickUpLocation}
              dropLocation={dropLocation}
            />

            <View style={{marginTop: '7%'}}>
              <Text style={styles.weightText}>Weight</Text>
              <Surface elevation={2} style={styles.weightTextSurface}>
                <View style={styles.weightInnerView}>
                  <Image
                    resizeMode="contain"
                    style={styles.weightImage}
                    source={appImages.weightIcon}
                  />
                  <TextInput
                    placeholderTextColor={colors.color95}
                    keyboardType="numeric"
                    style={styles.weightTextInput}
                    onChangeText={setWeight}
                    value={weight}
                    placeholder="Enter your package weight"
                  />
                  <Text style={styles.weightKGText}>Kg</Text>
                </View>
              </Surface>
            </View>
            <View style={{marginTop: '7%'}}>
              <Text style={styles.quantityText}>Package Quantity</Text>
              <Surface elevation={2} style={styles.quantitySurface}>
                <View style={styles.quantitInnerView}>
                  <Text style={styles.quantity}>{quantity} Package</Text>
                  <View style={{flexDirection: 'row'}}>
                    <TouchableOpacity
                      onPress={() => {
                        if (quantity > 1) {
                          setQuantity(quantity - 1);
                        }
                      }}
                      activeOpacity={0.8}
                      style={styles.touchNegative}>
                      <Image
                        resizeMode="contain"
                        style={styles.negativeImage}
                        source={appImages.negativeIcon}
                      />
                    </TouchableOpacity>
                    <Text>{'  '}</Text>
                    <TouchableOpacity
                      onPress={() => {
                        if (quantity < 20) {
                          setQuantity(quantity + 1);
                        }
                      }}
                      activeOpacity={0.8}
                      style={styles.touchPositive}>
                      <Image
                        resizeMode="contain"
                        style={styles.positiveImage}
                        source={appImages.positiveIcon}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </Surface>
            </View>

            <View style={{marginTop: '7%'}}>
              <Text style={styles.categoriesText}>Categories</Text>
              <TabsTouch
                data={categoriesShow}
                onPassCate={item => {
                  onPressCategories(item);
                }}
              />
            </View>
          </View>
          <View style={{marginHorizontal:10}}>
          <HomeSlider data={sliderItems}/>
          </View>
        </AppInputScroll>
      </KeyboardAvoidingView>
     
      <View style={{backgroundColor: colors.white, height: hp('9%')}}>
        <FormButton loading={loading} onPress={handlePrice} />
      </View>
    </View>
  );
};

export default PriceDetailsForm;

const styles = StyleSheet.create({
  weightText: {
    fontSize: RFValue(13),
    fontFamily: fonts.semiBold,
    color: colors.black,
  },
  weightTextSurface: {
    shadowColor: colors.black50, 
    backgroundColor: colors.white,
    borderRadius: 10,
    height: hp('8%'),
    justifyContent: 'center',
    marginTop: '5%',
  },
  weightInnerView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 15,
  },
  weightImage: {
    width: 30,
    height: 30,
  },
  weightTextInput: {
    width: wp('64%'),
    height: hp('7%'),
    backgroundColor: colors.white,
    color: colors.black,
    fontSize: RFValue(12),
    fontFamily: fonts.medium,
    marginHorizontal: 10,
  },
  weightKGText: {
    fontSize: RFValue(13),
    fontFamily: fonts.semiBold,
    color: colors.black,
  },
  quantityText: {
    fontSize: RFValue(13),
    fontFamily: fonts.semiBold,
    color: colors.black,
  },
  quantitySurface: {
    shadowColor: colors.black50, 
    backgroundColor: colors.white,
    borderRadius: 10,
    height: hp('8%'),
    justifyContent: 'center',
    marginTop: '5%',
  },
  quantitInnerView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 15,
  },
  quantity: {
    flex: 1,
    fontSize: RFValue(12),
    fontFamily: fonts.medium,
    color: colors.black,
    marginLeft: '4%',
  },
  touchNegative: {
    backgroundColor: colors.colorD9,
    height: 20,
    width: 20,
    borderRadius: 100,
    justifyContent: 'center',
  },
  negativeImage: {
    alignSelf: 'center',
    width: 20,
    height: 20,
  },
  touchPositive: {
    backgroundColor: colors.main,
    height: 20,
    width: 20,
    borderRadius: 100,
    justifyContent: 'center',
  },
  positiveImage: {
    alignSelf: 'center',
    width: 20,
    height: 20,
  },
  categoriesText: {
    fontSize: RFValue(13),
    fontFamily: fonts.semiBold,
    color: colors.black,
  },
});
