import React, {Component, useCallback, useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Linking,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import InputScrollView from 'react-native-input-scroll-view';
import {SvgXml} from 'react-native-svg';
import Header from '../../../../components/header/Header';
import {fonts} from '../../../../theme/fonts/fonts';
import Spacer from '../../../../halpers/Spacer';
import {colors} from '../../../../theme/colors';
import {
  GiftedChat,
  Bubble,
  InputToolbar,
  Composer,
  Send,
} from 'react-native-gifted-chat';
import Url from '../../../../api/Url';
import {rootStore} from '../../../../stores/rootStore';
import {appImages, appImagesSvg} from '../../../../commons/AppImages';
import MikePopUp from '../../../../components/MikePopUp';


export default function Chat({navigation}) {
  const [messages, setMessages] = useState([]);
  const [visible, setVisible] = useState(false);
  const {appUser} = rootStore.commonStore;


  const hanldeLinking = () => {
    Linking.openURL(`tel:${'1234567890'}`);
  };

  useEffect(() => {
    setTimeout(()=>{
      const {appUser} = rootStore.commonStore;
      setMessages([
        {
          _id: 1,
          text: 'Hello developer',
          createdAt: new Date(),
           avatar: Url?.Image_Url + appUser?.profile_pic,
          user: {
            _id: 2,
            name: 'React Native',
            avatar: Url?.Image_Url + appUser?.profile_pic,
          },
        },
      ]);

    },1000)
   
  }, []);

  const onSend = useCallback((messages = []) => {
    const msg = messages[0];
    const myMsg = {
      ...msg,
      sentBy: 2,
      sentTo: 1,
      createdAt: new Date(),
    };
    setMessages(previousMessages => GiftedChat.append(previousMessages, myMsg));
    // const docId = appUser?._id > item?._id ? appUser?._id + "-" +item?._id: item?._id + "-" +appUser?._id ;
  }, []);

  const onSuccessResult = item => {
    console.log('item=== onSuccessResult', item);
    // setSearchRes(item);
    setVisible(false);
  };

  const onCancel = () => {
    setVisible(false);
  };
  
  const renderMessageImage = (props) => {
    return (
      <View style={{ backgroundColor: '#f0f0f0', // Custom background color
      borderRadius: 10,
      padding: 5, // Add padding for better spacing
    }}>
        <Image
          source={{ uri: props.currentMessage.image }}
          style={{ width: 200, // Custom width
          height: 150, // Custom height
          borderRadius: 8, // Optional: Rounded corners
        }}
          resizeMode="cover" // You can use 'contain', 'cover', 'stretch', etc.
        />
      </View>
    );
  };


  return (
    <View style={{flex: 1, backgroundColor: colors.appBackground}}>
      <Header
        onPress={() => {
          navigation.goBack();
        }}
        title={'Chat'}
        backArrow={true}
        onPressPhone={() => {
          hanldeLinking();
        }}
      />
    
       <View style={{flex:1,}}>
        <GiftedChat
          messages={messages}
          onSend={messages => onSend(messages)}
          user={{
            _id: 1,
          }}
          renderMessageImage={renderMessageImage}
          renderBubble={props => {
            return (
              <Bubble
                {...props}
                textStyle={{
                  right: {
                    fontSize: RFValue(13),
                    fontFamily: fonts.medium,
                    color: colors.white,
                  },
                  left: {
                    fontSize: RFValue(13),
                    fontFamily: fonts.medium,
                    color: colors.black,
                  
                  },
                }}
                wrapperStyle={{
                  right: {
                    backgroundColor: colors.main,
                    borderTopLeftRadius: 10,
                    borderBottomRightRadius: 0,
                    borderTopRightRadius: 10,
                    borderBottomLeftRadius: 10,
                    marginBottom:'3%'
                  },
                  left: {
                    backgroundColor: colors.screenBackground,
                    borderColor: colors.colorD9,
                    borderWidth: 0.4,
                    borderTopLeftRadius: 10,
                    borderBottomRightRadius: 10,
                    borderTopRightRadius: 10,
                    borderBottomLeftRadius: 0,
                    marginBottom:'3%'
                  },
                }}
              />
            );
          }}
          renderInputToolbar={props => (
            <InputToolbar
              {...props}
              containerStyle={{
                borderTopWidth: 0,
                backgroundColor: colors.colorF5,
                borderRadius: 10,
                marginHorizontal: 16,
                bottom:Platform.OS == 'ios'? '0%':'2%'
              }}
              textInputStyle={{color: colors.black}}
              renderComposer={composerProps => (
                <View
                  style={{
                    flex: 1,
                    flexDirection: 'row',
                    alignItems: 'center',
                    borderRadius: 10,
                  }}>
                  <Composer
                    {...composerProps}
                    placeholder="Type a message here...." // Custom placeholder text
                    textInputStyle={{
                       flex: 1,
                      color: colors.black,
                      fontSize: RFValue(13),
                      fontFamily: fonts.medium,
                      paddingVertical: 10,
                    }}
                  />
                </View>
              )}
              renderSend={sendProps => (
                <View style={{flexDirection: 'row', justifyContent: 'center',alignSelf:'center'}}>
                  <TouchableOpacity
                    style={{
                      marginRight: 2,
                      borderRadius: 100,
                      height: hp('4.5%'),
                      width: hp('4.5%'),
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                    onPress={() => {
                      // if (sendProps.text?.trim()) {
                      //   sendProps.onSend({text: sendProps.text.trim()}, true);
                      // }
                      setVisible(true)
                    }}>
                    <SvgXml xml={appImagesSvg.mikeSvg} width={20} height={20} />
                  </TouchableOpacity>
                  <View
                    style={{
                      height: hp('3%'),
                      width: wp('0.3'),
                      backgroundColor: colors.colorA9,
                      alignSelf: 'center',
                    }}
                  />
                  <TouchableOpacity
                    style={{
                      marginRight: 5,
                      borderRadius: 20,
                      borderRadius: 100,
                      height: hp('4.5%'),
                      width: hp('4.5%'),
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                    onPress={() => {
                      if (sendProps.text?.trim()) {
                        sendProps.onSend({text: sendProps.text.trim()}, true);
                      }
                    }}>
                    <SvgXml
                      xml={appImagesSvg.sendChat}
                      width={20}
                      height={20}
                    />
                  </TouchableOpacity>
                </View>
              )}
            />
          )}
        />
        </View>
        
      <MikePopUp
        visible={visible}
        title={'Sorry! Didn’t hear that'}
        text={'Try saying somethings.'}
        onCancelBtn={onCancel}
        onSuccessResult={onSuccessResult}
      />
    </View>
  );
}