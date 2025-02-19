import React from 'react';
import {View, Text, TouchableOpacity, Image} from 'react-native';
import Modal from 'react-native-modal';
import {appImages} from '../commons/AppImages';

const ModalPopUpTouch = ({isVisible, onClose, children,crossImage,onOuterClose,avoidKeyboard,propagateSwipe}) => {
  return (
    <Modal
    propagateSwipe={propagateSwipe?propagateSwipe:false}
    avoidKeyboard={avoidKeyboard?avoidKeyboard:false}
      animationType="slide"
      isVisible={isVisible}
      animationIn="fadeIn"
      animationOut="fadeOut"
      onBackdropPress={onOuterClose}
      onRequestClose={onClose}
      style={{justifyContent: 'flex-end', margin: 0}}>
       {crossImage &&<TouchableOpacity
        onPress={onClose}
        activeOpacity={0.8}
        style={{alignSelf: 'center'}}>
        <Image
          resizeMode="contain"
          style={{height: 45, width: 45}}
          source={appImages.crossClose} // Your icon image
        />
         </TouchableOpacity>}
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

export default ModalPopUpTouch;
