import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Modal,
  Image,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Pressable,
  Text,
  ScrollView,
  Platform,
  Linking,
  PermissionsAndroid,
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
import RecordAudioPopUp from '../Popup/RecordAudioPopUp';
import {
  Waveform,
  IWaveformRef,
  UpdateFrequency,
  PlayerState,
  FinishMode,
} from '@simform_solutions/react-native-audio-waveform';
import {colors} from '../../../theme/colors';
import BTN from '../../../components/cta/BTN';

const DeliveryInstructions = ({
  visible,
  onClose,
  menu,
  onSelectMenu,
  audioInstruction,
  txtInstuctions,
  txtInstArray,
}) => {
  const ref = useRef(null);
  const stref = useRef(null);
  const [recodedFilePath, setRecodedFilePath] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPLayig] = useState(false);
  const [isAudio, setIsAudio] = useState(false);
  const [selectedItems, setSelectedItems] = useState(txtInstArray ?? []);
  // useEffect(() => {

  //   return () => {
  //     stopPlayer();
  //     stopRecording();
  //   };
  // },);
  useEffect(() => {
    requestPermission();
  }, []);

  const items = [
    {id: '0', text: 'Avoid Calling', img: appImagesSvg.avoidCalling},
    {id: '1', text: 'Leave at door', img: appImagesSvg.leaveAtDor},
    {id: '2', text: 'Leave with guard', img: appImagesSvg.leaveGuard},
    {id: '3', text: 'Don’t ring the bell', img: appImagesSvg.donotRing},
    {id: '4', text: 'Pet at home', img: appImagesSvg.petHome},
  ];

  const requestPermission = async () => {
    if (Platform.OS === 'android') {
      await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      ]);
    }
  };

  // const toggleSelection = item => {
  //   // setSelectedItems(prevSelected => {
  //   //   if (prevSelected?.includes(item?.text)) {
  //   //     // console.log('prevSelected>');
  //   //     return prevSelected?.filter(itemm => itemm !== item?.text); // Remove from selected
  //   //   } else {
  //   //     // console.log('new>', item.text);
  //   //     return [...prevSelected, item?.text]; // Add to selected
  //   //   }
  //   // });
  //   const updatedSelectedItems = selectedItems.includes(item?.text)
  //   ? selectedItems.filter(selected => selected !== item?.text) // Remove item if already selected
  //   : [...selectedItems, item?.text]; // Add item if not already selected

  //    setSelectedItems(updatedSelectedItems);
  //    txtInstuctions(updatedSelectedItems)
  // };


  const toggleSelection = item => {
    let updatedSelectedItems = [...selectedItems];

    // Remove the selected item if it already exists
    updatedSelectedItems = updatedSelectedItems?.filter(
      selected => selected !== item?.text,
    );

    // Define mutually exclusive options
    if (item?.text === 'Leave with guard') {
      updatedSelectedItems = updatedSelectedItems?.filter(
        selected =>
          selected !== 'Leave at door' && selected !== 'Don’t ring the bell',
      );
    } else if (
      item?.text === 'Leave at door' ||
      item?.text === 'Don’t ring the bell'
    ) {
      updatedSelectedItems = updatedSelectedItems?.filter(
        selected => selected !== 'Leave with guard',
      );
    }
    
    // If item was removed in the first step, don't add it again
    if (!selectedItems?.includes(item?.text)) {
      updatedSelectedItems.push(item?.text);
    }

    // console.log('Updated Selected Items:', updatedSelectedItems); // Debugging

    // Update the state separately
    setSelectedItems(updatedSelectedItems);
    txtInstuctions(updatedSelectedItems); // Update instructions
  };

  const startNewPlayer = async () => {
    // currentPlayingRef = stref;
    if (stref?.current?.currentState === PlayerState.paused) {
      await stref.current?.resumePlayer();
    } else {
      console.log('ply>');
      setIsPLayig(!isPlaying);
      await stref.current?.startPlayer({
        finishMode: FinishMode.stop,
      });
    }
  };

  const stopPlayer = async () => {
    if (stref?.current?.currentState === PlayerState.playing) {
      setIsPLayig(false);
      stref?.current?.stopPlayer();
    }
  };

  const deleteRecoring = async () => {
    setRecodedFilePath('');
    audioInstruction(null);
    stopPlayer();
  };

  const stopRecording = () => {
    setIsRecording(!isRecording);
    ref.current?.stopRecord().then(path => {
      console.log('path>', path);
      setRecodedFilePath('');
      setTimeout(() => {
        setRecodedFilePath(path);
        audioInstruction(path);
      }, 300);

      // setList(prev => [...prev, { fromCurrentUser: true, path }]);
    });
  };
  const startRecording = () => {
    ref.current
      ?.startRecord({
        updateFrequency: UpdateFrequency.high,
      })
      .then(() => {})
      .catch(() => {});
  };
  // Render item for the FlatList
  const renderItem = ({item, index}) => {
    const isSelected = selectedItems?.includes(item.text);
    // if (selectedItems?.length > 0) {
    //   // setRecodedFilePath('');
    //   txtInstuctions(selectedItems);
    // } else {
    //   txtInstuctions(null);
    // }

    return (
      <TouchableOpacity
        key={index}
        activeOpacity={0.8}
        style={[
          styles.renderItemStyle,
          {
            borderBottomColor:
              items?.length - 1 == index ? 'transparent' : colors.colorD9,
          },
        ]}
        onPress={() => {
          toggleSelection(item);
          console.log('ss', selectedItems);
          // txtInstuctions(selectedItems);
        }}>
        <SvgXml xml={item.img} />
        <Text style={styles.itemText}>{item.text}</Text>
        <Image
          resizeMode="contain"
          style={{width: 12, height: 12}}
          source={isSelected ? appImages.checked : appImages.unChecked}
        />
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      // style={{justifyContent: 'flex-end', margin: 0}}
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={() => {
        onClose();
      }}>
      <Pressable onPress={() =>{ onClose()}} style={styles.container}>
        <Pressable onPress={() => {onClose()}} style={styles.backButtonTouch}>
          <Image
            resizeMode="contain"
            style={{height: 45, width: 45}}
            source={appImages.crossClose} // Your icon image
          />
        </Pressable>
        <View style={styles.mainWhiteView}>
          <ScrollView
            nestedScrollEnabled={true}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingBottom: '5%',
              justifyContent: 'center',
            }}>
            <View style={styles.scrollInnerView}>
              <Text numberOfLines={1} style={styles.delivertText}>
                Delivery Instructions
              </Text>
              <Text numberOfLines={1} style={styles.selectedInstText}>
              Selected Instructions : {selectedItems?.length ?? 0}
              </Text>
              
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  stopPlayer();
                  if (isRecording) {
                    console.log('onPress', isRecording);
                    stopRecording();
                  } else {
                    console.log('onPress', isRecording);
                    setRecodedFilePath('');
                    // setSelectedItems([]);
                    setIsRecording(!isRecording);
                    setTimeout(() => {
                      startRecording();
                    }, 200);
                  }
                }}
                // onLongPress={()=>{
                //   console.log('onLongPress');
                //   startRecording();
                // }}
                // onPressOut={()=>{
                //   console.log('onPressOut');
                //         stopRecording();
                // }}
                // onPress={() => {
                //   setIsAudio(!isAudio);
                // }}
              >
                <View style={styles.recordingView}>
                  <View style={styles.recodingInnerView}>
                    <SvgXml
                      xml={
                        isRecording
                          ? appImagesSvg.stopRed
                          : appImagesSvg.mikeSvg
                      }
                    />
                    <Text numberOfLines={1} style={styles.startRecoedingText}>
                      {isRecording
                        ? ''
                        : 'Tap and Hold to Start record instruction'}
                    </Text>
                    {isRecording && (
                      <Waveform
                        mode="live"
                        ref={ref}
                        scrubColor={colors.main}
                        waveColor={colors.main}
                        candleSpace={2}
                        candleWidth={4}
                        style={styles.isRecoedingText}
                        candleHeightScale={2}
                        onRecorderStateChange={recorderState =>
                          console.log('onRecorderStateChange>', recorderState)
                        }
                      />
                    )}
                  </View>
                </View>
              </TouchableOpacity>

              {recodedFilePath !== '' && (
                <View style={styles.recodingPathView}>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => {
                      isPlaying ? stopPlayer() : startNewPlayer();
                    }}>
                    <SvgXml
                      xml={
                        isPlaying ? appImagesSvg.stopRed : appImagesSvg.playRed
                      }
                    />
                  </TouchableOpacity>
                  <View style={styles.trackingPathView}>
                    <Waveform
                      mode="static"
                      ref={stref}
                      path={recodedFilePath}
                      candleSpace={2}
                      candleWidth={4}
                      scrubColor={colors.main}
                      waveColor={colors.black65}
                      onPlayerStateChange={playerState => {
                        console.log('playerState', playerState);
                        if (playerState === 'stopped') {
                          setIsPLayig(false);
                        }
                      }}
                      onPanStateChange={isMoving => console.log(isMoving)}
                      onCurrentProgressChange={(
                        currentProgress,
                        songDuration,
                      ) => {
                        console.log(
                          `currentProgress ${currentProgress}, songDuration ${songDuration}`,
                        );
                      }}
                    />
                  </View>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => {
                      deleteRecoring();
                    }}>
                    <SvgXml xml={appImagesSvg.deleteRed} />
                  </TouchableOpacity>
                </View>
              )}
              {/* <RecordAudioPopUp
        visible={isAudio}
        onRecord={r => {
          const data = {
            text: textInstruction,
            audio: r,
          };
          console.log('Audio>',data);

          // onAction('Audio', data);
        }}
        onClose={() => setIsAudio(false)}
      /> */}

              <View style={styles.flatListMainView}>
                <FlatList
                  scrollEnabled={false}
                  nestedScrollEnabled={false}
                  showsVerticalScrollIndicator={false}
                  data={items}
                  keyExtractor={item => item?.id?.toString()}
                  renderItem={renderItem}
                  extraData={selectedItems} // Make sure to re-render the list when selection changes
                />
              </View>
              {/* <View style={{marginTop:'9%'}}>
                <BTN 
                title={'Ok'}  onPress={() =>{txtInstuctions(selectedItems ?? []),onClose()}}/>
              </View> */}
            </View>
          </ScrollView>
        </View>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    height: hp('56%'),
    borderTopEndRadius: 20,
    borderTopStartRadius: 20,
    borderColor: colors.colorF9,
    paddingTop: '3%',
  },
  scrollInnerView: {
    marginHorizontal: 10,
    justifyContent: 'center',
  },
  delivertText: {
    fontFamily: fonts.bold,
    fontSize: RFValue(15),
    marginHorizontal: '3%',
    color: colors.black,
  },
  selectedInstText: {
    fontFamily: fonts.medium,
    fontSize: RFValue(12),
    color: colors.black, 
   marginHorizontal:'3%',
    marginTop:'2%',
   marginBottom:'2%'
  },
  recordingView: {
    paddingHorizontal: 16,
    marginTop: '2%',
    backgroundColor: colors.white,
    borderRadius: 10,
    borderColor: colors.colorF9,
    width: wp('90%'),
    height: hp('7%'),
    alignSelf: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: colors.black,
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  recodingInnerView: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    alignItems: 'center',
  },
  startRecoedingText: {
    fontFamily: fonts.medium,
    fontSize: RFValue(12),
    marginLeft: '3%',
    color: colors.color24,
  },
  isRecoedingText: {
    width: 10,
    height: 10,
    backgroundColor: colors.red,
  },
  recodingPathView: {
    paddingHorizontal: 16,
    marginTop: '4%',
    flexDirection: 'row',
    backgroundColor: colors.white,
    alignItems: 'center',
    borderRadius: 10,
    borderColor: colors.colorF9,
    width: wp('90%'),
    height: hp('8%'),
    alignSelf: 'center',
    elevation: 4,
    shadowColor: colors.black,
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  trackingPathView: {
    marginHorizontal: 5,
    width: wp('68%'),
    justifyContent: 'center',
    height: hp('4%'),
  },
  flatListMainView: {
    width: wp('90%'),
    paddingHorizontal: 16,
    backgroundColor: colors.white,
    flexDirection: 'row',
    borderRadius: 10,
    borderColor: colors.colorF9,
    alignItems: 'center',
    alignSelf: 'center',
    elevation: 4,
    shadowColor: colors.black,
    shadowOpacity: 0.2,
    shadowRadius: 5,
    marginTop: '5%',
  },
  renderItemStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: '5%',
    borderBottomWidth: 1,
    borderBottomColor: colors.colorD9,
  },
  itemText: {
    flex: 1,
    marginLeft: '3%',
    fontFamily: fonts.medium,
    fontSize: RFValue(12),
    color: colors.color24,
  },
});

export default DeliveryInstructions;
