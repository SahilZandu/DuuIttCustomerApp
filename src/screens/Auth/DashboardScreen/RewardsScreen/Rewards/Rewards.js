import {useFocusEffect} from '@react-navigation/native';
import React, {useCallback, useState} from 'react';
import {
  View,
  Image,
  Dimensions,
  FlatList,
  Text,
  TouchableOpacity,
} from 'react-native';
import Header from '../../../../../components/header/Header';
import AppInputScroll from '../../../../../halpers/AppInputScroll';
import {styles} from './styles';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {colors} from '../../../../../theme/colors';
import handleAndroidBackButton from '../../../../../halpers/handleAndroidBackButton';
import {ScratchCard} from 'rn-scratch-card';
import {appImages} from '../../../../../commons/AppImages';
import Spacer from '../../../../../halpers/Spacer';
import ModalPopUpTouch from '../../../../../components/ModalPopUpTouch';
import BTN from '../../../../../components/cta/BTN';
import DotTextComp from '../../../../../components/DotTextComp';
import DotTextExpireComp from '../../../../../components/DotTextExpireComp';

const data = [
  {
    id: '1',
    title: 'Item 1',
    // image: appImages.kataniImg,
    image: appImages.srImg1,
    logoImg:appImages.kataniLogo,
    status: 1,
    name: 'Katani’s Silver Package',
    data: [
      {
        id: 1,
        title: 'in your wallet',
        amount: '',
        wallet: 50,
        coupanCount: '',
        validTill: new Date(),
        expireDate: '',
      },
      {
        id: 2,
        title: 'Food Coupons',
        amount: '',
        wallet: '',
        coupanCount: 5,
        validTill: new Date(),
        expireDate: '',
      },
      {
        id: 3,
        title: 'This offer is applicable to all users.',
        amount: '',
        wallet: '',
        coupanCount: '',
        validTill: new Date(),
        expireDate: '',
      },
      {
        id: 4,
        title: 'Minimum order price',
        amount: 250,
        wallet: '',
        coupanCount: '',
        validTill: new Date(),
        expireDate: '',
      },
      {
        id: 5,
        title: 'Expire on',
        amount: '',
        wallet: '',
        coupanCount: '',
        validTill: new Date(),
        expireDate: new Date(),
      },
    ],
  },
  {
    id: '2',
    title: 'Item 2',
    // image: appImages.mdImg,
    image: appImages.srImg2,
    logoImg:appImages.mdLogo,
    status: 0,
    name: 'Plan price ₹100',
    data: [
      {
        id: 1,
        title: 'in your wallet',
        amount: '',
        wallet: 50,
        coupanCount: '',
        validTill: new Date(),
        expireDate: '',
      },
      {
        id: 2,
        title: 'Food Coupons',
        amount: '',
        wallet: '',
        coupanCount: 5,
        validTill: new Date(),
        expireDate: '',
      },
      {
        id: 3,
        title: 'This offer is applicable to all users.',
        amount: '',
        wallet: '',
        coupanCount: '',
        validTill: new Date(),
        expireDate: '',
      },
      {
        id: 4,
        title: 'Minimum order price',
        amount: 250,
        wallet: '',
        coupanCount: '',
        validTill: new Date(),
        expireDate: '',
      },
      {
        id: 5,
        title: 'Expire on',
        amount: '',
        wallet: '',
        coupanCount: '',
        validTill: new Date(),
        expireDate: new Date(),
      },
    ],
  },
  {
    id: '3',
    title: 'Item 3',
    // image: appImages.kataniImg,
    image: appImages.srImg1,
    logoImg:appImages.mdLogo,
    status: 0,
    name: 'Katani’s Silver Package',
    data: [
      {
        id: 1,
        title: 'in your wallet',
        amount: '',
        wallet: 50,
        coupanCount: '',
        validTill: new Date(),
        expireDate: '',
      },
      {
        id: 2,
        title: 'Food Coupons',
        amount: '',
        wallet: '',
        coupanCount: 5,
        validTill: new Date(),
        expireDate: '',
      },
      {
        id: 3,
        title: 'This offer is applicable to all users.',
        amount: '',
        wallet: '',
        coupanCount: '',
        validTill: new Date(),
        expireDate: '',
      },
      {
        id: 4,
        title: 'Minimum order price',
        amount: 250,
        wallet: '',
        coupanCount: '',
        validTill: new Date(),
        expireDate: '',
      },
      {
        id: 5,
        title: 'Expire on',
        amount: '',
        wallet: '',
        coupanCount: '',
        validTill: new Date(),
        expireDate: new Date(),
      },
    ],
  },
  {
    id: '4',
    title: 'Item 4',
    // image: appImages.mdImg,
    image: appImages.srImg2,
    logoImg:appImages.mdLogo,
    status: 1,
    name:'Plan price ₹100',
    data: [
      {
        id: 1,
        title: 'in your wallet',
        amount: '',
        wallet: 50,
        coupanCount: '',
        validTill: new Date(),
        expireDate: '',
      },
      {
        id: 2,
        title: 'Food Coupons',
        amount: '',
        wallet: '',
        coupanCount: 5,
        validTill: new Date(),
        expireDate: '',
      },
      {
        id: 3,
        title: 'This offer is applicable to all users.',
        amount: '',
        wallet: '',
        coupanCount: '',
        validTill: new Date(),
        expireDate: '',
      },
      {
        id: 4,
        title: 'Minimum order price',
        amount: 250,
        wallet: '',
        coupanCount: '',
        validTill: new Date(),
        expireDate: '',
      },
      {
        id: 5,
        title: 'Expire on',
        amount: '',
        wallet: '',
        coupanCount: '',
        validTill: new Date(),
        expireDate: new Date(),
      },
    ],
  },
];

