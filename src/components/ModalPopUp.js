import React from 'react';
import {View, Text, TouchableOpacity, Image} from 'react-native';
import Modal from 'react-native-modal';
import {appImages} from '../commons/AppImages';

const ModalPopUp = ({isVisible, onClose, children}) => {
  return (
    <Modal
      animationType="slide"
      isVisible={isVisible}
      avoidKeyboard={true}
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
