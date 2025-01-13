import React, {useState, useEffect, useRef} from 'react';

import {
  View,
  TextInput,
  Modal,
  Image,
  Pressable,
  Text,
  ScrollView,
  Platform,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {RFValue} from 'react-native-responsive-fontsize';
import {SvgXml} from 'react-native-svg';
import {fonts} from '../../../theme/fonts/fonts';
import {appImages, appImagesSvg} from '../../../commons/AppImages';
import DotedLine from './DotedLine';
import {colors} from '../../../theme/colors';

const CouponDetail = ({
  navigation,
  route,
  visible,
  onClose,
  menu,
  onSelectMenu,
}) => {
  const [textInputt, setTextInput] = useState('');
  const ssdsd = text => {
    setTextInput(text);
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={() => {
        onClose();
      }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: '10%'}}>
        <View
          style={{
            // backgroundColor: '#F9BD00',

            width: wp('100%'),
            height: hp('100%'),
            //  bottom:'10%',
          }}>
          <>
            <Pressable
              onPress={() => {
                navigation.goBack();
                // onClose()
              }}
              style={{
                flex: 1,
                backgroundColor: 'rgba(0, 0, 0, 0.6)',
              }}></Pressable>
          </>
          <Pressable
            onPress={() => {
              navigation.goBack();
              // onClose()
            }}
            style={{
              alignItems: 'center',
              position: 'absolute',
              zIndex: 1,
              alignSelf: 'center',
              marginTop: Platform.OS == 'android' ? hp('45%') : hp('42%'),
            }}>
            <SvgXml xml={appImagesSvg.CROSS} />
          </Pressable>
          <View
            style={{
              // backgroundColor: '#F9BD00',
              backgroundColor: 'white',
              position: 'absolute',
              bottom: Platform.OS == 'android' ? 0 : '2%',

              width: wp('100%'),
              height: hp('50%'),
              borderTopEndRadius: 10,
              borderTopStartRadius: 10,
              borderColor: '#F9BD00',
              paddingTop: '5%',
            }}>
            <View>
              <Text
                numberOfLines={1}
                style={{
                  fontFamily: fonts.bold,
                  fontSize: RFValue(15),
                  padding: 10,
                  color: '#000',
                }}>
                Coupon Details
              </Text>

              <View
                style={{
                  paddingHorizontal: 16,
                  marginTop: '4%',
                }}>
                <View
                  style={{
                    padding: 16,
                    backgroundColor: 'white',
                    borderRadius: 10,
                    borderColor: '#F9BD00',
                    elevation: 4,
                    shadowColor: '#000',
                    shadowOpacity: 0.2,
                    shadowRadius: 5,
                  }}>
                  <View
                    style={{
                      justifyContent: 'flex-start',
                      flexDirection: 'row',
                    }}>
                    <Image
                      style={{width: 24, height: 24, marginEnd: 10}}
                      source={appImages.offerPercent}
                    />
                    <Text
                      style={{
                        fontFamily: fonts.bold,
                        fontSize: RFValue('14'),

                        color: '#000',
                      }}>
                      Get 20% OFF up to ₹75
                    </Text>

                    
                  </View>
                  
                  <Text
                    style={{
                      marginLeft: 40,
                      borderRadius: 12,
                      width: wp('20%'),
                      marginTop: 10,
                      textAlignVertical: 'center',
                      textAlign: 'center',
                      paddingLeft: 10,
                      paddingEnd: 10,
                      paddingTop: 2,
                      paddingBottom: 2,
                      color: '#AFAFAF',
                      borderColor: '#AFAFAF',
                      borderWidth: 1,
                    }}>
                    DUIT75
                  </Text>
                  <View
                      style={{
                        justifyContent: 'flex-start',
                        flexDirection: 'row',
                        marginTop:20,
                        alignItems:'center'
                      }}>
                      <SvgXml
                        style={{marginEnd: 10,
                        }}
                        xml={appImagesSvg.tickColor}
                      />
                      <Text
                        style={{
                          fontFamily: fonts.bold,
                          fontSize: RFValue('10'),

                          color: '#8F8F8F',
                        }}>
                        This offer is personalized for you.
                      </Text>
                    </View>
                    <View
                      style={{
                        justifyContent: 'flex-start',
                        flexDirection: 'row',
                        marginTop:6,
                        alignItems:'center'
                      }}>
                      <SvgXml
                        style={{marginEnd: 10,
                        }}
                        xml={appImagesSvg.tickColor}
                      />
                      <Text
                        style={{
                          fontFamily: fonts.bold,
                          fontSize: RFValue('10'),

                          color: '#8F8F8F',
                        }}>
                        Maximum instant discount of ₹75
                      </Text>
                    </View>
                    <View
                      style={{
                        justifyContent: 'flex-start',
                        flexDirection: 'row',
                        marginTop:6,
                        alignItems:'center'
                      }}>
                      <SvgXml
                        style={{marginEnd: 10,
                        }}
                        xml={appImagesSvg.tickColor}
                      />
                      <Text
                        style={{
                          fontFamily: fonts.bold,
                          fontSize: RFValue('10'),

                          color: '#8F8F8F',
                        }}>
                        Applicable maximum 3 times in a day.
                      </Text>
                    </View>
                    <View
                      style={{
                        justifyContent: 'flex-start',
                        flexDirection: 'row',
                        marginTop:6,
                        alignItems:'center'
                      }}>
                      <SvgXml
                        style={{marginEnd: 10,
                        }}
                        xml={appImagesSvg.tickColor}
                      />
                      <Text
                        style={{
                          fontFamily: fonts.bold,
                          fontSize: RFValue('10'),

                          color: '#8F8F8F',
                        }}>
                        Other T&Cs may apply.
                      </Text>
                    </View>
                </View>

                <View
                  style={{
                    backgroundColor: '#28B056',
                    borderRadius: 30,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: 40,
                    paddingBottom: 10,
                    padding: 14,
                  }}>
                  <Text
                    style={{
                      fontFamily: fonts.medium,
                      fontSize: RFValue(14),
                      color: colors.white,
                    }}>
                    APPLY
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </Modal>
  );
};

export default CouponDetail;

const close = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
<path d="M12 4L4 12" stroke="white" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M4 4L12 12" stroke="white" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;
