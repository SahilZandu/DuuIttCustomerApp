import React ,{useState, useEffect, useRef} from 'react';

import {View, 
  TextInput,Modal, Pressable, Text, ScrollView, Platform} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {RFValue} from 'react-native-responsive-fontsize';
import {SvgXml} from 'react-native-svg';
import {fonts} from '../../../theme/fonts/fonts';
import {appImages, appImagesSvg} from '../../../commons/AppImages';
import DotedLine from './DotedLine';
import { colors } from '../../../theme/colors';

const AddNote = ({visible, onClose, menu, onSelectMenu}) => {
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
          onPress={() => onClose()}
          style={{flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.6)'}}></Pressable>
      </>
      <Pressable
        onPress={() => onClose()}
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
              Add a note for the restaurant
            </Text>

            <View
              style={{
                paddingHorizontal: 16,
                marginTop: '4%',
                
              
                
              }}>

                {/* <AddCookingRequest /> */}

              <View
                style={{
                  backgroundColor: 'white',
                 
                }}>
                       
                <TextInput
                  // ref={inputRef}
                  underlineColor="transparent"
                  underlineColorAndroid={'transparent'}
                  placeholder="e.g. Don’t make it too spicy"
                  maxLength={100}
                  numberOfLines={5}
                  multiline
                  value={textInputt} // Bind the input value to state
                  onChangeText={ssdsd}
                  // onChangeText={(text) => {
                  //   // textInput=text;
                  //   ssdsd(text);
                  //   }}
                  style={{
                    padding: 10,
                    backgroundColor: '#F5F5F5',
                    borderRadius: 10,
                    textAlign: 'left', // Aligns the text horizontally to the left
                    textAlignVertical:
                      Platform.OS === 'android' ? 'top' : 'center', // Vertically align to the top for Android, center for iOS

                    shadowColor: '#000', // Shadow color (black)
                    shadowOffset: {width: 0, height: 2}, // Horizontal and vertical offset
                    shadowOpacity: 0.3, // Opacity of the shadow
                    shadowRadius: 5, // Blur radius of the shadow
                    elevation: 5, // Android shadow (elevation must be set to display shadow on Android)

                    marginBottom: 10,
                    marginTop: 10,

                    height: hp('24%'),
                  }}></TextInput>
                <Text
                  style={{
                    fontFamily: fonts.semiBold,
                    color: 'black',
                    position: 'absolute',
                    bottom: 10,
                    right: 10,
                    marginEnd: wp('5%'),
                    paddingBottom: wp('2%'),
                  }}>
                  {textInputt.length}/100
                </Text>
              </View>

              <Text
                
                style={{
                  fontFamily: fonts.medium,
                  fontSize: RFValue(10),
                 
                  color: '#646464',
                }}>
                {'The restaurant will try its best To follow your requests. However, no cancellation or refund will be possible if you request is not met. Please note that once added, request cannot be removed after the order is placed.'}
              </Text>

              <View
              style={{backgroundColor:'#28B056',
              borderRadius:30,
              justifyContent:'center',
              alignItems:'center',
              marginTop:10,
              paddingBottom:10,
              padding:14}}>
                <Text
                style={{
                    fontFamily:fonts.medium,
                    fontSize:RFValue(14),
                    color:colors.white
                }}
                >
                  SAVE
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

export default AddNote;

const close = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
<path d="M12 4L4 12" stroke="white" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M4 4L12 12" stroke="white" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;
