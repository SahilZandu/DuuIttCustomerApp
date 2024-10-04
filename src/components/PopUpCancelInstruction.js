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
import PickDropImageComp from './PickDropImageComp';
import TextRender from './TextRender';
import {currencyFormat} from '../halpers/currencyFormat';
import CTA from './cta/CTA';

const PopUpCancelInstruction = ({
  isVisible,
  onClose,
  title,
  cancelRideInst,
  onCancelReason,
}) => {



  return (
    <Modal
        animationType="slide"
        isVisible={isVisible}
        animationIn="fadeIn"
        animationOut="fadeOut"
        style={{justifyContent: 'flex-end', margin: 0}}>
        <TouchableOpacity
          onPress={ onClose}
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

              {cancelRideInst?.map((item, index) => {
                return (
                  <View style={{justifyContent: 'center'}}>
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={()=>{onCancelReason(item)}}
                      key={index}
                      style={{
                        flexDirection: 'row',
                        marginTop: '2%',
                        alignItems: 'center',
                        height: hp('7%'),
                      }}>
                      <Text
                        style={{
                          fontSize: RFValue(14),
                          fontFamily: fonts.regular,
                          marginLeft: '3%',
                          color: '#242424',
                        }}>
                        {item?.title}
                      </Text>
                    </TouchableOpacity>
                    <View
                      style={{
                        height: 2,
                        backgroundColor: '#D9D9D9',
                        // marginTop: '1%',
                      }}
                    />
                  </View>
                );
              })}
            </View>
            <Spacer space={'8%'} />
            <CTA
              title={'Wait for driver'}
              textTransform={'capitalize'}
              onPress={onClose}
              bottomCheck={1}
            />
          </View>
        </View>
      </Modal>
  );
};

export default PopUpCancelInstruction;
