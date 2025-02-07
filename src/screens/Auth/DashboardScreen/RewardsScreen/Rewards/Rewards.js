import {useFocusEffect} from '@react-navigation/native';
import React, {useCallback} from 'react';
import {View, Image, Dimensions, FlatList, Text} from 'react-native';
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

const data = [
  {id: '1', title: 'Item 1', image: appImages.srImg1, status: 0},
  {id: '2', title: 'Item 2', image: appImages.srImg2, status: 0},
  {id: '3', title: 'Item 3', image: appImages.srImg1, status: 0},
  {id: '4', title: 'Item 4', image: appImages.srImg2, status: 0},
  {id: '5', title: 'Item 5', image: appImages.srImg1, status: 0},
];

const {width} = Dimensions.get('window'); // Get device width
const ITEM_MARGIN = 20; // Space between items
const ITEM_SIZE = (width - ITEM_MARGIN * 3) / 2; // Ensures two items fit perfectly

const Rewards = ({navigation}) => {
  useFocusEffect(
    useCallback(() => {
      handleAndroidBackButton(navigation);
    }, []),
  );

  const handleScratch = () => {
    console.log('Scratched!');
  };

  const RenderItem = ({item}) => (
    <View
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
    </View>
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
      {/* <View style={{ position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
   }}>
      <Image
        source={require('../../../../../assets/avatar.png')}
        style={{width: 200,
          height: 200,
          position: 'absolute',
         }}
      />
      <ScratchCard
        brushWidth={100}
        onScratch={handleScratch}
        // strokeColor="#099DB2"
        source={appImages.scratchImage}
        style={{  width: 200,
          height: 200,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          borderRadius: 20, 
          overflow: 'hidden', 
        }}
      />
       </View> */}

      {/* <ModalPopUpTouch
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
                    onPress={() => {
                      setIsViewDetails(false);
                      navigation.navigate('claimGiftCard', {
                        item: claimGiftItem,
                      });
                    }}
                  />
                </View>
              </View>
            </View>
          </View>
        </ModalPopUpTouch> */}
    </View>
  );
};

export default Rewards;
