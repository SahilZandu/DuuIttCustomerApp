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


const ModalPopUp = ({
  isVisible,
  onClose,
  children
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
          justifyContent: 'center',
          marginTop: '2%',
        }}>
        {children}
        </View>
    </Modal>
  );
};

export default ModalPopUp;
