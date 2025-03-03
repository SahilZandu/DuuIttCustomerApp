import React, {useState, useEffect, useRef} from 'react';

import {
  View,
  TextInput,
  Modal,
  Pressable,
  Text,
  ScrollView,
  Platform,
  StyleSheet,
  Image,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {RFValue} from 'react-native-responsive-fontsize';
import {fonts} from '../../../theme/fonts/fonts';
import {appImages} from '../../../commons/AppImages';
import {colors} from '../../../theme/colors';
import BTN from '../../../components/cta/BTN';
import Spacer from '../../../halpers/Spacer';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

const AddNote = ({visible, onClose, addNote, onSelectAddNote}) => {
  const [textInputt, setTextInput] = useState(addNote ?? '');
  const onChangeText = text => {
    setTextInput(text);
  };

  const handleSave = () => {
    onSelectAddNote(textInputt);
    onClose()
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={() => {
        onClose();
      }}>
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        bounces={false}>
        <View style={styles.container}>
          <Pressable
            onPress={() => {
              onClose();
              setTextInput('');
            }}
            style={styles.backButtonTouch}>
            <Image
              resizeMode="contain"
              style={{height: 45, width: 45}}
              source={appImages.crossClose} // Your icon image
            />
          </Pressable>

          <View style={styles.mainWhiteView}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{paddingBottom: '5%'}}>
              <View style={styles.scrollInnerView}>
                <Text numberOfLines={1} style={styles.titleText}>
                {'Add a note for the restaurant'}
                </Text>

                <View style={styles.mainInnerView}>
                  <View style={styles.inputAndTextView}>
                    <TextInput
                      // ref={inputRef}
                      underlineColor="transparent"
                      underlineColorAndroid={'transparent'}
                      placeholder="e.g. Don’t make it too spicy"
                      maxLength={150}
                      numberOfLines={5}
                      multiline
                      value={textInputt} // Bind the input value to state
                      onChangeText={onChangeText}
                      style={styles.inputTextView}></TextInput>
                    <Text style={styles.textLength}>
                      {textInputt?.length}/150
                    </Text>
                  </View>

                  <Text style={styles.restaurantTryText}>
                    {
                      'The restaurant will try its best To follow your requests. However, no cancellation or refund will be possible if you request is not met. Please note that once added, request cannot be removed after the order is placed.'
                    }
                  </Text>
                  <Spacer space={'8%'} />
                  <BTN 
                  disable={textInputt?.length > 0 ?false :true}
                  onPress={handleSave} title={'Save'} />
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </Modal>
  );
};

export default AddNote;

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // justifyContent: 'flex-end',
    // backgroundColor: 'rgba(0, 0, 0, 0.6)',
    width: wp('100%'),
    height: hp('100%'),
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },

  backButtonTouch: {
    alignItems: 'center',
    zIndex: 1,
    alignSelf: 'center',
    marginBottom: '3%',
  },
  mainWhiteView: {
    backgroundColor: colors.white,
    height: hp('47%'),
    borderTopEndRadius: 20,
    borderTopStartRadius: 20,
    borderColor: colors.colorF9,
    paddingTop: '3%',
  },
  scrollInnerView: {
    marginHorizontal: 20,
    justifyContent: 'center',
  },
  titleText: {
    fontFamily: fonts.bold,
    fontSize: RFValue(15),
    padding: 10,
    color: colors.black,
  },
  mainInnerView: {
    paddingHorizontal: 10,
    marginTop: '1%',
    justifyContent: 'center',
  },
  inputAndTextView: {
    backgroundColor: colors.white,
    justifyContent: 'center',
  },
  inputTextView: {
    paddingHorizontal: 10,
    backgroundColor: colors.colorF5,
    borderRadius: 10,
    textAlign: 'left',
    textAlignVertical: Platform.OS === 'android' ? 'top' : 'auto',
    // shadowColor: colors.black,
    // shadowOffset: {width: 0, height: 2},
    // shadowOpacity: 0.3,
    // shadowRadius: 5,
    // elevation: 5,
    marginBottom: 10,
    marginTop: '3%',
    height: hp('17%'),
  },
  textLength: {
    fontFamily: fonts.semiBold,
    color: colors.black,
    position: 'absolute',
    bottom: 10,
    right: 10,
    marginEnd: wp('1%'),
    paddingBottom: wp('2%'),
  },
  restaurantTryText: {
    fontFamily: fonts.medium,
    fontSize: RFValue(11),
    color: colors.color64,
    marginTop: '4%',
  },
});
