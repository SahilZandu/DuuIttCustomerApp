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


const DeliveryInstructions = ({visible, onClose, menu, onSelectMenu,audioInstruction,txtInstuctions}) => {
  const ref = useRef(null);
  const stref = useRef(null);
  const [recodedFilePath, setRecodedFilePath] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPLayig] = useState(false);
  const [isAudio, setIsAudio] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  // useEffect(() => {

  //   return () => {
  //     stopPlayer();
  //     stopRecording();
  //   };
  // },);
  useEffect(()=>{
   requestPermission();
  
  },[]);

  const items = [
    {id: '0', text: 'Avoid Calling', img: appImagesSvg.avoidCalling},
    {id: '1', text: 'Leave at door', img: appImagesSvg.leaveAtDor},
    {id: '2', text: 'Leave with guard', img: appImagesSvg.leaveGuard},
    {id: '3', text: 'Don’t ring the bell', img: appImagesSvg.donotRing},
    {id: '4', text: 'Pet at home', img: appImagesSvg.petHome},
  ];

  const requestPermission=async () => {
    if (Platform.OS === 'android') {
      await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      ]);
    }
  }
 
 
  const toggleSelection = item => {
    setSelectedItems(prevSelected => {
      if (prevSelected.includes(item.text)) {
        console.log('prevSelected>');
        return prevSelected.filter(itemm => itemm !== item.text); // Remove from selected
      } else {
        console.log('new>',item.text);
        return [...prevSelected, item.text]; // Add to selected
      }
     
      
    });
  };

  const startNewPlayer = async () => {
    // currentPlayingRef = stref;
    if (stref.current?.currentState === PlayerState.paused) {
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
  const renderItem = ({item}) => {
    const isSelected = selectedItems.includes(item.text);
    if(selectedItems.length>0){
     setRecodedFilePath('');
     txtInstuctions(selectedItems);
    }else{
      txtInstuctions(null);
    }
   
   
    return (
      <TouchableOpacity
        style={[styles.item]}
        onPress={() => {
          toggleSelection(item)
         console.log('ss',selectedItems);
            txtInstuctions(selectedItems);
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <SvgXml xml={item.img} />
          <Text style={styles.itemText}>{item.text}</Text>
        </View>
        <Image
          style={{width: 12, height: 12}}
          source={isSelected ? appImages.checked : appImages.unChecked}
        />
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={() => {
        onClose();
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
          marginTop: Platform.OS == 'android' ? hp('45%') : hp('38%'),
        }}>
        <SvgXml xml={appImagesSvg.CROSS} />
      </Pressable>
      <View
        style={{
          // backgroundColor: '#F9BD00',
          backgroundColor: 'white',
          position: 'absolute',
          bottom: Platform.OS == 'android' ? 0 : '6%',

          width: wp('100%'),
          height: hp('50%'),
          borderTopEndRadius: 10,
          borderTopStartRadius: 10,
          borderColor: '#F9BD00',
          paddingTop: '5%',
        }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingBottom: '10%'}}>
          <View>
            <Text
              numberOfLines={1}
              style={{
                fontFamily: fonts.bold,
                fontSize: RFValue(15),
                padding: 10,
                color: '#000',
              }}>
              Delivery Instructions
            </Text>
            <TouchableOpacity
              onPress={() => {
               
                stopPlayer();
                if (isRecording) {
                  console.log('onPress', isRecording);
                  stopRecording();
                } else {
                  console.log('onPress', isRecording);
                  setRecodedFilePath('');
                  setSelectedItems([]);
                  setIsRecording(!isRecording);
                  setTimeout(() => {
                    startRecording();
                  }, 200);
                }
               }
            }
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
              <View
                style={{
                  paddingHorizontal: 16,
                  marginTop: '4%',
                  backgroundColor: 'white',

                  borderRadius: 10,
                  borderColor: '#F9BD00',
                  padding: 20,
                  margin: 10,

                  elevation: 4,
                  shadowColor: '#000',
                  shadowOpacity: 0.2,
                  shadowRadius: 5,
                }}>
                <View
                  style={{
                    flexDirection: 'row',

                    backgroundColor: 'white',
                    alignItems: 'center',
                  }}>
                  <SvgXml
                    xml={
                      isRecording ? appImagesSvg.stopRed : appImagesSvg.mikeSvg
                    }
                  />
                  <Text
                    numberOfLines={1}
                    style={{
                      fontFamily: fonts.medium,
                      fontSize: RFValue(12),

                      marginLeft: 10,
                      color: '#242424',
                    }}>
                    {isRecording
                      ? ''
                      : 'Tap and Hold to Start record instruction'}
                  </Text>
                  {isRecording && (
                    <Waveform
                      mode="live"
                      ref={ref}
                      scrubColor="#28B056"
                      waveColor="#28B056"
                      candleSpace={2}
                      candleWidth={4}
                      style={{
                        width: 10,
                        height: 10,
                        backgroundColor: colors.red,
                      }}
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
              <View
                style={{
                  paddingHorizontal: 16,
                  marginTop: '4%',
                  flexDirection: 'row',

                  backgroundColor: 'white',
                  alignItems: 'center',

                  borderRadius: 10,
                  borderColor: '#F9BD00',
                  padding: 20,
                  margin: 10,

                  elevation: 4,
                  shadowColor: '#000',
                  shadowOpacity: 0.2,
                  shadowRadius: 5,
                }}>
                <TouchableOpacity
                  onPress={() => {
                    isPlaying ? stopPlayer() : startNewPlayer();
                  }}>
                  <SvgXml
                    xml={
                      isPlaying ? appImagesSvg.stopRed : appImagesSvg.playRed
                    }
                  />
                </TouchableOpacity>
                <View
                  style={{
                    marginLeft: 10,
                    width: '80%',
                    justifyContent: 'center',
                    height: 20,
                    paddingEnd:20
                    
                  }}>
                  <Waveform
                    mode="static"
                    ref={stref}
                    path={recodedFilePath}
                    candleSpace={2}
                    candleWidth={4}
                    scrubColor="#28B056"
                    waveColor="gray"
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

            <View
              style={{
                paddingHorizontal: 16,

                backgroundColor: 'white',
                flexDirection: 'row',
                borderRadius: 10,
                borderColor: '#F9BD00',

                margin: '2%',
                alignItems: 'center',
                elevation: 4,
                shadowColor: '#000',
                shadowOpacity: 0.2,
                shadowRadius: 5,
              }}>
              <FlatList
                data={items}
                keyExtractor={item => item.text}
                renderItem={renderItem}
                extraData={selectedItems} // Make sure to re-render the list when selection changes
              />
            </View>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  item: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: 10,
  },
  selectedItem: {
    backgroundColor: '#D3F8D3', // Light green for selected items
  },
  itemText: {
    fontSize: 18,
    marginStart: 10,
    fontFamily: fonts.medium,
    fontSize: RFValue(12),
    color: '#242424',
  },
  selectedContainer: {
    marginTop: 20,
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  selectedHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});

export default DeliveryInstructions;

const close = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
<path d="M12 4L4 12" stroke="white" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M4 4L12 12" stroke="white" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;
