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
import { SvgXml } from 'react-native-svg';
import Header from '../../../../components/header/Header';
import { colors } from '../../../../theme/colors';
import {
  GiftedChat,
  Bubble,
  InputToolbar,
  Composer,
  Send,
  Avatar,
} from 'react-native-gifted-chat';
import { rootStore } from '../../../../stores/rootStore';
import { appImagesSvg } from '../../../../commons/AppImages';
import MikePopUp from '../../../../components/MikePopUp';
import { styles } from './styles';
import { useFocusEffect } from '@react-navigation/native';
import handleAndroidBackButton from '../../../../halpers/handleAndroidBackButton';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import socketServices from '../../../../socketIo/SocketServices';
import AnimatedLoader from '../../../../components/AnimatedLoader/AnimatedLoader';
import Spacer from '../../../../halpers/Spacer';
import { Wrapper } from '../../../../halpers/Wrapper';
import { AppEvents } from '../../../../halpers/events/AppEvents';

// let item ={}
export default function Chat({ navigation, route }) {
  const { appUser } = rootStore.commonStore;
  const { item } = route.params;
  const { sendMessage, getChatData, markSeen, setChatData, chatingData, setChatNotificationStatus } = rootStore.chatStore;
  const [messages, setMessages] = useState(chatingData ?? []);
  const [visible, setVisible] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(chatingData?.length > 0 ? false : true)

  console.log("messages----item", messages, item);

  const hanldeLinking = () => {
    Linking.openURL(`tel:${item?.rider?.phone?.toString() ?? '1234567890'}`);
  };


  useEffect(() => {
    onAppEvents();
  }, [])

  const onAppEvents = async () => {
    try {
      await AppEvents({
        eventName: 'Chat',
        payload: {
          name: appUser?.name ?? '',
          phone: appUser?.phone?.toString() ?? '',
        }
      })
    } catch (error) {
      console.log("Error---", error);
    }

  }

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


  useFocusEffect(
    useCallback(() => {
      socketServices.initailizeSocket();
      setChatNotificationStatus(false);
      handleAndroidBackButton(navigation)
      if (item?._id?.length > 0) {
        getChatList();
        setTimeout(() => {
          let Payload = {
            roomId: `${item?._id}-${item?.rider?._id ?? item?.rider_id}-${item?.customer?._id ?? item?.customer_id}`
            // roomId:`6821a769260e070d22d9e503-6810a4b37d14572e56d6013d-674004448c0213057bd1519c`
          }
          socketServices.emit('roomId', Payload)
        }, 1000)
      }
    }, [item])
  )





  const getChatList = async () => {
    let data = {
      orderId: item?._id
    }
    const resList = await getChatData(data, handleLoading);
    console.log('resList----', resList, resList?.data[0]?.messages);
    if (resList?.data[0]?.messages?.length > 0) {
      let chatArray = resList?.data[0]?.messages;
      const mappedMessages = chatArray?.map((item, index) => {
        let userId = item?.senderRole === 'customer' ? 1 : 2;
        let userName = item?.senderRole === 'customer' ? "Customer" : "Rider";
        return {
          _id: index + 1, // or item._id if you prefer
          createdAt: new Date(item?.timestamp),
          text: item?.message,
          sentBy: userId,
          sentTo: userId === 1 ? 2 : 1,
          user: {
            _id: userId,
            name: userName
          }
        };
      });

      let req = {
        orderId: item?._id,
        senderRole: 'customer',
      }

      await markSeen(req)

      console.log(mappedMessages);
      setChatData(mappedMessages)
      setMessages(mappedMessages)
      setLoading(false)
    }
    else {
      setLoading(false)
      setMessages([])
    }

  }

  const handleLoading = (v) => {
    console.log("v----", v);
    setLoading(v)
  }

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


  // useEffect(() => {
  //   socketServices.on('chat-message', (data) => {
  //     console.log('Received message:Rider', data);
  //     if (data?.message && data?.senderRole === "rider") {
  //       console.log("messages---------chat-message",messages);
  //       let userId = data?.senderRole === 'customer' ? 1 : 2;
  //       let userName = data?.senderRole === 'customer' ? "Customer" : "Rider";
  //       let newMsg = {
  //         _id: messages?.length + 1,
  //         createdAt: new Date(),
  //         text: data?.message,
  //         sentBy: userId,
  //         sentTo: userId === 1 ? 2 : 1,
  //         user: {
  //           _id: userId,
  //           name: userName
  //         }
  //       };
  //       // console.log("messages---------",messages,[...messages, newMsg]);
  //       setMessages(previousMessages => GiftedChat.append(previousMessages, newMsg));
  //       // setMessages([...messages, newMsg]);
  //     }
  //   })
  // }, []);

  useEffect(() => {
    const handleMessage = async (data) => {
      console.log('Received message:Customer', data);

      if (data?.message && data?.senderRole === "rider") {
        let userId = data?.senderRole === 'customer' ? 1 : 2;
        let userName = data?.senderRole === 'customer' ? "Customer" : "Rider";
        const newMsg = {
          _id: Math.round(Math.random() * 1000000),
          createdAt: new Date(),
          text: data?.message,
          sentBy: userId,
          sentTo: userId === 1 ? 2 : 1,
          user: {
            _id: userId,
            name: userName
          }
        };

        let req = {
          orderId: item?._id,
          senderRole: 'customer',
        }

        await markSeen(req)

        setMessages(prevMessages => {
          const alreadyExists = prevMessages.some(
            msg => msg?.text === data?.message && msg?.user?._id === userId
          );
          if (alreadyExists) return prevMessages;
          return GiftedChat.append(prevMessages, newMsg);
        });
      }
    };

    // Prevent duplicate listeners
    socketServices.off?.('chat-message', handleMessage);
    socketServices.on('chat-message', handleMessage);

    return () => {
      socketServices.off?.('chat-message', handleMessage);
    };
  }, []);


  const onSend = useCallback(async (messages = []) => {
    console.log("item----onSend", item);
    const msg = messages[0];
    const myMsg = {
      ...msg,
      // sentBy: 2,
      // sentTo: 1,
      createdAt: new Date(),
    };
    let data = {
      orderId: item?._id,
      senderRole: 'customer',
      message: msg?.text,
      // riderId: item?.rider?._id,
      riderId: item?.rider?._id ?? item?.rider_id,
      customerId: appUser?._id
    }
    socketServices.emit('chat-message', data)
    sendMessage(data, handleErrorMsg);
    setInputText(''); // Clear input after sending
    setMessages(previousMessages => GiftedChat.append(previousMessages, myMsg));
    // const docId = appUser?._id > item?._id ? appUser?._id + "-" +item?._id: item?._id + "-" +appUser?._id ;
  }, [appUser, item, messages]);

  const handleErrorMsg = () => {
    getChatList();
  }

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
    <Wrapper
      edges={['left', 'right', 'bottom',]}
      transparentStatusBar
      onPress={() => {
        navigation.goBack();
      }}
      title={'Chat'}
      backArrow={true}
      onPressPhone={() => {
        hanldeLinking();
      }}
      showHeader
    >
      <View style={styles.container}>
        {(loading == true) &&
          <>
            <Spacer space={hp("7%")} />
            <AnimatedLoader type={'chatLoader'} />
          </>}
        <>
          {/* <View style={styles.haederView}>
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
        </View> */}

          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? undefined : 'height'}
            style={{ flex: 1 }} // Adjust paddingTop to header height
            keyboardVerticalOffset={Platform.OS === 'ios'
              ? keyboardVisible ? 0 : 0
              : keyboardVisible ? (Platform.OS === 'android' && Platform.Version >= 35) ? 100 : 85 : 0}
          >
            {/* <TouchableWithoutFeedback
          onPress={Keyboard.dismiss} accessible={false}> */}
            <View style={{ flex: 1, marginTop: hp('6%') }}>
              <GiftedChat
                // renderAvatar={renderAvatar}
                renderAvatar={null}
                messages={messages}
                // onSend={messages => onSend(messages)}
                user={{
                  _id: 1,
                }}
                // renderMessageImage={renderMessageImage}
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
                                  _id: messages?.length + 1,
                                  text: inputText.trim(),
                                  user: {
                                    _id: 1,
                                    name: 'Customer',
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
            {/* </TouchableWithoutFeedback> */}
          </KeyboardAvoidingView>
        </>
        <MikePopUp
          visible={visible}
          title={'Sorry! Didn’t hear that'}
          text={'Try saying somethings.'}
          onCancelBtn={onCancel}
          onSuccessResult={onSuccessResult}
        />
      </View>
    </Wrapper>
  );
}