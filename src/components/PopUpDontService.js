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

const PopUpDontService = ({
  isVisible,
  onClose,
  title,
  message,
  onHandle,
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
            backgroundColor: colors.white,
            width: '100%',
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
            paddingBottom: Platform.OS == 'ios' ? hp('5%') : hp('3%'),
          }}>
          <Spacer space={'3%'} />

          <View style={{ marginHorizontal: 24 }}>
            <Text
              style={{
                fontSize: RFValue(16),
                fontFamily: fonts.bold,
                color: colors.black,
                marginTop: '4%',
                textAlign: 'center',
              }}>
              {title}
            </Text>
          </View>
          <Spacer space={'9%'} />
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-evenly',
              alignItems: 'center',
              marginHorizontal: 10,
            }}>
            <BTN
              title={'Okay'}
              textTransform={'capitalize'}
              onPress={onHandle}
              width={wp('90%')}
              bottomCheck={1}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default PopUpDontService;
