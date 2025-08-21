import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import {
  View,
  Image,
  Dimensions,
  FlatList,
  Text,
  TouchableOpacity,
} from 'react-native';
import Header from '../../../../../components/header/Header';
import { styles } from './styles';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { colors } from '../../../../../theme/colors';
import handleAndroidBackButton from '../../../../../halpers/handleAndroidBackButton';
// import { ScratchCard } from 'rn-scratch-card';
import { appImages } from '../../../../../commons/AppImages';
import ModalPopUpTouch from '../../../../../components/ModalPopUpTouch';
import BTN from '../../../../../components/cta/BTN';
import DotTextComp from '../../../../../components/DotTextComp';
import DotTextExpireComp from '../../../../../components/DotTextExpireComp';
import { currencyFormat } from '../../../../../halpers/currencyFormat';
import { Wrapper } from '../../../../../halpers/Wrapper';

const data = [
  {
    id: '1',
    title: 'Item 1',
    image: appImages.kataniRestImg,
    // image: appImages.srImg1,
    logoImg: appImages.kataniLogo,
    status: 1,
    name: 'Katani’s Silver Package',
    cashBack: 50,
    coupansCount: 5,
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
    image: appImages.kataniRestImg,
    // image: appImages.srImg2,
    logoImg: appImages.mdLogo,
    status: 0,
    name: 'Katani’s Silver Package',
    cashBack: 50,
    coupansCount: 5,
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
    image: appImages.kataniRestImg,
    logoImg: appImages.mdLogo,
    status: 0,
    name: 'Katani’s Silver Package',
    cashBack: 50,
    coupansCount: 5,
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
    image: appImages.kataniRestImg,
    logoImg: appImages.mdLogo,
    status: 1,
    name: 'Katani’s Silver Package',
    cashBack: 50,
    coupansCount: 5,
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

const { width } = Dimensions.get('window'); // Get device width
const ITEM_MARGIN = 20; // Space between items
const ITEM_SIZE = (width - ITEM_MARGIN * 3) / 2; // Ensures two items fit perfectly

let selectedItem = {}
const Rewards = ({ navigation }) => {
  const [isViewDetails, setIsViewDetails] = useState(false);
  const [rewardsList, setRewardsList] = useState(data ?? [])

  useFocusEffect(
    useCallback(() => {
      handleAndroidBackButton(navigation);
    }, []),
  );

  const handleScratch = async () => {
    console.log('Scratched!');
    const newRewardsList = await rewardsList.map((item, i) => {
      if (item?.id == selectedItem?.id) {
        return {
          ...item,
          status: 1
        }
      } else {
        return {
          ...item
        }
      }

    })
    setRewardsList([...newRewardsList])
    setTimeout(() => {
      onClaimRewards();
    }, 1500)
  };

  const RenderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => {
        if (item?.status == 1) {
          selectedItem = item
          onClaimRewards();
        } else {
          setIsViewDetails(true);
          selectedItem = item
        }
      }}
      activeOpacity={0.8}
      style={[styles.renderView,
      { width: ITEM_SIZE, height: ITEM_SIZE, marginTop: ITEM_MARGIN },
      ]}>
      {item?.status == 1 ? (
        <View style={styles.showImageView}>
          <Image
            resizeMode="cover"
            style={[styles.showImage, { width: ITEM_SIZE }]}
            source={item?.image}
          />
          <Image
            resizeMode="cover"
            style={styles.logoImage}
            source={item?.logoImg}
          />
          <View style={styles.restCashView}>
            <Text numberOfLines={2} style={styles.restText}>{item?.name}</Text>
            <Text numberOfLines={2}
              style={styles.caskBackText}>Cashback of{' '}
              {currencyFormat(Number(item?.cashBack))}
              {' '}+{item?.coupansCount}{' '}Food Coupons</Text>
          </View>
        </View>
      ) : (
        <Image
          resizeMode="cover"
          style={{ width: ITEM_SIZE, height: ITEM_SIZE, borderRadius: 10 }}
          source={appImages?.scratchImage}
        />
      )}
    </TouchableOpacity>
  );

  const onClaimRewards = () => {
    setIsViewDetails(false);
    navigation.navigate('claimRewardCard', {
      item: selectedItem,
    });
  }

  return (
    <Wrapper
      edges={['left', 'right']}
      transparentStatusBar
      backArrow={true}
      title={'Rewards'}
      onPress={() => {
        navigation.goBack();
      }}
      showHeader
    >
      <View style={styles.container}>
        {/* <Header
        backArrow={true}
        title={'Rewards'}
        onPress={() => {
          navigation.goBack();
        }}
      /> */}
        <View style={styles.flatListView}>
          {rewardsList?.length > 0 ? (
            <FlatList
              showsVerticalScrollIndicator={false}
              data={rewardsList}
              renderItem={RenderItem}
              keyExtractor={item => item?.id}
              numColumns={2} // Set 2 columns
              columnWrapperStyle={{
                justifyContent: 'space-between',
                marginHorizontal: ITEM_MARGIN,
              }}
              contentContainerStyle={styles.flatListContainerView}
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
              {/* <ScratchCard
              brushWidth={100}
              onScratch={handleScratch}
              // strokeColor="#099DB2"
              source={appImages.scratchImage}
              style={styles.modalImagesrct}
            /> */}
            </View>
            <View style={styles.modalMainInnerView}>
              <View style={styles.modalInnerView}>
                <View style={styles.textView}>
                  <Text style={styles.giftCardDetails}>Voucher Details</Text>
                  {selectedItem?.data?.map((item, i) => {
                    return (
                      <View style={{ marginHorizontal: -10 }}>
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
                        onClaimRewards()
                      }}
                    />
                  </View>
                </View>
              </View>
            </View>
          </View>
        </ModalPopUpTouch>
      </View>
    </Wrapper>
  );
};

export default Rewards;
