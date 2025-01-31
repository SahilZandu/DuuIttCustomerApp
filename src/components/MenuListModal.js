import React from 'react';
import {
  View,
  Modal,
  Pressable,
  Text,
  ScrollView,
  StyleSheet,
} from 'react-native';
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
      <Pressable onPress={() => onClose()} style={styles.container}></Pressable>
      <View style={styles.innerMainView}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollBottomStyle}>
          {menu &&
            menu?.length > 0 &&
            menu?.map((item, key) => (
              <Pressable
                onPress={() => onSelectMenu(key)}
                key={key}
                style={styles.touchCategory}>
                <Text numberOfLines={1} style={styles.categoryText}>
                  {item?.name}
                </Text>
                <Text style={styles.categoryLength}>{item?.count}</Text>
              </Pressable>
            ))}
        </ScrollView>
      </View>
      <Pressable onPress={() => onClose()} style={styles.closeBtnImage}>
        <SvgXml xml={appImagesSvg.closeMenu} />
      </Pressable>
    </Modal>
  );
};

export default MenuListModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  innerMainView: {
    backgroundColor: colors.white,
    position: 'absolute',
    bottom: '10%',
    left: '50%', // Centers horizontally
    transform: [
      {translateX: -wp('34%')}, // Offsets the width (half of wp('68%')) to truly center
    ],
    width: wp('68%'),
    height: hp('35%'),
    borderRadius: 20,
    borderColor: colors.colorF9,
    paddingTop: '2%',
  },
  scrollBottomStyle: {
    paddingBottom: '10%',
    justifyContent: 'center',
  },
  touchCategory: {
    paddingHorizontal: 16,
    marginTop: '5%',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
  categoryText: {
    fontFamily: fonts.medium,
    fontSize: RFValue(13),
    maxWidth: wp('55%'),
    color: colors.black,
  },
  categoryLength: {
    fontFamily: fonts.medium,
    fontSize: RFValue(14),
    color: colors.black,
  },
  closeBtnImage: {
    alignItems: 'center',
    bottom: '5%',
    justifyContent: 'center',
  },
});
