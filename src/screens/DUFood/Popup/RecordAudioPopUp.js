import React, {useState, useEffect, useRef} from 'react';
import {
  Text,
  View,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Pressable,
} from 'react-native';
import {fonts} from '../../../theme/fonts/fonts';
import {RFValue} from 'react-native-responsive-fontsize';
// import CTA from '../CTA';
// import Spacer from '../Spacer';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
// import {rootStore} from '../../stores/rootStore';
import {SvgXml} from 'react-native-svg';
// import SoundRecorder from 'react-native-sound-recorder';
import AudioRecord from 'react-native-audio-record';
import {Buffer} from 'buffer';
import {toHHMMSS} from '../trackPlayer/utils';

const RecordAudioPopUp = ({visible, onClose, onRecord}) => {
  const [isRecord, setIsRecord] = useState(false);
  const [pause, setPause] = useState(false);
  const [recordTime, setRecordTime] = useState(60);
  const timer = useRef(null);

  const options = {
    sampleRate: 16000,
    channels: 1, 
    bitsPerSample: 16,
    audioSource: 6,
    wavFile: 'test.mp3'
  };

  AudioRecord.init(options);

  useEffect(() => {
    if(recordTime == 0){
      handleStop();
    }

  }, [recordTime]);

  const startTimer = () => {
    timer.current = setInterval(() => {
      setRecordTime(prevTime => prevTime - 1);
    }, 1000);
  };

  const stopTimer = () => {
    if (timer.current) {
      clearInterval(timer.current);
      timer.current = null;
    }
  };

  const RBtn = ({title, icon, OnPress}) => {
    return (
      <Pressable
        onPress={OnPress}
        style={{
          alignSelf: 'center',
          marginTop: '8%',
        }}>
        <SvgXml xml={icon} />
        <Text
          style={{
            color: 'rgba(0, 0, 0, 0.45)',
            fontFamily: fonts.medium,
            fontSize: RFValue(9),
            textAlign: 'center',
            marginTop: '1%',
            textTransform: 'uppercase',
          }}>
          {title}
        </Text>
      </Pressable>
    );
  };

  const Recording = ({}) => {
    return (
      <View>
        <Text
          style={{
            color: 'rgba(251, 38, 38, 1)',
            fontFamily: fonts.medium,
            fontSize: RFValue(22),
            textAlign: 'center',
            marginTop: '5%',
            textTransform: 'uppercase',
          }}>
          {/* {Math.floor(recordTime%3600/60)}:{Math.floor(recordTime % 3600 % 60)} */}
          {toHHMMSS(recordTime)}
        </Text>
        <View style={{flexDirection: 'row', alignSelf: 'center'}}>
          <RBtn
            title={'STOP'}
            icon={stop}
            OnPress={() => {
              handleStop();
            }}
          />
          {/* <Text>{'        '}</Text>
          <RBtn
            title={pause ? 'START' : 'PAUSE'}
            icon={pause ? start : pauseIcon}
            OnPress={() => {
              handlePause();
            }}
          /> */}
          <Text>{'        '}</Text>
          <RBtn
            title={'CANCEL'}
            icon={cancel}
            OnPress={() => {
              setIsRecord(false);
              setRecordTime(60);
              stopTimer();
              AudioRecord.stop();
              onClose();
            }}
          />
        </View>
      </View>
    );
  };

  const handleStart = () => {
    startTimer();
    AudioRecord.start();
  };

  const handlePause = () => {
    setPause(!pause);
    if (!pause) {
      AudioRecord.pause();
    } else {
      AudioRecord.resume();
      startTimer();
    }
  };

  const handleStop = async () => {
    console.log('handleStop>');
    let audioFile = await AudioRecord.stop();
    console.log('audioFile>',audioFile);
    //  setFilePath(audioFile);
    //  chunk = Buffer.from(audioFile, 'base64');
    //   stopTimer();
    let file = `file://${audioFile}`;
    console.log('file>',file);

    onRecord(file);
    stopTimer();
    setIsRecord(false);
    setRecordTime(60);
    onClose();
  };

  const StartRecording = ({}) => {
    return (
      <View>
        <Text
          style={{
            color: 'rgba(0, 0, 0, 0.25)',
            fontFamily: fonts.medium,
            fontSize: RFValue(12),
            textAlign: 'center',
            marginTop: '5%',
            textTransform: 'uppercase',
          }}>
          Tap to Start Recording
        </Text>

        <Pressable
          onPress={() => {
            setIsRecord(true);
            handleStart();
          }}
          style={{
            alignSelf: 'center',
            marginTop: '12%',
          }}>
          <SvgXml xml={start} />
          <Text
            style={{
              color: 'rgba(0, 0, 0, 0.45)',
              fontFamily: fonts.medium,
              fontSize: RFValue(9),
              textAlign: 'center',
              marginTop: '1%',
              textTransform: 'uppercase',
            }}>
            START
          </Text>
        </Pressable>
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={() => console.log('rr')}>
      <Pressable
        onPress={() => {
          if (!isRecord) {
            onClose();
          }
        }}
        style={{
          flex: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          justifyContent: 'flex-end',
          alignItems: 'center',
        }}>
        <View
          style={{
            height: hp('25%'),
            backgroundColor: 'white',
            width: wp('100%'),
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
          }}>
          {!isRecord && <StartRecording />}
          {isRecord && <Recording />}
        </View>
      </Pressable>
    </Modal>
  );
};

export default RecordAudioPopUp;

const start = `<svg xmlns="http://www.w3.org/2000/svg" width="42" height="42" viewBox="0 0 42 42" fill="none">
<rect width="42" height="42" rx="21" fill="#FB2626"/>
<g filter="url(#filter0_d_8062_28110)">
<rect x="14" y="14" width="14" height="14" rx="7" fill="white"/>
</g>
<defs>
<filter id="filter0_d_8062_28110" x="10" y="14" width="22" height="22" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="4"/>
<feGaussianBlur stdDeviation="2"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_8062_28110"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_8062_28110" result="shape"/>
</filter>
</defs>
</svg>`;

const stop = `<svg xmlns="http://www.w3.org/2000/svg" width="42" height="42" viewBox="0 0 42 42" fill="none">
<rect width="42" height="42" rx="21" fill="#FB2626"/>
<g filter="url(#filter0_d_8062_28292)">
<rect x="14" y="14" width="14" height="14" fill="white"/>
</g>
<defs>
<filter id="filter0_d_8062_28292" x="10" y="14" width="22" height="22" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="4"/>
<feGaussianBlur stdDeviation="2"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_8062_28292"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_8062_28292" result="shape"/>
</filter>
</defs>
</svg>`;

const cancel = `<svg xmlns="http://www.w3.org/2000/svg" width="42" height="41" viewBox="0 0 42 41" fill="none">
<rect x="0.636017" width="40.7279" height="40.7281" rx="20.364" fill="#F5F5F5"/>
<rect x="14.636" y="16.8286" width="4" height="14" transform="rotate(-45 14.636 16.8286)" fill="#646464"/>
<rect x="24.5355" y="14" width="4" height="14" transform="rotate(45 24.5355 14)" fill="#646464"/>
</svg>`;

const pauseIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="42" height="42" viewBox="0 0 42 42" fill="none">
<rect width="42" height="42" rx="21" fill="#FB2626"/>
<g filter="url(#filter0_d_8062_28296)">
<rect x="13" y="14" width="7" height="14" fill="white"/>
</g>
<g filter="url(#filter1_d_8062_28296)">
<rect x="22" y="14" width="7" height="14" fill="white"/>
</g>
<defs>
<filter id="filter0_d_8062_28296" x="9" y="14" width="15" height="22" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="4"/>
<feGaussianBlur stdDeviation="2"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_8062_28296"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_8062_28296" result="shape"/>
</filter>
<filter id="filter1_d_8062_28296" x="18" y="14" width="15" height="22" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="4"/>
<feGaussianBlur stdDeviation="2"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_8062_28296"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_8062_28296" result="shape"/>
</filter>
</defs>
</svg>`;
