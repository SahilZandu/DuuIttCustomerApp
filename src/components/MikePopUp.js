import React, {useState, useEffect, useRef} from 'react';
import {
  Text,
  View,
  Dimensions,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  TouchableHighlight,
  Animated,
  TouchableWithoutFeedback,
  Platform,
} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import Modal from 'react-native-modal';
import {fonts} from '../theme/fonts/fonts';
import {colors} from '../theme/colors';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {SvgXml} from 'react-native-svg';
import {appImagesSvg} from '../commons/AppImages';
import Voice, {
  SpeechRecognizedEvent,
  SpeechResultsEvent,
  SpeechErrorEvent,
} from '@react-native-voice/voice';
import Spacer from '../halpers/Spacer';




const MikePopUp = ({visible, title, text, onCancelBtn, onSuccessResult}) => {
  const [recognized, setRecognized] = useState('');
  const [pitch, setPitch] = useState('');
  const [error, setError] = useState('');
  const [end, setEnd] = useState('');
  const [started, setStarted] = useState('');
  const [results, setResults] = useState([]);
  const [partialResults, setPartialResults] = useState([]);
  const [startRecording, setStartRecording] = useState(false);
  const [searchResult, setSearchResult] = useState('');

  const scale = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(1)).current;
  const [isRecording, setIsRecording] = useState(false);

  useEffect(() => {
    Voice.onSpeechStart = onSpeechStart;
    Voice.onSpeechRecognized = onSpeechRecognized;
    Voice.onSpeechEnd = onSpeechEnd;
    Voice.onSpeechError = onSpeechError;
    Voice.onSpeechResults = onSpeechResults;
    Voice.onSpeechPartialResults = onSpeechPartialResults;
    Voice.onSpeechVolumeChanged = onSpeechVolumeChanged;

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const onSpeechStart = e => {
    console.log('onSpeechStart: ', e);
    setStarted('√');
  };

  const onSpeechRecognized = e => {
    console.log('onSpeechRecognized: ', e);
    setRecognized('√');
  };

  const onSpeechEnd = e => {
    console.log('onSpeechEnd: ', e);
    setEnd('√');
  };

  const onSpeechError = e => {
    console.log('onSpeechError: ', e);
    setError(JSON.stringify(e.error));
    setStartRecording(false);
  };

  const onSpeechResults = e => {
    console.log('onSpeechResults: ', e);
    setResults(e.value);
    setSearchResult(e?.value[0]);
  };

  const onSpeechPartialResults = e => {
    console.log('onSpeechPartialResults: ', e);
    setPartialResults(e.value);
  };

  const onSpeechVolumeChanged = e => {
    console.log('onSpeechVolumeChanged: ', e);
    setPitch(e.value);
  };

  const startRecognizing = async () => {
    onStartAnimation();
    setSearchResult('');
    setStartRecording(true);
    setRecognized('');
    setPitch('');
    setError('');
    setStarted('');
    setResults([]);
    setPartialResults([]);
    setEnd('');

    try {
      await Voice.start('en-US');
    } catch (e) {
      console.error(e);
    }
  };

  const stopRecognizing = async () => {
    try {
      await Voice.stop();
    } catch (e) {
      console.error(e);
    }
  };

  const onSuccess = () => {
    onSuccessResult(searchResult);
    destroyRecognizer();
  };

  const onCancel = () => {
    onCancelBtn();
    destroyRecognizer();
  };

  const cancelRecognizing = async () => {
    try {
      await Voice.cancel();
    } catch (e) {
      console.error(e);
    }
  };

  const destroyRecognizer = async () => {
    try {
      await Voice.destroy();
    } catch (e) {
      console.error(e);
    }
    setRecognized('');
    setPitch('');
    setError('');
    setStarted('');
    setResults([]);
    setPartialResults([]);
    setEnd('');
    setStartRecording(false);
    setSearchResult('');
  };

  const onStartAnimation = () => {
    stopRecognizing();
    setIsRecording(true);
    Animated.loop(
      Animated.sequence([
        Animated.timing(scale, {
          toValue: 1.2,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.5,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  };

  const onStopAnimation = () => {
    setTimeout(() => {
      setIsRecording(false);
      Animated.timing(scale).stop();
      Animated.timing(opacity).stop();
      scale.setValue(1);
      opacity.setValue(1);
      setStartRecording(false);
     setSearchResult('');
      stopRecognizing()
    }, 8000);
  };

  return (
    <View style={styles.centeredView}>
      {/* <Text style={styles.welcome}>Welcome to React Native Voice!</Text>
      <Text style={styles.instructions}>
        Press the button and start speaking.
      </Text>
      <Text style={styles.stat}>{`Started: ${started}`}</Text>
      <Text style={styles.stat}>{`Recognized: ${recognized}`}</Text>
      <Text style={styles.stat}>{`Pitch: ${pitch}`}</Text>
      <Text style={styles.stat}>{`Error: ${error}`}</Text>
      <Text style={styles.stat}>Results</Text>
      {results?.map((result, index) => {
        return (
          <Text key={`result-${index}`} style={styles.stat}>
            {result}
          </Text>
        );
      })}
      <Text style={styles.stat}>Partial Results</Text>
      {partialResults?.map((result, index) => {
        return (
          <Text key={`partial-result-${index}`} style={styles.stat}>
            {result}
          </Text>
        );
      })}
      <Text style={styles.stat}>{`End: ${end}`}</Text>
      <TouchableHighlight onPress={()=>{startRecognizing()}}>
         <Text style={styles.action}>Start Recognizing</Text>
      </TouchableHighlight> 
       <TouchableHighlight onPress={()=>{stopRecognizing()}}>
        <Text style={styles.action}>Stop Recognizing</Text>
      </TouchableHighlight>
      <TouchableHighlight onPress={()=>{cancelRecognizing()}}>
        <Text style={styles.action}>Cancel</Text>
      </TouchableHighlight>
      <TouchableHighlight onPress={()=>{destroyRecognizer()}}>
        <Text style={styles.action}>Destroy</Text>
      </TouchableHighlight> */}

      <Modal
        animationType="slide"
        isVisible={visible}
        swipeDirection="down"
        animationIn="slideInUp"
        animationOut="slideOutDown"
        style={styles.modal}>
        <View style={styles.mainView}>
          <View style={styles.subView}>
            <View
              style={{
                justifyContent: 'flex-end',
                alignItems: 'flex-end',
                marginTop: '4%',
                right: '4%',
              }}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  onCancel();
                }}
                style={{
                  backgroundColor: '#FF8A28',
                  height: 30,
                  width: 30,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 100,
                }}>
                <SvgXml
                  style={{
                    alignSelf: 'center',
                    // shadowColor: '#000',
                    // shadowOffset: {
                    //   width: 1,
                    //   height: 3,
                    // },
                    // shadowOpacity: 0.4,
                    // shadowRadius: 3,
                  }}
                  xml={appImagesSvg.cancelWhiteSvg}
                />
              </TouchableOpacity>
            </View>
            {searchResult?.length > 0 ? (
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginHorizontal: '7%',
                }}>
                <Text numberOfLines={2} style={styles.searchText}>
                  {searchResult}
                </Text>
                <TouchableOpacity 
                  style={styles.shadowContainer}
                 onPress={() => {
                  onSuccess();
                }}>
                <SvgXml
                 style={{top:'10%',alignSelf:'center'}}
                  xml={appImagesSvg.successGreenSvg}
                />
                <Spacer space={"1%"} />
                </TouchableOpacity>
              </View>
            ) : (
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginHorizontal: '7%',
                }}>
                {startRecording == true ? (
                  <View>
                    <Text numberOfLines={1} style={styles.loadingText}>
                      {'Listening.......'}
                    </Text>
                    <TouchableWithoutFeedback
                      onPressIn={() => {
                        stopRecognizing();
                      }}
                      onPressOut={() => {
                        onStopAnimation();
                      }}>
                      <Animated.View
                        style={[
                          styles.iconContainer,
                          {transform: [{scale}], opacity},
                        ]}>
                        <SvgXml
                          style={{
                            top: 3.5,
                            alignSelf: 'center',
                            // shadowColor: '#000',
                            // shadowOffset: {
                            //   width: 1,
                            //   height: 3,
                            // },
                            // shadowOpacity: 0.4,
                            // shadowRadius: 3,
                          }}
                          xml={appImagesSvg.mikeRecordSvg}
                        />
                      </Animated.View>
                    </TouchableWithoutFeedback>
                  </View>
                ) : (
                  <>
                    <Text numberOfLines={1} style={styles.titleText}>
                      {title ? title : 'Try saying restaurant name or a dish.'}
                    </Text>
                    <Text numberOfLines={2} style={styles.textSecond}>
                      {text}
                    </Text>
                    <TouchableOpacity onPress={() =>{startRecognizing()}} style={styles.shadowContainer}>
                      <SvgXml
                      style={{top:'3%'}}
                        xml={appImagesSvg.mikeRecordSvg}
                      />
                    </TouchableOpacity>
                    <Text numberOfLines={1} style={styles.textThird}>
                      {'Tap the microphone to try again'}
                    </Text>
                  </>
                )}
              </View>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default MikePopUp;

const styles = StyleSheet.create({
  centeredView: {
    flex: 0,
  },
  mainView: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  subView: {
    backgroundColor: '#FFFFFF',
    width: '100%',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    paddingBottom: '12%',
  },
  titleText: {
    color: colors.black,
    fontFamily: fonts.bold,
    fontSize: RFValue(16),
    textAlign: 'center',
  },
  loadingText: {
    color: '#A9A9AA',
    fontFamily: fonts.bold,
    fontSize: RFValue(16),
    textAlign: 'center',
    marginTop: '-1%',
  },
  searchText: {
    color: colors.black,
    fontFamily: fonts.bold,
    fontSize: RFValue(16),
    textAlign: 'center',
    marginTop: '-1%',
  },
  textSecond: {
    color: '#A9A9AA',
    fontFamily: fonts.semiBold,
    fontSize: RFValue(12),
    textAlign: 'center',
    marginTop: hp('1.5%'),
  },
  textThird: {
    color: colors.black,
    fontFamily: fonts.medium,
    fontSize: RFValue(12),
    textAlign: 'center',
    marginTop: hp('1.5%'),
  },
  buttonText: {
    color: colors.white,
    fontFamily: fonts.medium,
    fontSize: RFValue(10),
    textAlign: 'center',
  },
  buttonViewMain: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: hp('3%'),
    alignItems: 'center',
    marginTop: hp('2.5%'),
  },
  cancelBottonView: {
    width: wp('25%'),
    height: hp('4%'),
    backgroundColor: '#6A28BC',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  deleteButtonView: {
    width: wp('25%'),
    height: hp('4%'),
    backgroundColor: '#CB2F2F',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  waitButtonView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  iconContainer: {
    marginTop: '8%',
    backgroundColor: '#FF8A28',
    padding: 4,
    borderRadius: 100,
    alignSelf: 'center',
  },
  shadowContainer: {
    ...Platform.select({
      ios: {
        marginTop:'8%',
        // shadowColor: '#000',
        // shadowOffset: {
        //   width: 0,
        //   height: 3,
        // },
        // shadowOpacity: 0.4,
        // shadowRadius: 3,
      },
      android: {
        marginTop:'6%',
        // elevation:15,
          padding:1,
         borderRadius:100,
      },
    }),
  },


});
