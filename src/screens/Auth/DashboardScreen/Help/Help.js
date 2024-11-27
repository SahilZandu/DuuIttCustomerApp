import React, {Component, useEffect, useState} from 'react';
import {View, Text, TextInput, TouchableOpacity,  Linking,} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import InputScrollView from 'react-native-input-scroll-view';
import {SvgXml} from 'react-native-svg';
import Header from '../../../../components/header/Header';
import { fonts } from '../../../../theme/fonts/fonts';
import Spacer from '../../../../halpers/Spacer';
import { colors } from '../../../../theme/colors';

let helpArray = [
  {
    id: 1,
    name: 'I did not receive this order',
    discription:
      'We are really sorry for this experience. You can try reaching out to our delivery executive or us and we will try to resolve this as soon as possible.',
    bio: 'NotReceiveOrder',
  },
  {
    id: 2,
    name: 'Item(s) portion size is not adequate',
    discription:
      'We are really sorry for this experience. You can try reaching out to our delivery executive or us and we will try to resolve this as soon as possible.',
    bio: 'SizeNotAdequate',
  },
  {
    id: 3,
    name: 'Report a Safety incident',
    discription:
      'We are really sorry for this experience. You can try reaching out to our delivery executive or us and we will try to resolve this as soon as possible.',
    bio: 'SafetyIncident',
  },
  {
    id: 4,
    name: 'Few Items missing in my order',
    discription:
      'We are really sorry for this experience. You can try reaching out to our delivery executive or us and we will try to resolve this as soon as possible.',
    bio: 'MissingMyOrder',
  },
  {
    id: 5,
    name: 'Item(s) quality is poor',
    discription:
      'We are really sorry for this experience. You can try reaching out to our delivery executive or us and we will try to resolve this as soon as possible.',
    bio: 'QualityPoor',
  },
  {
    id: 6,
    name: 'I have coupon related issue',
    discription:
      'We are really sorry for this experience. You can try reaching out to our delivery executive or us and we will try to resolve this as soon as possible.',
    bio: 'couponRelatedIssue',
  },
  {
    id: 7,
    name: 'Payment and billing related issue',
    discription:
      'We are really sorry for this experience. You can try reaching out to our delivery executive or us and we will try to resolve this as soon as possible.',
    bio: 'PaymentRelatedIssue',
  },
];

export default function Help({navigation}) {

  const [loading, setLoading] = useState(false);
  const [openClose, setOpenClose] = useState('');

  const onPressDownUp = item => {
    if (item?.id === openClose) {
      setOpenClose('');
    } else {
      setOpenClose(item?.id);
    }
  };

  return (
    <View style={{flex: 1, backgroundColor:colors.white}}>
        <Header
        onPress={() => {
          navigation.goBack();
        }}
        title={'Help'}
        backArrow={true}
          />
      <InputScrollView
        bounces={false}
        showsVerticalScrollIndicator={false}
        keyboardOffset={hp('20%')}
        contentContainerStyle={{
          paddingBottom: '10%',
        }}>
        <Spacer space={'4%'}/>
        <View style={{height: 1, backgroundColor: colors.colorD9}} />
        {helpArray?.map((item, i) => {
          return (
            <View>
              <View style={{marginHorizontal: 16, marginTop: '2%'}}>
                <TouchableOpacity
                style={{flexDirection: 'row', marginTop: '3%'}}
                    activeOpacity={0.8}
                    onPress={() => {
                      onPressDownUp(item);
                    }}
                    hitSlop={{top: 15, bottom: 15, right: 5, left: 5}}>
                  <Text
                    style={{
                      flex: 1,
                      fontSize: RFValue(12),
                      fontFamily: fonts.medium,
                      color:colors.color43,
                    }}>
                    {item?.name}
                  </Text>

                    <SvgXml
                      xml={openClose == item?.id ? upperIcon : downIcon}
                    />
                  </TouchableOpacity>

                {openClose === item?.id && (
                  <>
                    <Text
                      style={{
                        fontSize: RFValue(12),
                        fontFamily: fonts.medium,
                        color:colors.color80,
                        marginTop: '5%',
                      }}>
                      {item?.discription}
                    </Text>

                  </>
                )}
              </View>
              <View
                style={{height: 1, backgroundColor:colors.colorD9, marginTop: '5%'}}
              />
            </View>
          );
        })}
      </InputScrollView>

    </View>
  );
}

const downIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 20 20" fill="none">
<path d="M5 7.5L10 12.5L15 7.5" stroke="#595959" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

const upperIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 20 20" fill="none">
<path d="M15 12.5L10 7.5L5 12.5" stroke="#595959" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;




// import React, {Component, useCallback, useEffect, useState} from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   Linking,
//   Image,
//   Alert,
//   KeyboardAvoidingView,
//   Platform,
//   SafeAreaView,
// } from 'react-native';
// import {RFValue} from 'react-native-responsive-fontsize';
// import {
//   widthPercentageToDP as wp,
//   heightPercentageToDP as hp,
// } from 'react-native-responsive-screen';
// import InputScrollView from 'react-native-input-scroll-view';
// import {SvgXml} from 'react-native-svg';
// import Header from '../../../../components/header/Header';
// import {fonts} from '../../../../theme/fonts/fonts';
// import Spacer from '../../../../halpers/Spacer';
// import {colors} from '../../../../theme/colors';
// import {
//   GiftedChat,
//   Bubble,
//   InputToolbar,
//   Composer,
//   Send,
// } from 'react-native-gifted-chat';
// import Url from '../../../../api/Url';
// import {rootStore} from '../../../../stores/rootStore';
// import {appImages, appImagesSvg} from '../../../../commons/AppImages';
// import MikePopUp from '../../../../components/MikePopUp';
// import AppInputScroll from '../../../../halpers/AppInputScroll';

// export default function Help({navigation}) {
//   const [messages, setMessages] = useState([]);
//   const [visible, setVisible] = useState(false);
//   const {appUser} = rootStore.commonStore;


//   const hanldeLinking = () => {
//     Linking.openURL(`tel:${'1234567890'}`);
//   };

//   useEffect(() => {
//     setTimeout(()=>{
//       const {appUser} = rootStore.commonStore;
//       setMessages([
//         {
//           _id: 1,
//           text: 'Hello developer',
//           createdAt: new Date(),
//            avatar: Url?.Image_Url + appUser?.profile_pic,
//           user: {
//             _id: 2,
//             name: 'React Native',
//             avatar: Url?.Image_Url + appUser?.profile_pic,
//           },
//         },
//       ]);

//     },1000)
   
//   }, []);

//   const onSend = useCallback((messages = []) => {
//     const msg = messages[0];
//     const myMsg = {
//       ...msg,
//       sentBy: 2,
//       sentTo: 1,
//       createdAt: new Date(),
//     };
//     setMessages(previousMessages => GiftedChat.append(previousMessages, myMsg));
//     // const docId = appUser?._id > item?._id ? appUser?._id + "-" +item?._id: item?._id + "-" +appUser?._id ;
//   }, []);

//   const onSuccessResult = item => {
//     console.log('item=== onSuccessResult', item);
//     // setSearchRes(item);
//     setVisible(false);
//   };

//   const onCancel = () => {
//     setVisible(false);
//   };
  
//   const renderMessageImage = (props) => {
//     return (
//       <View style={{ backgroundColor: '#f0f0f0', // Custom background color
//       borderRadius: 10,
//       padding: 5, // Add padding for better spacing
//     }}>
//         <Image
//           source={{ uri: props.currentMessage.image }}
//           style={{ width: 200, // Custom width
//           height: 150, // Custom height
//           borderRadius: 8, // Optional: Rounded corners
//         }}
//           resizeMode="cover" // You can use 'contain', 'cover', 'stretch', etc.
//         />
//       </View>
//     );
//   };


//   return (
//     <View style={{flex: 1, backgroundColor: colors.white}}>
//       <Header
//         onPress={() => {
//           navigation.goBack();
//         }}
//         title={'Chat'}
//         backArrow={true}
//         onPressPhone={() => {
//           hanldeLinking();
//         }}
//       />
//        <View style={{flex:1,}}>
//         <GiftedChat
//           messages={messages}
//           onSend={messages => onSend(messages)}
//           user={{
//             _id: 1,
//           }}
//           renderMessageImage={renderMessageImage}
//           renderBubble={props => {
//             return (
//               <Bubble
//                 {...props}
//                 textStyle={{
//                   right: {
//                     fontSize: RFValue(13),
//                     fontFamily: fonts.medium,
//                     color: colors.white,
//                   },
//                   left: {
//                     fontSize: RFValue(13),
//                     fontFamily: fonts.medium,
//                     color: colors.black,
                  
