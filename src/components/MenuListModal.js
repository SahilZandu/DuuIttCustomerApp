import React from 'react';
import {View, Modal, Pressable, Text, ScrollView} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {fonts} from '../theme/fonts/fonts';
import {RFValue} from 'react-native-responsive-fontsize';
import {SvgXml} from 'react-native-svg';
import {appImagesSvg} from '../commons/AppImages';
import {colors} from '../theme/colors';

const MenuListModal = ({visible, onClose, menu, onSelectMenu}) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={() => {
        onClose();
      }}>
      <>
        <Pressable
          onPress={() => onClose()}
          style={{flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.6)'}}></Pressable>
      </>
      <View
        style={{
          // backgroundColor: '#F9BD00',
          backgroundColor: 'white',
          position: 'absolute',
          bottom: '10%',
          left: '50%', // Centers horizontally
          transform: [
            {translateX: -wp('34%')}, // Offsets the width (half of wp('68%')) to truly center
          ],
          width: wp('68%'),
          height: hp('35%'),
          borderRadius: 20,
          borderColor: '#F9BD00',
          paddingTop: '5%',
        }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingBottom: '10%'}}>
          {menu &&
            menu.length > 0 &&
            menu.map((item, key) => (
              <Pressable
                onPress={() => onSelectMenu(key)}
                key={key}
                style={{
                  paddingHorizontal: 16,
                  marginTop: '4%',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexDirection: 'row',
                }}>
                <Text
                  numberOfLines={1}
                  style={{
                    fontFamily: fonts.medium,
                    fontSize: RFValue(13),
                    maxWidth: wp('55%'),
                    color: 'black',
                  }}>
                  {item.name}
                </Text>
                <Text
                  style={{
                    fontFamily: fonts.medium,
                    fontSize: RFValue(14),
                    color: 'black',
                  }}>
                  {item.count}
                </Text>
              </Pressable>
            ))}
        </ScrollView>
      </View>
      <Pressable onPress={() => onClose()} 
      style={{alignItems: 'center',  bottom: '5%',}}>
        <SvgXml xml={appImagesSvg.closeMenu} />
      </Pressable>
    </Modal>
  );
};

export default MenuListModal;

const close = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
<path d="M12 4L4 12" stroke="white" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M4 4L12 12" stroke="white" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;
