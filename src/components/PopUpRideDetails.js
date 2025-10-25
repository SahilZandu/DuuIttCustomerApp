import React from 'react';
import { View, Text, TouchableOpacity, Image, Platform } from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import Modal from 'react-native-modal';
import { RFValue } from 'react-native-responsive-fontsize';
import { appImages } from '../commons/AppImages';
import { colors } from '../theme/colors';
import Spacer from '../halpers/Spacer';
import BTN from './cta/BTN';
import { fonts } from '../theme/fonts/fonts';
import PickDropImageComp from './PickDropImageComp';
import TextRender from './TextRender';
import { currencyFormat } from '../halpers/currencyFormat';

const PopUpRideDetails = ({
  isVisible,
  onClose,
  title,
  info,
  onPressCancelRide,
  packetImage,
  loading,
  riderLoading
}) => {
  return (
    <Modal
      animationType="slide"
      isVisible={isVisible}
      animationIn="fadeIn"
      animationOut="fadeOut"
      style={{ justifyContent: 'flex-end', margin: 0 }}>
      <TouchableOpacity
        onPress={onClose}
        activeOpacity={0.8}
        style={{ alignSelf: 'center' }}>
        <Image
          resizeMode="contain"
          style={{ height: 45, width: 45 }}
          source={appImages.crossClose} // Your icon image
        />
      </TouchableOpacity>
      <View
        style={{
          justifyContent: 'flex-end',
          alignItems: 'flex-end',
          marginTop: '2%',
        }}>
        <View
          style={{
            backgroundColor: '#FFFFFF',
            width: wp('100%'),
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
            paddingBottom: Platform.OS == 'ios' ? hp('5%') : hp('3%'),
            // height: hp('80%'),
          }}>
          <View style={{ marginHorizontal: 20, marginTop: hp('3%') }}>
            <Text
              style={{
                fontSize: RFValue(15),
                fontFamily: fonts.bold,
                color: colors.black,
              }}>
              {title}
            </Text>
            <PickDropImageComp
              item={{
                pickup: info?.sender_address?.address,
                drop: info?.receiver_address?.address,
              }}
              image={packetImage}
            // image={appImages.packetImage}
            // image={appImages.packetRideImage}
            />
            <View
              style={{
                height: 1,
                backgroundColor: colors.colorD9,
                marginTop: '7%',
                // marginHorizontal: -20,
              }}
            />
            <TextRender
              title={'Pay'}
              value={currencyFormat(Number(info?.total_amount))}
              bottomLine={false}
            />
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-around',
                marginTop: hp("3.5%"),
              }}>
              {info?.status !== 'picked' &&
                <BTN
                  disable={riderLoading}
                  backgroundColor={colors.lightGreen}
                  labelColor={colors.lightRed}
                  width={wp('42%')}
                  bottomCheck={1}
                  title={'Cancel Ride'}
                  textTransform={'capitalize'}
                  borderColor={colors.lightGreen}
                  onPress={onPressCancelRide}
                  loading={loading}
                />}
              <BTN
                width={info?.status == 'picked' ? wp('80%') : wp('42%')}
                bottomCheck={1}
                title={'Close'}
                textTransform={'capitalize'}
                onPress={onClose}
              />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default PopUpRideDetails;