//                   },
//                 }}
//                 wrapperStyle={{
//                   right: {
//                     backgroundColor: colors.main,
//                     borderTopLeftRadius: 10,
//                     borderBottomRightRadius: 0,
//                     borderTopRightRadius: 10,
//                     borderBottomLeftRadius: 10,
//                     marginBottom:'3%'
//                   },
//                   left: {
//                     backgroundColor: colors.screenBackground,
//                     borderColor: colors.colorD9,
//                     borderWidth: 0.4,
//                     borderTopLeftRadius: 10,
//                     borderBottomRightRadius: 10,
//                     borderTopRightRadius: 10,
//                     borderBottomLeftRadius: 0,
//                     marginBottom:'3%'
//                   },
//                 }}
//               />
//             );
//           }}
//           renderInputToolbar={props => (
//             <InputToolbar
//               {...props}
//               containerStyle={{
//                 borderTopWidth: 0,
//                 backgroundColor: '#F5F5F5',
//                 borderRadius: 10,
//                 marginHorizontal: 16,
//                 bottom:Platform.OS == 'ios'? '0%':'2%'
//               }}
//               textInputStyle={{color: colors.black}}
//               renderComposer={composerProps => (
//                 <View
//                   style={{
//                     flexDirection: 'row',
//                     alignItems: 'center',
//                     // backgroundColor: colors.white,
//                     borderRadius: 10,
//                     flex: 1,
//                   }}>
//                   <Composer
//                     {...composerProps}
//                     placeholder="Type a message here...." // Custom placeholder text
//                     textInputStyle={{
//                        flex: 1,
//                       color: colors.black,
//                       fontSize: RFValue(13),
//                       fontFamily: fonts.medium,
//                       paddingVertical: 10,
//                     }}
//                   />
//                 </View>
//               )}
//               renderSend={sendProps => (
//                 <View style={{flexDirection: 'row', justifyContent: 'center',alignSelf:'center'}}>
//                   <TouchableOpacity
//                     style={{
//                       marginRight: 2,
//                       // backgroundColor: colors.main,
//                       borderRadius: 100,
//                       height: hp('4.5%'),
//                       width: hp('4.5%'),
//                       justifyContent: 'center',
//                       alignItems: 'center',
//                     }}
//                     onPress={() => {
//                       // if (sendProps.text?.trim()) {
//                       //   sendProps.onSend({text: sendProps.text.trim()}, true);
//                       // }
//                       setVisible(true)
//                     }}>
//                     <SvgXml xml={appImagesSvg.mikeSvg} width={20} height={20} />
//                   </TouchableOpacity>
//                   <View
//                     style={{
//                       height: hp('3%'),
//                       width: wp('0.3'),
//                       backgroundColor: colors.colorA9,
//                       // marginTop: '-1%',
//                       alignSelf: 'center',
//                     }}
//                   />
//                   <TouchableOpacity
//                     style={{
//                       marginRight: 5,
//                       // backgroundColor: colors.main,
//                       borderRadius: 20,
//                       borderRadius: 100,
//                       height: hp('4.5%'),
//                       width: hp('4.5%'),
//                       justifyContent: 'center',
//                       alignItems: 'center',
//                     }}
//                     onPress={() => {
//                       if (sendProps.text?.trim()) {
//                         sendProps.onSend({text: sendProps.text.trim()}, true);
//                       }
//                     }}>
//                     <SvgXml
//                       xml={appImagesSvg.sendChat}
//                       width={20}
//                       height={20}
//                     />
//                   </TouchableOpacity>
//                 </View>
//               )}
//             />
//           )}
//         />
//         </View>
//       <MikePopUp
//         visible={visible}
//         title={'Sorry! Didn’t hear that'}
//         text={'Try saying somethings.'}
//         onCancelBtn={onCancel}
//         onSuccessResult={onSuccessResult}
//       />
//     </View>
//   );
// }
