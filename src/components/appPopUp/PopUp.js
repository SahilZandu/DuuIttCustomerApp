import React from 'react';
import {Text, View, StyleSheet, Pressable} from 'react-native';
import Modal from 'react-native-modal';
import {SvgXml} from 'react-native-svg';
import {RFValue} from 'react-native-responsive-fontsize';
import DeleteActions from './DeleteActions';
import CTA from '../cta/CTA';
import LogoutActions from './LogoutActions';
import {fonts} from '../../theme/fonts/fonts';
import {appImagesSvg} from '../../commons/AppImages';
import Spacer from '../../halpers/Spacer';

const PopUp = ({visible, onDelete, type, text, title, onClose, CTATitle}) => {
  const getIconXml = () => {
    if (type == 'warning') {
      return appImagesSvg?.popUpwarning;
    } else if (type == 'logout') {
      return appImagesSvg?.logoutSvg;
      // return appImagesSvg?.crossIconBackRed;
    } else if (type == 'continue') {
      return appImagesSvg?.logoutSvg;
    } else {
      return appImagesSvg?.popUpDelete;
    }
  };

  const PopUpIcon = () => {
    return (
      <View
        style={[
          styles.iconView,
          {
            backgroundColor:
              type == 'delete' ||
               type == 'logout' ||
                type == 'continue'
                ? '#CB2F2F'
                : type == 'warning'
                ? 'rgba(254, 240, 199, 1)'
                :  type == 'logout' ? 'transparent' : '#1D721E',
          },
        ]}>
        <SvgXml xml={getIconXml()} />
      </View>
    );
  };

  const CloseBtn = () => {
    return (
      <Pressable onPress={onClose} style={styles.cancelBTNPress}>
        <SvgXml xml={appImagesSvg?.popUpclose} />
      </Pressable>
    );
  };

  return (
    <Modal isVisible={visible}>
      <View style={styles.mainView}>
        <View style={styles.subView}>
          <PopUpIcon />
          <CloseBtn />
          <Text style={styles.titleText}>
            {title ? title : 'You are about to delete an item'}
          </Text>
          <Text style={styles.textSecond}>{text}</Text>

          {(type == 'delete' || type == 'warning') && (
            <DeleteActions onCancle={onClose} onDelete={onDelete} type={type} />
          )}

          {(type == 'logout' || type == 'continue') && (
            <LogoutActions onCancle={onClose} onLogout={onDelete} type={type} />
          )}

          {type == 'agreementConfirm' && (
            <>
              <Spacer space={'12%'} />
              <CTA
                title={CTATitle}
                width={'100%'}
                height={42}
                onPress={onDelete}
              />
              <Spacer space={'-4%'} />
            </>
          )}
        </View>
      </View>
    </Modal>
  );
};

export default PopUp;

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  subView: {
    backgroundColor: 'white',
    paddingHorizontal: '5%',
    paddingBottom: '5%',
    width: '85%',
    borderRadius: 15,
  },
  cancelBTNPress: {
    backgroundColor: 'rgba(203, 47, 47, 0.15)',
    height: 28,
    width: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    position: 'absolute',
    right: 15,
    top: 10,
  },
  titleText: {
    fontFamily: fonts.bold,
    fontSize: RFValue(13),
    textAlign: 'center',
    paddingVertical: '5%',
  },
  textSecond: {
    fontFamily: fonts.regular,
    fontSize: RFValue(11),
    textAlign: 'center',
    color: '#8F8F8F',
  },
  iconView: {
    height: 60,
    width: 60,
    borderRadius: 30,
    alignSelf: 'center',
    marginTop: -20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
