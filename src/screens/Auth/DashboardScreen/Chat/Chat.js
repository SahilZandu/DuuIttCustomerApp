import React, { Component, useCallback, useEffect, useState } from 'react';
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
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import InputScrollView from 'react-native-input-scroll-view';
import { SvgXml } from 'react-native-svg';
import Header from '../../../../components/header/Header';
import { fonts } from '../../../../theme/fonts/fonts';
import Spacer from '../../../../halpers/Spacer';
import { colors } from '../../../../theme/colors';
import {
  GiftedChat,
  Bubble,
  InputToolbar,
  Composer,
  Send,
  Avatar,
} from 'react-native-gifted-chat';
import Url from '../../../../api/Url';
import { rootStore } from '../../../../stores/rootStore';
import { appImages, appImagesSvg } from '../../../../commons/AppImages';
import MikePopUp from '../../../../components/MikePopUp';
import { styles } from './styles';


export default function Chat({ navigation }) {
  const { appUser } = rootStore.commonStore;
  const [messages, setMessages] = useState([]);
  const [visible, setVisible] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [inputText, setInputText] = useState('');


  const hanldeLinking = () => {
    Linking.openURL(`tel:${'1234567890'}`);
  };
  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisible(true);
    });
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);



  useEffect(() => {
    setTimeout(() => {
      const { appUser } = rootStore.commonStore;
      setMessages([
        {
          _id: 1,
          text: 'Hello developer',
          createdAt: new Date(),
          // avatar: Url?.Image_Url + appUser?.profile_pic,
          // avatar:'https://cdn-icons-png.flaticon.com/512/149/149071.png',
          user: {
            _id: 2,
            name: 'React Native',
            // avatar:'https://cdn-icons-png.flaticon.com/512/149/149071.png',
            // avatar: Url?.Image_Url + appUser?.profile_pic,
          },
        },
      ]);

    }, 1000)

  }, []);

  // const onSend = useCallback((messages = []) => {
  //   const msg = messages[0];
  //   const myMsg = {
  //     ...msg,
  //     sentBy: 2,
  //     sentTo: 1,
  //     createdAt: new Date(),
  //   };

  //   setMessages(previousMessages => GiftedChat.append(previousMessages, myMsg));
  //   // const docId = appUser?._id > item?._id ? appUser?._id + "-" +item?._id: item?._id + "-" +appUser?._id ;
  // }, []);

  // const onSuccessResult = item => {
  //   console.log('item=== onSuccessResult', item);
  //   // setSearchRes(item);
  //   setVisible(false);
  // };



  const onSend = useCallback((messages = []) => {
    const msg = messages[0];
    const myMsg = {
      ...msg,
      sentBy: 2,
      sentTo: 1,
      createdAt: new Date(),
    };
    setInputText(''); // Clear input after sending
    setMessages(previousMessages => GiftedChat.append(previousMessages, myMsg));
    // const docId = appUser?._id > item?._id ? appUser?._id + "-" +item?._id: item?._id + "-" +appUser?._id ;
  }, [appUser]);


  const onSuccessResult = item => {
    console.log('item=== onSuccessResult', item);
    setInputText(item)
    setVisible(false);
  };
  const onCancel = () => {
    setVisible(false);
  };


  const renderMessageImage = (props) => {
    return (
      <View style={{
        backgroundColor: '#f0f0f0', // Custom background color
        borderRadius: 10,
        padding: 5, // Add padding for better spacing
      }}>
        <Image
          source={{ uri: props.currentMessage.image }}
          style={{
            width: 200, // Custom width
            height: 150, // Custom height
            borderRadius: 8, // Optional: Rounded corners
          }}
          resizeMode="cover" // You can use 'contain', 'cover', 'stretch', etc.
        />
      </View>
    );
  };

  const renderAvatar = (props) => {
    const { currentMessage } = props;
    if (!currentMessage?.user?.avatar) return null;

    return (
      <Image
        source={{ uri: currentMessage.user.avatar }}
        style={{
          width: 36,
          height: 36,
          borderRadius: 18,
          marginLeft: 5,
          marginRight: 5,
        }}
      />
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.haederView}>
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
      </View>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? undefined : 'height'}
        style={{ flex: 1 }} // Adjust paddingTop to header height
        keyboardVerticalOffset={Platform.OS === 'ios'
          ? keyboardVisible ? 0 : 0
          : keyboardVisible ? 40 : 0}
      >
        <TouchableWithoutFeedback
          onPress={Keyboard.dismiss} accessible={false}>
          <View style={{ flex: 1, }}>
            <GiftedChat
              renderAvatar={renderAvatar}
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
                      right: styles.rightText,
                      left: styles.leftText,
                    }}
                    wrapperStyle={{
                      right: styles.rightBoxView,
                      left: styles.leftBoxView,
                    }}
                  />
                );
              }}
              renderInputToolbar={props => (
                <InputToolbar
                  {...props}
                  containerStyle={styles.toolBarView}
                  textInputStyle={{ color: colors.black }}
                  renderComposer={composerProps => (
                    <View
                      style={styles.inputTextMainView}>
                      <TextInput
                        value={inputText}
                        onChangeText={text => setInputText(text)}
                        style={styles.inputText}
                        placeholder='Type a message here....'
                        multiline={true}
                      />
                      <View style={styles.buttonMainView}>
                        <TouchableOpacity
                          style={styles.touchMike}
                          onPress={() => {
                            setVisible(true)
                          }}>
                          <SvgXml xml={appImagesSvg.mikeSvg} width={22} height={22} />
                        </TouchableOpacity>
                        <View
                          style={styles.btnCenterLine}
                        />
                        <TouchableOpacity
                          style={styles.touchSendBtn}
                          onPress={() => {
                            if (inputText?.trim()?.length > 0) {
                              const newMessage = {
                                _id: 2,
                                text: inputText.trim(),
                                user: {
                                  _id: 1,
                                  name: 'Hello developer',
                                },
                                createdAt: new Date(),
                              };
                              onSend([newMessage]); // send your message
                            }
                            // if (sendProps.text?.trim()) {
                            //   sendProps.onSend({ text: sendProps.text.trim() }, true);
                            // }
                          }}>
                          <SvgXml
                            xml={appImagesSvg.sendChat}
                            width={22}
                            height={22}
                          />
                        </TouchableOpacity>
                      </View>
                      {/* <Composer
                      {...composerProps}
                      placeholder="Type a message here...." // Custom placeholder text
                      textInputStyle={{
                        flex: 1,
                        color: colors.black,
                        fontSize: RFValue(13),
                        fontFamily: fonts.medium,
                        paddingVertical: 10,
                      }}
                    /> */}
                    </View>
                  )}
                // renderSend={sendProps => (
                // <View style={styles.buttonMainView}>
                //       <TouchableOpacity
                //         style={styles.touchMike}
                //         onPress={() => {
                //           setVisible(true)
                //         }}>
                //         <SvgXml xml={appImagesSvg.mikeSvg} width={22} height={22} />
                //       </TouchableOpacity>
                //       <View
                //         style={styles.btnCenterLine}
                //       />
                //       <TouchableOpacity
                //         style={styles.touchSendBtn}
                //         onPress={() => {
                //           if (inputText?.trim()?.length > 0) {
                //             const newMessage = {
                //               _id: 2,
                //               text: inputText.trim(),
                //               user: {
                //                 _id: 1,
                //                 name: 'Hello developer',
                //               },
                //               createdAt: new Date(),
                //             };
                //             onSend([newMessage]); // send your message
                //           }
                //           // if (sendProps.text?.trim()) {
                //           //   sendProps.onSend({ text: sendProps.text.trim() }, true);
                //           // }
                //         }}>
                //         <SvgXml
                //           xml={appImagesSvg.sendChat}
                //           width={22}
                //           height={22}
                //         />
                //       </TouchableOpacity>
                //     </View>
                // )}
                />
              )}
            />
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>

      <MikePopUp
        visible={visible}
        title={'Sorry! Didn’t hear that'}
        text={'Try saying somethings.'}
        onCancelBtn={onCancel}
        onSuccessResult={onSuccessResult}
      />
    </SafeAreaView>
  );
}