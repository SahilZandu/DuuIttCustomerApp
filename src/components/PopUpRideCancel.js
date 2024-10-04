import React from 'react';
import {View, Text, TouchableOpacity, Image} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import Modal from 'react-native-modal';
import {RFValue} from 'react-native-responsive-fontsize';
import {appImages} from '../commons/AppImages';
import {colors} from '../theme/colors';
import Spacer from '../halpers/Spacer';
import BTN from './cta/BTN';
import {fonts} from '../theme/fonts/fonts';


const PopUpRideCancel = ({
  isVisible,
  onClose,
  title,
  message,
  onCancelRequest,
  loading
}) => {
  return (
    <Modal
      animationType="slide"
      isVisible={isVisible}
      animationIn="fadeIn"
      animationOut="fadeOut"
      style={{justifyContent: 'flex-end', margin: 0}}>
      <TouchableOpacity
        onPress={onClose}
        activeOpacity={0.8}
        style={{alignSelf: 'center'}}>
        <Image
          resizeMode="contain"
          style={{height: 45, width: 45}}
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
            width: '100%',
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
            paddingBottom: '12%',
            // height: hp('80%'),
          }}>
          <Spacer space={'2%'} />

          <View style={{marginHorizontal: 24}}>
            <Text
              style={{
                fontSize: RFValue(16),
                fontFamily: fonts.bold,
                color: colors.black,
                marginTop: '4%',
              }}>
              {title}
            </Text>

            <Text
              style={{
                fontSize: RFValue(13),
                fontFamily: fonts.regular,
                color: colors.color24,
                marginTop: '6%',
              }}>
              {message}
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
              title={'Cancel Request'}
              textTransform={'capitalize'}
              onPress={onCancelRequest}
              backgroundColor={colors.white}
              labelColor={colors.main}
              loading={loading}
              width={wp('42%')}
              bottomCheck={1}
            />
            <BTN
              width={wp('42%')}
              title={'Wait for driver'}
              textTransform={'capitalize'}
              onPress={onClose}
              bottomCheck={1}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default PopUpRideCancel;