const {width} = Dimensions.get('window'); // Get device width
const ITEM_MARGIN = 20; // Space between items
const ITEM_SIZE = (width - ITEM_MARGIN * 3) / 2; // Ensures two items fit perfectly

const Rewards = ({navigation}) => {
  const [isViewDetails, setIsViewDetails] = useState(false);
  const [selectedItem, setSelectedItem] = useState({});

  useFocusEffect(
    useCallback(() => {
      handleAndroidBackButton(navigation);
    }, []),
  );

  const handleScratch = () => {
    console.log('Scratched!');
  };

  const RenderItem = ({item}) => (
    <TouchableOpacity
      onPress={() => {
        if (item?.status == 1) {
          setIsViewDetails(true);
          setSelectedItem(item);
        } else {
          setIsViewDetails(true);
          setSelectedItem(item);
        }
      }}
      activeOpacity={0.8}
      style={[
        {
          backgroundColor: colors.white,
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: ITEM_MARGIN, // Space between rows
          borderRadius: 10,
        },
        {width: ITEM_SIZE, height: hp('17%')},
      ]}>
      {item?.status == 1 ? (
        <Image
          resizeMode="cover"
          style={{width: wp('55%'), height: hp('22%'), marginTop: '10%'}}
          source={item?.image}
        />
      ) : (
        <Image
          resizeMode="cover"
          style={{width: ITEM_SIZE, height: hp('17%')}}
          source={appImages?.scratchImage}
        />
      )}
    </TouchableOpacity>
  );

  return (
    <View style={{flex: 1, backgroundColor: colors.appBackground}}>
      <Header
        backArrow={true}
        title={'Rewards'}
        onPress={() => {
          navigation.goBack();
        }}
      />
      <View style={styles.flatListView}>
        {data?.length > 0 ? (
          <FlatList
            showsVerticalScrollIndicator={false}
            data={data}
            renderItem={RenderItem}
            keyExtractor={item => item?.id}
            numColumns={2} // Set 2 columns
            columnWrapperStyle={{
              justifyContent: 'space-between',
              marginHorizontal: ITEM_MARGIN,
            }}
            contentContainerStyle={{paddingBottom: '10%'}}
          />
        ) : (
          <View style={styles.noDataView}>
            <Text style={styles.noDataText}>No Rewards Cards Available</Text>
          </View>
        )}
      </View>

      <ModalPopUpTouch
        isVisible={isViewDetails}
        onOuterClose={() => {
          setIsViewDetails(false);
        }}>
        <View style={styles.modalMainView}>
          <View style={styles.mainScrtView}>
            <Image source={selectedItem?.image} style={styles.modalImage} />
            <ScratchCard
              brushWidth={100}
              onScratch={handleScratch}
              // strokeColor="#099DB2"
              source={appImages.scratchImage}
              style={styles.modalImagesrct}
            />
          </View>
          <View style={styles.modalMainInnerView}>
            <View style={styles.modalInnerView}>
              <View style={styles.textView}>
                <Text style={styles.giftCardDetails}>Voucher Details</Text>
                {selectedItem?.data?.map((item, i) => {
                  return (
                    <View style={{marginHorizontal: -10}}>
                      {(item?.wallet ?? 0) > 0 ||
                      (item?.coupanCount ?? 0) > 0 ||
                      (item?.expireDate ?? 0) > 0 ? (
                        <DotTextExpireComp
                          item={item}
                          index={i}
                          data={selectedItem?.data}
                        />
                      ) : (
                        <DotTextComp
                          title={item?.title}
                          index={i}
                          data={selectedItem?.data}
                          amount={item?.amount}
                        />
                      )}
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
                      navigation.navigate('rewardQRCode', {
                        item: selectedItem,
                      });
                    }}
                  />
                  <BTN
                    width={wp('42')}
                    title={'Claim'}
                    textTransform={'capitalize'}
                    onPress={() => {
                      setIsViewDetails(false);
                      navigation.navigate('claimRewardCard', {
                        item: selectedItem,
                      });
                    }}
                  />
                </View>
              </View>
            </View>
          </View>
        </View>
      </ModalPopUpTouch>
    </View>
  );
};

export default Rewards;
